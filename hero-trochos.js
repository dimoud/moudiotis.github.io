/*
 * hero-trochos.js — ο δακτύλιος του λογοτύπου ως τροχός (πρώτη οθόνη, v2.15)
 *
 * Μηχανισμός: τροχός 205/55 R16 (Ø 632 mm) μπαίνει κυλώντας χωρίς ολίσθηση
 * (θ = x / R), φρενάρει με σταθερή επιβράδυνση 0,36 g, σταματά ακριβώς μετά από
 * μία περιστροφή, και η ελαστικότητα του ελαστικού δίνει μια μικρή ταλάντωση
 * (ζ = 0,35). Στο πλευρικό τοίχωμα «σφραγίζεται» το σήμα έγκρισης τύπου E23
 * (Ελλάδα, Συμφωνία ΟΗΕ 1958). Όταν η εναλλαγή του hero-anim.js πάει στα σκίτσα,
 * ο τροχός φεύγει κυλώντας προς τα αριστερά και ξαναμπαίνει όταν έρθει η σειρά του.
 *
 * Υλοποίηση: η κίνηση υπολογίζεται εκ των προτέρων και παίζει με Web Animations
 * (στον compositor, ομαλή και όσο ο κύριος νήμας φορτώνει τη σελίδα). Μετά το
 * σταμάτημα ο επισκέπτης μπορεί να σύρει τον τροχό· επιστρέφει με ελατήριο
 * (elatirio.js), πάντα κυλώντας.
 * Μειωμένη κίνηση: τελική κατάσταση αμέσως (σήμα και ενδείξεις στη θέση τους).
 * Απαιτεί: elatirio.js (προαιρετικό — χωρίς αυτό δεν υπάρχει σύρσιμο).
 */
(function () {
    'use strict';

    /* ── ΦΥΣΙΚΑ ΜΕΓΕΘΗ ── */
    var D_TYRE  = (16 * 25.4 + 2 * 0.55 * 205) / 1000;  /* 205/55 R16 → 0,6319 m */
    var G       = 9.81;
    var A_BRAKE = 0.36 * G;                              /* m/s², πέδηση και ώθηση */
    var WIND0   = 1.2;                                   /* μοίρες: στρέψη ελαστικού στη στάση */
    var WIND_Z  = 0.35, WIND_TS = 0.5;                   /* ζ, tₛ (s) της ταλάντωσης */
    var R_UNITS = 230;                                   /* εξωτερικός κύκλος στο viewBox 500 */

    var svg  = document.querySelector('.hero .hero-orbit-svg');
    var wrap = svg && svg.closest('.hero-photo-wrap');
    var img  = document.getElementById('heroPhoto');
    var root = document.documentElement;
    if (!svg || !wrap || !img) { root.classList.remove('ht-pre'); return; }

    var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var en = function () { return (root.getAttribute('lang') || 'el').toLowerCase().indexOf('en') === 0; };
    var fmt = function (x, d) { var s = x.toFixed(d); return en() ? s : s.replace('.', ','); };

    /* τροχός = δακτύλιος + λογότυπο, πάντα με τον ίδιο μετασχηματισμό */
    var parts = [svg, img];
    var state = 'seat';            /* seat | in | out | away | drag */
    var anims = [];

    function geom() {
        var w = svg.getBoundingClientRect().width;
        var R = w * R_UNITS / 500;                       /* px */
        var cx = wrap.getBoundingClientRect().left + wrap.offsetWidth / 2;
        return { R: R, S: 2 * R / D_TYRE, cx: cx };      /* S: px ανά m */
    }
    function tf(x, R, extraDeg) {
        return 'translateX(' + x.toFixed(2) + 'px) rotate(' + (x / R * 180 / Math.PI + (extraDeg || 0)).toFixed(3) + 'deg)';
    }
    function setPose(x, R, extra) {
        var t = tf(x, R, extra);
        parts.forEach(function (el) { el.style.transform = t; });
    }
    function stopAnims() {
        anims.forEach(function (a) { try { a.cancel(); } catch (e) {} });
        anims = [];
    }

    /* ── ΕΙΣΟΔΟΣ: πέδηση μέχρι στάση μετά από μία περιστροφή ── */
    function entryFrames(g) {
        var dReal = Math.PI * D_TYRE;                    /* 1 περιστροφή, m */
        var T  = Math.sqrt(2 * dReal / A_BRAKE);         /* s */
        var v0 = A_BRAKE * T;                            /* m/s */
        var wn = window.Elatirio ? Elatirio.wn(WIND_Z, WIND_TS) : 4.82 / (WIND_Z * WIND_TS);
        var Ttot = T + WIND_TS, N = 54, M = 18, k = [];
        for (var i = 0; i <= N; i++) {
            var t = T * i / N;
            var s = v0 * t - 0.5 * A_BRAKE * t * t;      /* m */
            var x = -dReal * g.S + s * g.S;              /* px: από −2πR έως 0 */
            k.push({ offset: t / Ttot, transform: tf(x, g.R) });
        }
        for (var j = 1; j <= M; j++) {
            var tw = WIND_TS * j / M;
            var phi = window.Elatirio ? Elatirio.analytic(WIND_Z, wn, WIND0, 0, tw)
                                      : WIND0 * Math.exp(-WIND_Z * wn * tw) * Math.cos(wn * tw);
            k.push({ offset: (T + tw) / Ttot, transform: tf(0, g.R, j === M ? 0 : phi) });
        }
        return { k: k, T: T, Ttot: Ttot, v0: v0, dReal: dReal };
    }

    function enter(first) {
        stopAnims();
        var g = geom(), f = entryFrames(g);
        state = 'in';
        parts.forEach(function (el) {
            el.style.transform = tf(-f.dReal * g.S, g.R);
            anims.push(el.animate(f.k, { duration: f.Ttot * 1000, easing: 'linear', fill: 'forwards' }));
        });
        readout.live(f);
        anims[0].finished.then(function () {
            if (state !== 'in') return;
            stopAnims(); setPose(0, g.R); state = 'seat';
        }, function () {});
        if (first) setTimeout(stampMark, (f.T + 0.08) * 1000);
    }

    /* ── ΕΞΟΔΟΣ: ώθηση από ηρεμία προς τα αριστερά, μέχρι να βγει από το πλαίσιο ── */
    function exit() {
        if (reduced) return;
        stopAnims(); spring && spring.stop();
        var g = geom();
        var dPx = g.cx + g.R + 12, dReal = dPx / g.S;
        var T = Math.sqrt(2 * dReal / A_BRAKE), N = 32, k = [];
        for (var i = 0; i <= N; i++) {
            var t = T * i / N, x = -0.5 * A_BRAKE * t * t * g.S;
            k.push({ offset: i / N, transform: tf(x, g.R) });
        }
        state = 'out';
        readout.hide();
        parts.forEach(function (el) {
            anims.push(el.animate(k, { duration: T * 1000, easing: 'linear', fill: 'forwards' }));
        });
        anims[0].finished.then(function () {
            if (state !== 'out') return;
            stopAnims(); setPose(-dPx, g.R); state = 'away';
        }, function () {});
    }

    /* ── ΣΗΜΑ ΕΓΚΡΙΣΗΣ E23 στο πλευρικό τοίχωμα ── */
    var NS = 'http://www.w3.org/2000/svg', mark = null, markIn = null;
    function buildMark() {
        /* στο κενό ανάμεσα στο τέλος του κάτω κειμένου και στο σημάδι των 9 (180°) */
        var texts = svg.querySelectorAll('.orbit-text'), endDeg = 160;
        try {
            var len = texts[1].getComputedTextLength();        /* μονάδες χρήστη, ακτίνα 200 */
            endDeg = Math.min(172, len / 200 * 180 / Math.PI);
        } catch (e) {}
        var a = (endDeg + 180) / 2, rad = a * Math.PI / 180;
        var x = 250 + 200 * Math.cos(rad), y = 250 + 200 * Math.sin(rad);
        mark = document.createElementNS(NS, 'g');
        mark.setAttribute('class', 'ht-emark');
        mark.setAttribute('transform', 'translate(' + x.toFixed(1) + ',' + y.toFixed(1) + ') rotate(' + (a - 90).toFixed(1) + ')');
        markIn = document.createElementNS(NS, 'g');
        markIn.setAttribute('class', 'ht-emark-in');
        markIn.innerHTML = '<circle r="15" class="ht-emark-c"/><text y="4" text-anchor="middle" class="ht-emark-t">E23</text>';
        mark.appendChild(markIn);
        svg.appendChild(mark);
    }
    function stampMark() {
        if (!mark) buildMark();
        if (reduced) { mark.classList.add('is-on'); readout.ok(); return; }
        /* προετοιμασία (ψηλά, μεγάλο) → πτώση με επιτάχυνση → κρούση → ελατήριο ζ = 0,5 */
        var k = [{ offset: 0, opacity: 0, transform: 'scale(1.45)' },
                 { offset: .14, opacity: 1, transform: 'scale(1.45)', easing: 'cubic-bezier(.55,0,1,.45)' },
                 { offset: .34, opacity: 1, transform: 'scale(.92)' }];
        var z = .5, ts = .32, w = window.Elatirio ? Elatirio.wn(z, ts) : 4.8 / (z * ts);
        for (var i = 1; i <= 14; i++) {
            var t = ts * i / 14, d = window.Elatirio ? Elatirio.analytic(z, w, -.08, 0, t) : 0;
            k.push({ offset: .34 + .66 * i / 14, opacity: 1, transform: 'scale(' + (1 + (i === 14 ? 0 : d)).toFixed(4) + ')' });
        }
        mark.classList.add('is-on');
        markIn.animate(k, { duration: 480, easing: 'linear', fill: 'backwards' });
        setTimeout(readout.ok, 170);                 /* η ένδειξη αλλάζει τη στιγμή της επαφής */
    }

    /* ── ΕΝΔΕΙΞΕΙΣ (υπολογιστής): ΣΧ. 01 · v · s ── */
    var readout = (function () {
        var box = document.createElement('div');
        box.className = 'ht-readout';
        box.setAttribute('aria-hidden', 'true');
        box.innerHTML = '<span class="ht-l1"></span><span class="ht-l2"></span>';
        wrap.appendChild(box);
        var l1 = box.firstChild, l2 = box.lastChild, raf = 0, done = false, f = null;
        function head() {
            /* κεφαλαία στις λέξεις, όχι στις μονάδες (mm ≠ MM) — γι' αυτό όχι text-transform */
            l1.textContent = (en() ? 'FIG. 01 · WHEEL' : 'ΣΧ. 01 · ΤΡΟΧΟΣ') + ' 205/55 R16 · Ø ' + Math.round(D_TYRE * 1000) + ' mm';
        }
        function line(v, s, final) {
            var txt = 'v ' + fmt(v * 3.6, 1) + ' km/h · s ' + fmt(s, 2) + ' m';
            if (final) txt += ' · ' + (en() ? 'BRAKING ' : 'ΠΕΔΗΣΗ ') + fmt(A_BRAKE / G, 2) + ' g';
            l2.textContent = txt;
            if (done) {
                var ok = document.createElement('b');
                ok.className = 'ht-ok';
                ok.textContent = ' · E23 ' + (en() ? 'TYPE APPROVAL · GREECE' : 'ΕΓΚΡΙΣΗ ΤΥΠΟΥ · ΕΛΛΑΔΑ');
                l2.appendChild(ok);
            }
        }
        head();
        document.addEventListener('langchange', function () { head(); if (f) line(0, f.dReal, true); });
        return {
            live: function (fr) {
                f = fr; box.classList.add('is-on');
                cancelAnimationFrame(raf);
                var last = 0;
                (function tick(now) {
                    var a = anims[0], t = a && a.currentTime != null ? a.currentTime / 1000 : f.T;
                    if (t >= f.T || state !== 'in') { line(0, f.dReal, true); return; }
                    if (now - last > 33) {                        /* 30 Hz: αρκεί για αριθμούς */
                        last = now;
                        line(f.v0 - A_BRAKE * t, f.v0 * t - 0.5 * A_BRAKE * t * t, false);
                    }
                    raf = requestAnimationFrame(tick);
                })(0);
            },
            ok: function () { done = true; if (f) line(0, f.dReal, true); },
            hide: function () { cancelAnimationFrame(raf); box.classList.remove('is-on'); },
            final: function () { f = { dReal: Math.PI * D_TYRE }; box.classList.add('is-on'); line(0, f.dReal, true); }
        };
    })();

    /* ── ΣΥΡΣΙΜΟ: κύλιση με το χέρι, επιστροφή με ελατήριο ── */
    var spring = null;
    function enableDrag() {
        if (!window.Elatirio || reduced) return;
        var g = geom(), tr = Elatirio.tracker(), x0 = 0, px0 = 0, x = 0, id = null;
        spring = Elatirio.create({ zeta: .7, ts: .7, value: 0, precision: .05,
            onUpdate: function (v) { x = v; setPose(v, g.R); },
            onRest: function () { if (state === 'drag') state = 'seat'; } });
        wrap.classList.add('ht-drag');
        wrap.addEventListener('pointerdown', function (e) {
            if (state !== 'seat' && state !== 'drag') return;
            if (e.button !== 0) return;
            g = geom(); state = 'drag'; id = e.pointerId;
            spring.stop(); x0 = x; px0 = e.clientX;
            tr.reset(); tr.add(x, e.timeStamp);
            try { wrap.setPointerCapture(id); } catch (er) {}
            wrap.classList.add('is-grab');
        });
        wrap.addEventListener('pointermove', function (e) {
            if (e.pointerId !== id) return;
            var lim = g.R * .9, nx = x0 + e.clientX - px0;
            if (nx > lim) nx = lim + (nx - lim) * .3;          /* αντίσταση πέρα από 0,9 R */
            if (nx < -lim) nx = -lim + (nx + lim) * .3;
            spring.jump(nx); tr.add(nx, e.timeStamp);
        });
        function up(e) {
            if (e.pointerId !== id) return;
            id = null; wrap.classList.remove('is-grab');
            spring.impulse(tr.velocity()).set(0);               /* η ταχύτητα του χεριού περνά στον τροχό */
        }
        wrap.addEventListener('pointerup', up);
        wrap.addEventListener('pointercancel', up);
        window.addEventListener('resize', function () { g = geom(); });
    }

    /* ── ΕΚΚΙΝΗΣΗ: μετά το hero-anim.js, που μετακινεί το λογότυπο στη σκηνή του ── */
    function start() {
        root.classList.add('ht-on');
        if (reduced) {
            root.classList.remove('ht-pre');
            stampMark(); readout.final(); readout.ok();
            return;
        }
        enter(true);                                   /* οι κινήσεις υπάρχουν πριν αφαιρεθεί η κρυφή θέση */
        root.classList.remove('ht-pre');
        anims[0] && anims[0].finished.then(enableDrag, function () {});
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();

    window.HeroTrochos = {
        enter: function () { if (!reduced) enter(false); },
        exit: exit,
        busy: function () { return state === 'drag' || state === 'in'; }
    };
}());
