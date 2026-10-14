/*
 * trochos-kylisi.js — στρογγυλό σήμα (λογότυπο σε δακτύλιο) που μπαίνει ως τροχός: κυλά χωρίς
 * ολίσθηση, φρενάρει, σταματά μετά από μία περιστροφή, σφραγίζεται με σήμα έγκρισης· σύρεται
 * από τον επισκέπτη και επιστρέφει με ελατήριο. Βιβλιοθήκη #31 (από moudiotis.gr, 10/2026).
 *
 *   <div class="hero-photo-wrap" data-trochos data-tk-elastiko="205/55 R16" data-tk-pedisi="0.36"
 *        data-tk-r="0.46" data-tk-sima="E23" data-tk-sima-el="ΕΓΚΡΙΣΗ ΤΥΠΟΥ · ΕΛΛΑΔΑ"
 *        data-tk-sima-en="TYPE APPROVAL · GREECE" data-tk-endeixeis>
 *     <svg data-tk-meros viewBox="0 0 500 500">…δακτύλιος…</svg>
 *     <img data-tk-meros src="logo.webp" alt="…">
 *   </div>
 *   + στη <head>, πριν από τα CSS (κρύβει τον τροχό μόνο αν θα τρέξει η κίνηση — ΜΗ-01):
 *   <script>if(window.matchMedia&&!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('tk-pre');</script>
 *
 * Φυσική (references/19): θ = x/R· σταθερή επιβράδυνση a = πέδηση·g από v₀ = √(2·a·πD)· στη στάση
 * ταλάντωση στρέψης του ελαστικού (1,2°, ζ = 0,35). Όλα σε μέτρα, με κλίμακα S = 2R/D px/m, άρα ίδιος
 * χρόνος σε κάθε μέγεθος οθόνης. Η τροχιά υπολογίζεται εκ των προτέρων σε Web Animations (compositor).
 * Μειωμένη κίνηση: τελική κατάσταση αμέσως. Εκτός οθόνης δεν τρέχει τίποτα (καμία συνεχής κίνηση).
 * Προαιρετικό: elatirio.js (#30) — σύρσιμο και ακριβής ταλάντωση· χωρίς αυτό, χωρίς σύρσιμο.
 * Ένα καθολικό: window.TrochosKylisi = { mount, enter, exit, busy }.
 */
(function () {
    'use strict';
    var G = 9.81, WIND0 = 1.2, WIND_Z = 0.35, WIND_TS = 0.5;
    var NS = 'http://www.w3.org/2000/svg';
    var root = document.documentElement;
    var reduced = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
    var all = [];

    function en() { return (root.getAttribute('lang') || 'el').toLowerCase().indexOf('en') === 0; }
    function fmt(x, d) { var s = x.toFixed(d); return en() ? s : s.replace('.', ','); }

    /* «205/55 R16» → διάμετρος σε m: ζάντα·25,4 + 2·πλάτος·λόγος */
    function tyreD(spec) {
        var m = /(\d{3})\s*\/\s*(\d{2})\s*Z?R\s*(\d{2})/i.exec(spec || '');
        return m ? (+m[3] * 25.4 + 2 * +m[1] * +m[2] / 100) / 1000 : 0;
    }
    function wnOf(z, ts) { return window.Elatirio ? Elatirio.wn(z, ts) : 4.8 / (z * ts); }
    function damp(z, w, x0, t) {
        return window.Elatirio ? Elatirio.analytic(z, w, x0, 0, t)
                               : x0 * Math.exp(-z * w * t) * Math.cos(w * Math.sqrt(1 - z * z) * t);
    }

    function mount(wrap) {
        if (!wrap || wrap.__tk) return wrap && wrap.__tk;
        var parts = [].slice.call(wrap.querySelectorAll('[data-tk-meros]'));
        if (!parts.length) { root.classList.remove('tk-pre'); return null; }
        var ds = wrap.dataset;
        var spec = ds.tkElastiko || '';
        var D = parseFloat(ds.tkDiametros) || tyreD(spec) || 0.632;
        var A = (parseFloat(ds.tkPedisi) || 0.36) * G;
        var RR = parseFloat(ds.tkR) || 0.46;               /* R / πλάτος του πρώτου μέρους */
        var svg = parts.filter(function (p) { return p.tagName.toLowerCase() === 'svg'; })[0];
        var state = 'seat', anims = [], spring = null;

        function geom() {
            var w = parts[0].getBoundingClientRect().width, R = w * RR;
            var r = wrap.getBoundingClientRect();
            return { R: R, S: 2 * R / D, cx: r.left + r.width / 2 };
        }
        function tf(x, R, extra) {
            return 'translateX(' + x.toFixed(2) + 'px) rotate(' + (x / R * 180 / Math.PI + (extra || 0)).toFixed(3) + 'deg)';
        }
        function pose(x, R, extra) { var t = tf(x, R, extra); parts.forEach(function (p) { p.style.transform = t; }); }
        function stop() { anims.forEach(function (a) { try { a.cancel(); } catch (e) {} }); anims = []; }

        /* ── είσοδος: πέδηση ως τη στάση μετά από μία περιστροφή + ταλάντωση ελαστικού ── */
        function frames(g) {
            var d = Math.PI * D, T = Math.sqrt(2 * d / A), v0 = A * T, w = wnOf(WIND_Z, WIND_TS);
            var Tt = T + WIND_TS, N = 54, M = 18, k = [];
            for (var i = 0; i <= N; i++) {
                var t = T * i / N, s = v0 * t - 0.5 * A * t * t;
                k.push({ offset: t / Tt, transform: tf((s - d) * g.S, g.R) });
            }
            for (var j = 1; j <= M; j++) {
                var tw = WIND_TS * j / M;
                k.push({ offset: (T + tw) / Tt, transform: tf(0, g.R, j === M ? 0 : damp(WIND_Z, w, WIND0, tw)) });
            }
            return { k: k, T: T, Tt: Tt, v0: v0, d: d };
        }
        function enter(first) {
            if (reduced) return;
            stop(); spring && spring.stop();
            var g = geom(), f = frames(g);
            state = 'in';
            parts.forEach(function (p) {
                p.style.transform = tf(-f.d * g.S, g.R);
                anims.push(p.animate(f.k, { duration: f.Tt * 1000, easing: 'linear', fill: 'forwards' }));
            });
            out.live(f);
            anims[0].finished.then(function () { if (state === 'in') { stop(); pose(0, g.R); state = 'seat'; } }, function () {});
            if (first) setTimeout(stamp, (f.T + 0.08) * 1000);
        }
        /* ── έξοδος: ώθηση από ηρεμία προς τα αριστερά, ως έξω από το πλαίσιο ── */
        function exit() {
            if (reduced) return;
            stop(); spring && spring.stop();
            var g = geom(), dPx = g.cx + g.R + 12, T = Math.sqrt(2 * dPx / g.S / A), N = 32, k = [];
            for (var i = 0; i <= N; i++) { var t = T * i / N; k.push({ offset: i / N, transform: tf(-0.5 * A * t * t * g.S, g.R) }); }
            state = 'out'; out.hide();
            parts.forEach(function (p) { anims.push(p.animate(k, { duration: T * 1000, easing: 'linear', fill: 'forwards' })); });
            anims[0].finished.then(function () { if (state === 'out') { stop(); pose(-dPx, g.R); state = 'away'; } }, function () {});
        }

        /* ── σήμα στο πλευρικό τοίχωμα (μέσα στο SVG, άρα γυρίζει μαζί με τον τροχό) ── */
        var mark = null, markIn = null;
        function buildMark() {
            if (!svg || !ds.tkSima) return;
            var vb = (svg.getAttribute('viewBox') || '0 0 500 500').split(/[\s,]+/).map(Number);
            var cx = vb[0] + vb[2] / 2, cy = vb[1] + vb[3] / 2, r = (parseFloat(ds.tkSimaR) || 0.4) * vb[2];
            var a = parseFloat(ds.tkSimaGonia);
            if (isNaN(a)) {                     /* auto: στο κενό μετά το τελευταίο κείμενο σε τόξο, ως τις 9 (180°) */
                a = 168;
                try {
                    var tx = svg.querySelectorAll('textPath'), last = tx[tx.length - 1].parentNode;
                    a = (Math.min(172, last.getComputedTextLength() / r * 180 / Math.PI) + 180) / 2;
                } catch (e) {}
            }
            var rad = a * Math.PI / 180, s = vb[2] / 500;
            mark = document.createElementNS(NS, 'g');
            mark.setAttribute('class', 'tk-sima');
            mark.setAttribute('transform', 'translate(' + (cx + r * Math.cos(rad)).toFixed(1) + ',' + (cy + r * Math.sin(rad)).toFixed(1) +
                ') rotate(' + (a - 90).toFixed(1) + ') scale(' + s.toFixed(3) + ')');
            markIn = document.createElementNS(NS, 'g');
            markIn.setAttribute('class', 'tk-sima-in');
            markIn.innerHTML = '<circle r="15" class="tk-sima-c"/><text y="4" font-size="11.5" text-anchor="middle" class="tk-sima-t"></text>';
            markIn.lastChild.textContent = ds.tkSima;
            mark.appendChild(markIn);
            svg.appendChild(mark);
        }
        function stamp() {
            if (!mark) buildMark();
            if (!mark) { out.ok(); return; }
            mark.classList.add('is-on');
            if (reduced) { out.ok(); return; }
            /* προετοιμασία (ψηλά) → πτώση με επιτάχυνση → κρούση → ελατήριο ζ = 0,5 */
            var k = [{ offset: 0, opacity: 0, transform: 'scale(1.45)' },
                     { offset: .14, opacity: 1, transform: 'scale(1.45)', easing: 'cubic-bezier(.55,0,1,.45)' },
                     { offset: .34, opacity: 1, transform: 'scale(.92)' }];
            var z = .5, ts = .32, w = wnOf(z, ts);
            for (var i = 1; i <= 14; i++) {
                k.push({ offset: .34 + .66 * i / 14, opacity: 1,
                         transform: 'scale(' + (1 + (i === 14 ? 0 : damp(z, w, -.08, ts * i / 14))).toFixed(4) + ')' });
            }
            markIn.animate(k, { duration: 480, easing: 'linear', fill: 'backwards' });
            setTimeout(out.ok, 170);                       /* η ένδειξη αλλάζει τη στιγμή της επαφής */
        }

        /* ── ενδείξεις τεχνικού σχεδίου (μόνο με data-tk-endeixeis· κρυφές στο κινητό από το CSS) ── */
        var out = (function () {
            var nop = { live: function () {}, ok: function () {}, hide: function () {}, fin: function () {} };
            if (!('tkEndeixeis' in ds)) return nop;
            var box = document.createElement('div');
            box.className = 'tk-endeixeis'; box.setAttribute('aria-hidden', 'true');
            box.innerHTML = '<span></span><span class="tk-e2"></span><span class="tk-e3"></span>';
            wrap.appendChild(box);
            var l = box.children, raf = 0, done = false, f = null;
            function head() {                             /* κεφαλαία στις λέξεις, όχι στις μονάδες (mm ≠ MM) */
                l[0].textContent = (en() ? 'FIG. 01 · WHEEL ' : 'ΣΧ. 01 · ΤΡΟΧΟΣ ') + (spec ? spec + ' · ' : '') + 'Ø ' + Math.round(D * 1000) + ' mm';
            }
            function line(v, s, fin) {
                l[1].textContent = 'v ' + fmt(v * 3.6, 1) + ' km/h · s ' + fmt(s, 2) + ' m' +
                    (fin ? ' · ' + (en() ? 'BRAKING ' : 'ΠΕΔΗΣΗ ') + fmt(A / G, 2) + ' g' : '');
                var lab = en() ? ds.tkSimaEn : ds.tkSimaEl;
                l[2].textContent = done && ds.tkSima ? ds.tkSima + (lab ? ' · ' + lab : '') : ' ';
            }
            head();
            document.addEventListener('langchange', function () { head(); if (f) line(0, f.d, true); });
            return {
                live: function (fr) {
                    f = fr; box.classList.add('is-on'); cancelAnimationFrame(raf);
                    var last = 0;
                    (function tick(now) {
                        var a = anims[0], t = a && a.currentTime != null ? a.currentTime / 1000 : f.T;
                        if (t >= f.T || state !== 'in') { line(0, f.d, true); return; }
                        if (now - last > 33) { last = now; line(f.v0 - A * t, f.v0 * t - 0.5 * A * t * t, false); }
                        raf = requestAnimationFrame(tick);
                    })(0);
                },
                ok: function () { done = true; if (f) line(0, f.d, true); },
                hide: function () { cancelAnimationFrame(raf); box.classList.remove('is-on'); },
                fin: function () { f = { d: Math.PI * D }; box.classList.add('is-on'); line(0, f.d, true); }
            };
        })();

        /* ── σύρσιμο: κυλά με το χέρι, επιστρέφει με ελατήριο ζ = 0,7 ── */
        function drag() {
            if (!window.Elatirio || reduced) return;
            var g = geom(), tr = Elatirio.tracker(), x0 = 0, px0 = 0, x = 0, id = null;
            spring = Elatirio.create({ zeta: .7, ts: .7, value: 0, precision: .05,
                onUpdate: function (v) { x = v; pose(v, g.R); },
                onRest: function () { if (state === 'drag') state = 'seat'; } });
            wrap.classList.add('tk-syrsimo');
            wrap.addEventListener('pointerdown', function (e) {
                if ((state !== 'seat' && state !== 'drag') || e.button !== 0) return;
                g = geom(); state = 'drag'; id = e.pointerId;
                spring.stop(); x0 = x; px0 = e.clientX; tr.reset(); tr.add(x, e.timeStamp);
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

        var api = {
            enter: function () { enter(false); }, exit: exit,
            busy: function () { return state === 'drag' || state === 'in'; },
            start: function () {
                root.classList.add('tk-on');
                if (reduced) { root.classList.remove('tk-pre'); stamp(); out.fin(); out.ok(); return; }
                enter(true);                               /* οι κινήσεις υπάρχουν πριν φύγει η κρυφή θέση */
                root.classList.remove('tk-pre');
                anims[0] && anims[0].finished.then(drag, function () {});
            }
        };
        wrap.__tk = api; all.push(api);
        return api;
    }

    function pick(el) { return el ? mount(el) : all[0]; }
    function auto() {
        var els = document.querySelectorAll('[data-trochos]');
        if (!els.length) { root.classList.remove('tk-pre'); return; }
        [].forEach.call(els, function (el) { var t = mount(el); if (t && el.dataset.tkEkkinisi !== 'manual') t.start(); });
    }
    /* μετά το DOMContentLoaded: σενάρια που μετακινούν τα μέρη (π.χ. hero-anim.js) έχουν ήδη τρέξει */
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', auto);
    else auto();

    window.TrochosKylisi = {
        mount: mount,
        enter: function (el) { var t = pick(el); if (t) t.enter(); },
        exit:  function (el) { var t = pick(el); if (t) t.exit(); },
        busy:  function (el) { var t = pick(el); return !!(t && t.busy()); },
        tyreD: tyreD
    };
}());
