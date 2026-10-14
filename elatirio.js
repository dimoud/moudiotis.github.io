/*
 * elatirio.js — φυσική κίνηση χωρίς βιβλιοθήκη: ελατήριο με απόσβεση, αδράνεια, ιχνηλάτης ταχύτητας
 * Βιβλιοθήκη: features/elatirio/ · τεκμηρίωση: references/19-fysiki-kinisi.md · καμία εξάρτηση
 *
 * Εξίσωση:  ẍ = −ωₙ²·(x − στόχος) − 2·ζ·ωₙ·ẋ        (μονάδες: ό,τι μονάδα έχει το x, ανά δευτερόλεπτο)
 * Ολοκλήρωση: ημι-πεπλεγμένη Euler με ΣΤΑΘΕΡΟ βήμα 1/240 s και συσσωρευτή — ίδια τροχιά σε 60 Hz,
 * 120 Hz και σε παγωμένο ρολόι (kinisi_export.py). Ένα κοινό requestAnimationFrame για όλα τα
 * ελατήρια, που ΣΤΑΜΑΤΑ όταν όλα ηρεμήσουν (καμία συνεχής κίνηση — ΜΗ-37).
 *
 *   var s = Elatirio.create({ zeta: .7, ts: .6, value: 0, onUpdate: function (x) {
 *             el.style.transform = 'translateY(' + x.toFixed(2) + 'px)'; } });
 *   s.set(120);                 // νέος στόχος — το ελατήριο τον ακολουθεί
 *   s.impulse(-800);            // ώθηση σε μονάδες/s (π.χ. από σύρσιμο)
 *
 *   Elatirio.wn(zeta, ts)       // ωₙ από χρόνο αποκατάστασης 2 % (s)
 *   Elatirio.overshoot(zeta)    // υπερύψωση ως κλάσμα (0,046 για ζ = 0,7)
 *   Elatirio.analytic(zeta, wn, x0, v0, t)   // κλειστή λύση — για επαλήθευση σε Python και για σκηνές με χρόνο
 *   Elatirio.inertia(v, tau)    // απόσταση που θα διανύσει ελεύθερα (v·τ) — για «πέταγμα» με snap
 *   Elatirio.tracker()          // .add(x, tMs) / .velocity() σε μονάδες/s από τα τελευταία 100 ms
 *
 * Μειωμένη κίνηση: με prefers-reduced-motion το set() πηγαίνει απευθείας στον στόχο (ένα onUpdate + onRest).
 */
(function (root) {
    'use strict';
    var H = 1 / 240;                 /* σταθερό βήμα ολοκλήρωσης, s */
    var MAX_DT = 1 / 15;             /* μετά από κρυφή καρτέλα: όχι «έκρηξη» από τεράστιο dt */
    var live = [], raf = 0, last = 0;
    var mq = root.matchMedia ? root.matchMedia('(prefers-reduced-motion: reduce)') : null;

    function reduced() { return !!(mq && mq.matches); }

    /* ωₙ από χρόνο αποκατάστασης tₛ (κριτήριο 2 %, απόκριση βήματος από ηρεμία).
       Αριθμητικά, όχι με την προσέγγιση 4/(ζωₙ), ώστε να ισχύει και για ζ ≥ 1:
       Τ*(ζ) = ωₙ·tₛ αδιάστατο (ζ = 1 → 5,83 · ζ = 0,8 → 3,75 · ζ = 0,7 → 5,98 · ζ = 0,4 → 8,41).
       Όχι μονότονο: όταν μια κορυφή πέφτει μέσα στη ζώνη 2 %, το tₛ πηδά (references/19 §Α). */
    var cacheT = {};
    function settleDimless(zeta) {
        var k = zeta.toFixed(3);
        if (cacheT[k]) return cacheT[k];
        var lastOut = 0;
        for (var t = 0; t <= 60; t += .002) if (Math.abs(analytic(zeta, 1, 1, 0, t)) > .02) lastOut = t;
        return (cacheT[k] = lastOut);
    }
    function wn(zeta, ts) { return settleDimless(zeta) / ts; }
    function overshoot(zeta) { return zeta >= 1 ? 0 : Math.exp(-zeta * Math.PI / Math.sqrt(1 - zeta * zeta)); }

    /* x(t) για x(0) = x0, ẋ(0) = v0, στόχος 0 */
    function analytic(zeta, w, x0, v0, t) {
        if (zeta < 1) {
            var wd = w * Math.sqrt(1 - zeta * zeta);
            return Math.exp(-zeta * w * t) * (x0 * Math.cos(wd * t) + (v0 + zeta * w * x0) / wd * Math.sin(wd * t));
        }
        if (zeta === 1) return Math.exp(-w * t) * (x0 + (v0 + w * x0) * t);
        var s = w * Math.sqrt(zeta * zeta - 1), r1 = -zeta * w + s, r2 = -zeta * w - s;
        var c2 = (v0 - r1 * x0) / (r2 - r1), c1 = x0 - c2;
        return c1 * Math.exp(r1 * t) + c2 * Math.exp(r2 * t);
    }

    function loop(now) {
        var dt = Math.min(MAX_DT, Math.max(0, (now - last) / 1000));
        last = now;
        for (var i = live.length - 1; i >= 0; i--) {
            var s = live[i];
            s.acc += dt;
            while (s.acc >= H) {                                   /* σταθερό βήμα */
                var a = -s.w * s.w * (s.x - s.target) - 2 * s.zeta * s.w * s.v;
                s.v += a * H;                                     /* πρώτα ταχύτητα, μετά θέση: ημι-πεπλεγμένη, ευσταθής */
                s.x += s.v * H;
                s.acc -= H;
            }
            if (Math.abs(s.x - s.target) < s.eps && Math.abs(s.v) < s.eps * 10) {
                s.x = s.target; s.v = 0; s.acc = 0;
                live.splice(i, 1);
                s.cb(s.x, 0);
                if (s.onRest) s.onRest(s.x);
            } else {
                s.cb(s.x, s.v);
            }
        }
        raf = live.length ? requestAnimationFrame(loop) : 0;
    }
    function wake(s) {
        if (live.indexOf(s) < 0) live.push(s);
        if (!raf) { last = performance.now(); raf = requestAnimationFrame(loop); }
    }

    function create(o) {
        var zeta = o.zeta == null ? 1 : o.zeta;
        var s = {
            zeta: zeta,
            w: o.wn || wn(zeta, o.ts || .5),
            x: o.value || 0, v: 0, acc: 0,
            target: o.value || 0,
            eps: o.precision || .01,                       /* ίδια μονάδα με το x (px, μοίρες…) */
            cb: o.onUpdate || function () {},
            onRest: o.onRest || null
        };
        return {
            set: function (t) {
                s.target = t;
                if (reduced()) { s.x = t; s.v = 0; s.cb(t, 0); if (s.onRest) s.onRest(t); return this; }
                wake(s); return this;
            },
            jump: function (t) { s.x = s.target = t; s.v = 0; s.cb(t, 0); return this; },
            impulse: function (v) { if (reduced()) return this; s.v += v; wake(s); return this; },
            stop: function () { var i = live.indexOf(s); if (i >= 0) live.splice(i, 1); return this; },
            get value() { return s.x; },
            get velocity() { return s.v; },
            get target() { return s.target; }
        };
    }

    /* ταχύτητα δείκτη από τα τελευταία 100 ms (όχι από το τελευταίο γεγονός: θόρυβος) */
    function tracker() {
        var pts = [];
        return {
            add: function (x, t) { pts.push([x, t]); while (pts.length > 2 && t - pts[0][1] > 100) pts.shift(); },
            velocity: function () {
                if (pts.length < 2) return 0;
                var a = pts[0], b = pts[pts.length - 1], dt = (b[1] - a[1]) / 1000;
                return dt > 0 ? (b[0] - a[0]) / dt : 0;
            },
            reset: function () { pts = []; }
        };
    }

    /* ελεύθερη επιβράδυνση v·e^(−t/τ): συνολική απόσταση v·τ (τ ≈ 0,325 s, κλασική τιμή κινητικής κύλισης) */
    function inertia(v, tau) { return v * (tau == null ? .325 : tau); }

    root.Elatirio = { create: create, wn: wn, overshoot: overshoot, analytic: analytic,
                      tracker: tracker, inertia: inertia, reduced: reduced, STEP: H };
})(window);
