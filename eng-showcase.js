/* eng-showcase.js — αρχική σελίδα, κάτω από τις υπηρεσίες.
 * «Οθόνη μηχανικού» σε τρεις σκηνές που εναλλάσσονται:
 *   1. Ανάλυση αντοχής πλαισίου (χάρτης τάσεων, παραμόρφωση, ανιχνευτής τάσης, υπολογισμοί)
 *   2. ΕΧΕΣ · μετατροπή βαν: μάζες εξοπλισμού, κέντρο βάρους, φορτία αξόνων
 *   3. Έγκριση τύπου: έλεγχοι φακέλου, σφραγίδα
 * Οι αριθμοί είναι ενδεικτικό παράδειγμα και συμφωνούν μεταξύ τους.
 * Στυλ: styles.css «ΒΙΤΡΙΝΑ ΜΗΧΑΝΙΚΟΥ». Ξεκινά μόνο όταν φανεί στην οθόνη. */
(function () {
    'use strict';
    var wrap = document.getElementById('engShowcase');
    if (!wrap) return;
    var EN = (document.documentElement.getAttribute('lang') || 'el').toLowerCase().indexOf('en') === 0;
    function t(el, en) { return EN ? en : el; }
    function n(s) { return EN ? s : s.replace(/(\d)\.(\d)/g, '$1,$2'); }
    var DUR = 10500;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function D(d, delay, extra) {
        if (extra && extra.cls === 'es-ghost') return '<path class="es-ghost es-f" style="--d:' + (delay || 0) + 's" d="' + d + '"/>';
        return '<path class="es-d' + (extra && extra.cls ? ' ' + extra.cls : '') + '" pathLength="1" style="--d:' + (delay || 0) + 's" d="' + d + '"/>';
    }
    function C(cx, cy, r, delay, cls) { return '<circle class="es-d' + (cls ? ' ' + cls : '') + '" pathLength="1" style="--d:' + (delay || 0) + 's" cx="' + cx + '" cy="' + cy + '" r="' + r + '"/>'; }
    function wheel(cx, cy, d) { return C(cx, cy, 30, d) + C(cx, cy, 19, d + 0.1, 'es-thin') + C(cx, cy, 6, d + 0.2); }
    var TH = { cls: 'es-thin' }, GH = { cls: 'es-ghost' }, GR = { cls: 'es-ground' }, BO = { cls: 'es-bold' };

    /* ── ΣΚΗΝΗ 1 · ΑΝΑΛΥΣΗ ΑΝΤΟΧΗΣ ΠΛΑΙΣΙΟΥ ── */
    var mesh = '';
    for (var mx = 72; mx < 600; mx += 12) mesh += 'M' + mx + ' 250 L' + mx + ' 268 ';
    var arrows = '';
    for (var ax = 214, k = 0; ax <= 574; ax += 36, k++) {
        arrows += '<g class="es-drop" style="--d:' + (1.5 + k * 0.04).toFixed(2) + 's"><line x1="' + ax + '" y1="200" x2="' + ax + '" y2="244"/><path d="M' + (ax - 4) + ' 237 L' + ax + ' 246 L' + (ax + 4) + ' 237"/></g>';
    }
    var s1 =
        '<g class="es-scene" data-s="0">' +
        '<defs><linearGradient id="esHeat" x1="60" x2="600" y1="0" y2="0" gradientUnits="userSpaceOnUse">' +
        '<stop offset="0" stop-color="#1b4f8f"/><stop offset=".13" stop-color="#2a7fc4"/><stop offset=".3" stop-color="#3fb68b"/>' +
        '<stop offset=".45" stop-color="#f1c84b"/><stop offset=".55" stop-color="#e2562e"/><stop offset=".66" stop-color="#f1c84b"/>' +
        '<stop offset=".8" stop-color="#3fb68b"/><stop offset=".9" stop-color="#2a7fc4"/><stop offset="1" stop-color="#1b4f8f"/></linearGradient>' +
        '<linearGradient id="esLegend" x1="0" x2="1"><stop offset="0" stop-color="#1b4f8f"/><stop offset=".35" stop-color="#3fb68b"/><stop offset=".7" stop-color="#f1c84b"/><stop offset="1" stop-color="#e2562e"/></linearGradient></defs>' +
        '<g class="es-ln">' +
        D('M20 330 L620 330', 0, GR) +
        D('M60 250 L60 150 Q62 118 92 112 L150 108 Q166 108 172 126 L180 250', 0.1) +
        D('M74 176 L74 134 Q76 124 92 122 L148 120 Q158 120 161 132 L166 176 Z', 0.3, TH) +
        D('M60 200 L50 200 L50 244 L60 244 M52 214 L60 214 M52 228 L60 228', 0.35, TH) +
        D('M60 250 L600 250 L600 268 L60 268 Z', 0.4) +
        wheel(130, 298, 0.55) + wheel(470, 298, 0.6) + wheel(540, 298, 0.65) +
        D('M200 196 L584 196 L584 246 L200 246 Z', 1.1, GH) +
        '</g>' +
        '<path class="es-mesh es-d" pathLength="1" style="--d:0.9s" d="' + mesh + '"/>' +
        '<rect class="es-heat" x="60" y="250" width="540" height="18" fill="url(#esHeat)"/>' +
        '<g class="es-arrows">' + arrows + '</g>' +
        '<text class="es-t es-f" style="--d:1.8s" x="392" y="188">q = ' + n('8.2') + ' kN/m</text>' +
        '<g class="es-react es-f" style="--d:2.2s"><path d="M130 372 L130 336 M124 344 L130 334 L136 344"/><path d="M505 372 L505 336 M499 344 L505 334 L511 344"/>' +
        '<text x="130" y="390">R₁</text><text x="505" y="390">R₂</text></g>' +
        '<path class="es-defl es-d" pathLength="1" style="--d:3.2s" d="M130 268 Q318 312 505 268"/>' +
        '<text class="es-t es-t--c es-f" style="--d:3.6s" x="318" y="318">δ ×50</text>' +
        '<g class="es-dim es-f" style="--d:2.4s"><path d="M130 352 L505 352 M130 346 L130 358 M505 346 L505 358"/><text x="318" y="347">L = ' + n('4.60') + ' m</text></g>' +
        '<g class="es-inset es-f" style="--d:0.8s"><rect x="452" y="18" width="164" height="132" rx="6"/>' +
        '<text class="es-cap" x="464" y="36">' + t('ΔΙΑΤΟΜΗ ΔΟΚΟΥ', 'RAIL SECTION') + '</text>' +
        '<path class="es-ibeam" d="M500 50 L556 50 L556 58 L532 58 L532 122 L556 122 L556 130 L500 130 L500 122 L524 122 L524 58 L500 58 Z"/>' +
        '<path class="es-dimi" d="M570 50 L570 130 M566 50 L574 50 M566 130 L574 130 M500 140 L556 140 M500 136 L500 144 M556 136 L556 144"/>' +
        '<text class="es-cap es-cap--r" x="606" y="94">h 250</text><text class="es-cap es-cap--s" x="514" y="147">b 80</text>' +
        '</g>' +
        '<g class="es-probe"><line class="es-probe-l" x1="0" y1="226" x2="0" y2="276"/><circle class="es-probe-c" cx="0" cy="259" r="6"/>' +
        '<g class="es-probe-tag"><rect x="-46" y="204" width="92" height="20" rx="4"/><text class="es-probe-t" x="0" y="218">σ = 0 MPa</text></g></g>' +
        '<g class="es-f" style="--d:3.8s"><rect x="150" y="398" width="300" height="8" rx="2" fill="url(#esLegend)"/>' +
        '<text class="es-cap es-cap--s" x="150" y="420">0</text><text class="es-cap es-cap--s es-cap--r" x="450" y="420">142 MPa</text></g>' +
        '</g>';

    /* ── ΣΚΗΝΗ 2 · ΕΧΕΣ: ΚΕΝΤΡΟ ΒΑΡΟΥΣ ΚΑΙ ΦΟΡΤΙΑ ΑΞΟΝΩΝ ── */
    var parts = [
        [108, 176, 116, 52, t('Κρεβάτι', 'Bed'), '85'], [236, 164, 88, 64, t('Κουζίνα', 'Kitchen'), '120'],
        [336, 190, 66, 38, t('Νερό', 'Water'), '100'], [414, 176, 76, 52, t('Σαλόνι', 'Lounge'), '80']
    ];
    var pr = '';
    parts.forEach(function (p, i) {
        pr += '<g class="es-part es-f" style="--d:' + (1.2 + i * 0.3).toFixed(1) + 's"><rect x="' + p[0] + '" y="' + p[1] + '" width="' + p[2] + '" height="' + p[3] + '" rx="3"/>' +
            '<text x="' + (p[0] + p[2] / 2) + '" y="' + (p[1] + p[3] / 2 - 2) + '">' + p[4] + '</text>' +
            '<text class="es-part-m" x="' + (p[0] + p[2] / 2) + '" y="' + (p[1] + p[3] / 2 + 12) + '">' + p[5] + ' kg</text></g>';
    });
    var s2 =
        '<g class="es-scene" data-s="1">' +
        '<g class="es-ln">' +
        D('M20 330 L620 330', 0, GR) +
        D('M90 262 L90 150 Q92 120 124 118 L470 118 Q512 118 536 160 L590 178 Q612 184 612 206 L612 262 Z', 0.1) +
        D('M478 128 Q506 130 522 160 L478 160 Z', 0.4, TH) +
        D('M140 118 L154 84 L446 84 L460 118', 1.0, GH) +
        wheel(160, 298, 0.5) + wheel(520, 298, 0.55) +
        '</g>' + pr +
        '<g class="es-cg es-f" style="--d:2.6s"><g class="es-cg-m"><circle cx="370" cy="244" r="12"/><path d="M358 244 L382 244 M370 232 L370 256"/><path class="es-cg-q" d="M370 244 L370 232 A12 12 0 0 1 382 244 Z M370 244 L370 256 A12 12 0 0 1 358 244 Z"/></g></g>' +
        '<g class="es-dim es-f" style="--d:2.2s"><path d="M160 356 L520 356 M160 350 L160 362 M520 350 L520 362"/><text x="340" y="351">L = ' + n('3.30') + ' m</text>' +
        '<path d="M160 376 L318 376 M318 370 L318 382"/><text x="239" y="394">x<tspan dy="3" font-size="8">G</tspan><tspan dy="-3"> = ' + n('1.78') + ' m</tspan></text></g>' +
        '<g class="es-react es-f" style="--d:3.4s"><path d="M160 342 L160 334 M154 340 L160 330 L166 340" transform="translate(0,-4)"/><path d="M520 342 L520 334 M514 340 L520 330 L526 340" transform="translate(0,-4)"/></g>' +
        '<text class="es-code es-f" style="--d:3.8s" x="300" y="60">' + t('ΚΩΔΙΚΟΣ ΑΜΑΞΩΜΑΤΟΣ', 'BODY CODE') + ' · SA</text>' +
        '</g>';

    /* ── ΣΚΗΝΗ 3 · ΕΓΚΡΙΣΗ ΤΥΠΟΥ ── */
    var rows = '', labels = [t('Τεχνικός φάκελος', 'Technical file'), t('Δοκιμές και μετρήσεις', 'Tests and measurements'), t('Πιστοποιητικό συμμόρφωσης', 'Certificate of conformity'), t('Καταχώρηση ΤΑΟ', 'TAO registration')];
    for (var i = 0; i < 4; i++) {
        var y = 150 + i * 46;
        rows += '<g class="es-row es-f" style="--d:' + (0.9 + i * 0.5).toFixed(2) + 's"><rect x="150" y="' + (y - 14) + '" width="18" height="18" rx="3"/>' +
            '<text x="182" y="' + (y + 1) + '">' + labels[i] + '</text>' +
            '<path class="es-tick" style="--d:' + (1.2 + i * 0.5).toFixed(2) + 's" pathLength="1" d="M154 ' + (y - 5) + ' L159 ' + y + ' L167 ' + (y - 11) + '"/></g>';
    }
    var s3 =
        '<g class="es-scene" data-s="2">' +
        '<g class="es-ln">' +
        D('M128 40 L380 40 L408 68 L408 360 L128 360 Z', 0) +
        D('M380 40 L380 68 L408 68', 0.3) +
        D('M150 78 L320 78', 0.45, BO) + D('M150 100 L380 100', 0.55, GH) +
        D('M150 330 L380 330', 0.6, GH) +
        '</g>' + rows +
        '<g class="es-stamp"><g class="es-stamp-in">' +
        '<circle cx="480" cy="268" r="74"/><circle cx="480" cy="268" r="63" stroke-dasharray="3 4"/>' +
        '<text class="es-stamp-t" x="480" y="270">' + t('ΕΓΚΡΙΘΗΚΕ', 'APPROVED') + '</text>' +
        '<text class="es-stamp-s" x="480" y="290">e13 · 2018/858</text>' +
        '</g></g>' +
        '</g>';

    /* ── Υπολογισμοί ανά σκηνή (γράφονται γραμμή-γραμμή) ── */
    var CALC = [
        { h: t('ΑΝΑΛΥΣΗ ΑΝΤΟΧΗΣ ΠΛΑΙΣΙΟΥ', 'CHASSIS STRENGTH ANALYSIS'), l: [
            ['M<sub>max</sub> = q·L² / 8 = ' + n('8.2') + '·' + n('4.60') + '² / 8', n('21.7') + ' kNm'],
            ['W<sub>x</sub> ' + t('διατομής', 'of section'), n('152.6') + ' cm³'],
            ['σ<sub>max</sub> = M / W', '142 MPa'],
            ['f<sub>y</sub> ' + t('χάλυβα', 'steel') + ' S355', '355 MPa'],
            ['V = f<sub>y</sub> / σ<sub>max</sub>', n('2.50') + ' ≥ ' + n('1.5') + ' ✓'],
            [t('Βέλος κάμψης', 'Deflection'), 'δ ≤ L/250 ✓']] },
        { h: t('ΚΕΝΤΡΟ ΒΑΡΟΥΣ · ΦΟΡΤΙΑ ΑΞΟΝΩΝ', 'CENTRE OF GRAVITY · AXLE LOADS'), l: [
            ['Σm = ' + (EN ? '2,480' : '2.480') + ' + 385', (EN ? '2,865' : '2.865') + ' kg'],
            ['x<sub>G</sub> = Σ(m·x) / Σm', n('1.78') + ' m'],
            ['R₁ = Σm·(L − x<sub>G</sub>) / L', (EN ? '1,318' : '1.318') + ' kg · 46%'],
            ['R₂ = Σm − R₁', (EN ? '1,547' : '1.547') + ' kg · 54%'],
            [t('Όρια αξόνων', 'Axle limits'), t('εντός ✓', 'within ✓')],
            [t('Κωδικός αμαξώματος', 'Body code'), 'SA']] },
        { h: t('ΦΑΚΕΛΟΣ ΕΓΚΡΙΣΗΣ ΤΥΠΟΥ', 'TYPE APPROVAL DOSSIER'), l: [
            [t('Κανονισμός', 'Regulation'), EN ? '(EU) 2018/858' : '(ΕΕ) 2018/858'],
            [t('Κατηγορίες', 'Categories'), 'M · N · O'],
            [t('Τεχνικές απαιτήσεις', 'Technical requirements'), '4 / 4 ✓'],
            [t('Πιστοποιητικό συμμόρφωσης', 'Certificate of conformity'), t('εκδόθηκε', 'issued')],
            [t('Καταχώρηση ΤΑΟ', 'TAO registration'), t('ολοκληρώθηκε', 'completed')],
            [t('Κατάσταση', 'Status'), t('Εγκρίθηκε ✓', 'Approved ✓')]] }
    ];
    var TABS = [t('Υπολογισμοί αντοχής', 'Strength calculations'), t('ΕΧΕΣ · Μετατροπές', 'Special vehicles · Conversions'), t('Έγκριση τύπου', 'Type approval')];

    wrap.innerHTML =
        '<div class="es-tabs">' + TABS.map(function (s, i) { return '<button type="button" class="es-tab" data-i="' + i + '"><b>0' + (i + 1) + '</b>' + s + '</button>'; }).join('') + '</div>' +
        '<div class="es-screen">' +
        '<div class="es-bar"><i></i><i></i><i></i><span class="es-bar-t"></span><span class="es-bar-r">' + t('ΜΟΥΔΙΩΤΗΣ · ΤΕΧΝΙΚΟ ΓΡΑΦΕΙΟ', 'MOUDIOTIS · ENGINEERING') + '</span></div>' +
        '<div class="es-body"><div class="es-stage"><svg viewBox="0 0 640 430" fill="none" role="img" aria-label="' + t('Υπολογισμοί αντοχής, κέντρο βάρους και έγκριση τύπου', 'Strength calculations, centre of gravity and type approval') + '">' + s1 + s2 + s3 + '</svg></div>' +
        '<div class="es-calc"><div class="es-calc-h"></div><ol class="es-calc-l"></ol></div></div></div>';
    wrap.style.setProperty('--es-dur', DUR + 'ms');

    var scenes = wrap.querySelectorAll('.es-scene'), tabEls = wrap.querySelectorAll('.es-tab');
    var calcH = wrap.querySelector('.es-calc-h'), calcL = wrap.querySelector('.es-calc-l'), barT = wrap.querySelector('.es-bar-t');
    var probe = wrap.querySelector('.es-probe'), probeT = wrap.querySelector('.es-probe-t');
    var cur = -1, timer = null, running = false, gen = 0;

    function typeCalc(i) {
        var g = gen, c = CALC[i];
        calcH.textContent = c.h; barT.textContent = c.h;
        calcL.innerHTML = c.l.map(function (r) { return '<li><span class="es-k">' + r[0] + '</span><b class="es-v"></b></li>'; }).join('');
        var lis = calcL.querySelectorAll('li');
        if (reduce) { lis.forEach(function (li, k) { li.classList.add('on'); li.querySelector('b').textContent = c.l[k][1]; }); return; }
        lis.forEach(function (li, k) {
            setTimeout(function () {
                if (g !== gen) return;
                li.classList.add('on');
                var txt = c.l[k][1], j = 0, b = li.querySelector('b');
                if (!txt) return;
                (function tick() {
                    if (g !== gen) return;
                    b.textContent = txt.slice(0, ++j);
                    if (j < txt.length) setTimeout(tick, 34);
                })();
            }, 700 + k * 950);
        });
    }
    var pRaf = 0;
    function runProbe() {
        cancelAnimationFrame(pRaf);
        if (reduce) return;
        var g = gen, t0 = null, A = 130, B = 505;
        function step(ts) {
            if (g !== gen || cur !== 0 || !running) return;
            if (!t0) t0 = ts;
            var el = (ts - t0) / 1000;
            if (el < 4) { probe.style.opacity = 0; pRaf = requestAnimationFrame(step); return; }
            var ph = ((el - 4) / 5.5) % 1, u = 0.5 - 0.5 * Math.cos(ph * 2 * Math.PI);
            var x = A + 14 + (B - A - 28) * u;
            var s = Math.max(0, 142 * 4 * (x - A) * (B - x) / Math.pow(B - A, 2));
            probe.style.opacity = 1;
            probe.setAttribute('transform', 'translate(' + x.toFixed(1) + ',0)');
            probeT.textContent = 'σ = ' + Math.round(s) + ' MPa';
            pRaf = requestAnimationFrame(step);
        }
        pRaf = requestAnimationFrame(step);
    }
    function show(i) {
        cur = i; gen++;
        scenes.forEach(function (s) { s.classList.remove('is-on'); });
        tabEls.forEach(function (b) { b.classList.remove('is-on'); });
        void wrap.offsetWidth;
        scenes[i].classList.add('is-on');
        tabEls[i].classList.add('is-on');
        probe.style.opacity = 0;
        typeCalc(i);
        if (i === 0) runProbe();
    }
    function next() { show((cur + 1) % scenes.length); schedule(); }
    function schedule() { clearTimeout(timer); if (running && !reduce) timer = setTimeout(next, DUR); }
    function start() { if (running) return; running = true; wrap.classList.add('is-running'); if (cur < 0) show(0); else if (cur === 0) runProbe(); schedule(); }
    function stop() { running = false; wrap.classList.remove('is-running'); clearTimeout(timer); cancelAnimationFrame(pRaf); }

    tabEls.forEach(function (b) { b.addEventListener('click', function () { show(+b.getAttribute('data-i')); schedule(); }); });
    if (reduce) { wrap.classList.add('es-static'); show(0); return; }
    if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) start(); else stop(); }); }, { threshold: 0.25 }).observe(wrap);
    } else { start(); }
})();
