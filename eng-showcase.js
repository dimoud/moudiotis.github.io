/* eng-showcase.js — αρχική σελίδα, κάτω από τις υπηρεσίες.
 * Τρεις «σκηνές» μηχανικού που εναλλάσσονται: υπολογισμός αντοχής πλαισίου,
 * μετατροπή ΕΧΕΣ (βαν → αυτοκινούμενο) και φάκελος έγκρισης τύπου με σφραγίδα.
 * Μόνο SVG + CSS (styles.css: «ΒΙΤΡΙΝΑ ΜΗΧΑΝΙΚΟΥ»). Ξεκινά όταν φανεί στην οθόνη. */
(function () {
    'use strict';
    var wrap = document.getElementById('engShowcase');
    if (!wrap) return;
    var EN = (document.documentElement.getAttribute('lang') || 'el').toLowerCase().indexOf('en') === 0;
    function t(el, en) { return EN ? en : el; }
    var DUR = 7000;

    var SCENES = [
        { tab: t('Υπολογισμοί αντοχής', 'Strength calculations'),
          read: [[t('Όριο διαρροής', 'Yield strength'), 355, ' MPa', 0],
                 [t('Μέγιστη τάση', 'Max stress'), 142, ' MPa', 0],
                 [t('Συντ. ασφαλείας', 'Safety factor'), 2.5, '', 1]] },
        { tab: t('ΕΧΕΣ · Μετατροπές', 'Special vehicles · Conversions'),
          read: [[t('Άξονας 1', 'Axle 1'), 46, ' %', 0],
                 [t('Άξονας 2', 'Axle 2'), 54, ' %', 0],
                 [t('Κωδικός αμαξώματος', 'Body code'), 'SA', '', 0]] },
        { tab: t('Έγκριση τύπου', 'Type approval'),
          read: [[t('Έλεγχοι', 'Checks'), '4 / 4', '', 0],
                 [t('Κανονισμός', 'Regulation'), '(ΕΕ) 2018/858', '', 0],
                 [t('Κατάσταση', 'Status'), t('Εγκρίθηκε', 'Approved'), '', 0]] }
    ];
    if (EN) SCENES[2].read[1][1] = '(EU) 2018/858';

    function D(d, delay, extra) { return '<path class="es-d" pathLength="1" style="--d:' + (delay || 0) + 's" d="' + d + '"' + (extra || '') + '/>'; }
    function C(cx, cy, r, delay) { return '<circle class="es-d" pathLength="1" style="--d:' + (delay || 0) + 's" cx="' + cx + '" cy="' + cy + '" r="' + r + '"/>'; }

    /* ── Σκηνή 1: πλαίσιο οχήματος, φορτίο, αντιδράσεις, διάγραμμα ροπών ── */
    var arrows = '';
    for (var x = 272, k = 0; x <= 672; x += 40, k++) {
        arrows += '<g class="es-drop" style="--d:' + (1.2 + k * 0.05).toFixed(2) + 's"><line x1="' + x + '" y1="112" x2="' + x + '" y2="160"/><path d="M' + (x - 5) + ' 153 L' + x + ' 162 L' + (x + 5) + ' 153"/></g>';
    }
    var s1 =
        '<g class="es-scene" data-s="0">' +
        '<g class="es-ln">' +
        D('M40 250 L780 250', 0, ' opacity=".35" stroke-width="1"') +
        D('M120 184 L700 184 L700 170 L120 170 Z', 0.1) +
        D('M120 170 L120 92 Q122 72 150 70 L228 70 L232 170', 0.3) +
        D('M134 118 L134 92 Q136 82 150 82 L218 82 L220 118 Z', 0.45, ' opacity=".6"') +
        C(185, 228, 22, 0.5) + C(185, 228, 7, 0.6) + C(560, 228, 22, 0.55) + C(560, 228, 7, 0.65) + C(620, 228, 22, 0.6) + C(620, 228, 7, 0.7) +
        D('M270 112 L674 112', 1.1, ' stroke-dasharray="4 5"') +
        '</g>' +
        '<g class="es-arrows">' + arrows + '</g>' +
        '<text class="es-lbl es-f" style="--d:1.5s" x="472" y="100">q = ' + t('φορτίο υπερκατασκευής', 'superstructure load') + '</text>' +
        '<g class="es-react es-f" style="--d:1.9s"><path d="M185 300 L185 262 M179 270 L185 260 L191 270"/><path d="M590 300 L590 262 M584 270 L590 260 L596 270"/></g>' +
        '<g class="es-ln">' + D('M185 306 L620 306', 2.0, ' stroke-width="1" opacity=".5"') + '</g>' +
        '<path class="es-moment es-d" pathLength="1" style="--d:2.2s" d="M185 306 Q402 350 620 306"/>' +
        '<text class="es-lbl es-f" style="--d:2.8s" x="402" y="340">M(x)</text>' +
        '<g class="es-hot es-f" style="--d:3.0s"><circle cx="402" cy="177" r="10"/><circle cx="402" cy="177" r="20"/></g>' +
        '</g>';

    /* ── Σκηνή 2: βαν → αυτοκινούμενο, εσωτερική διαρρύθμιση, κέντρο βάρους ── */
    var s2 =
        '<g class="es-scene" data-s="1">' +
        '<g class="es-ln">' +
        D('M40 250 L780 250', 0, ' opacity=".35" stroke-width="1"') +
        D('M140 205 L140 115 Q142 92 172 90 L555 90 Q590 90 612 125 L675 142 Q698 148 698 170 L698 205 Z', 0.1) +
        D('M566 100 Q586 102 600 126 L566 126 Z', 0.4, ' opacity=".6"') +
        C(230, 228, 22, 0.5) + C(230, 228, 7, 0.6) + C(600, 228, 22, 0.55) + C(600, 228, 7, 0.65) +
        '</g>' +
        '<g class="es-ln es-in">' +
        D('M190 90 L204 58 L516 58 L530 90', 1.2) +
        D('M160 185 L160 140 L282 140 L282 185', 1.4) +
        D('M300 185 L300 128 L382 128 L382 185', 1.55) +
        C(341, 140, 7, 1.7) +
        D('M404 150 L466 150 M412 150 L412 185 M458 150 L458 185', 1.75) +
        D('M480 185 L480 150 L540 150', 1.9) +
        '</g>' +
        '<g class="es-cg es-f" style="--d:2.3s"><g class="es-cg-m"><circle cx="430" cy="116" r="11"/><path d="M419 116 L441 116 M430 105 L430 127"/></g></g>' +
        '<g class="es-bars es-f" style="--d:2.6s">' +
        '<rect class="es-bar" x="214" y="262" width="32" height="42"/><rect class="es-bar es-bar--b" x="584" y="262" width="32" height="50"/>' +
        '</g>' +
        '<text class="es-code es-f" style="--d:3.0s" x="420" y="330">' + t('ΚΩΔΙΚΟΣ ΑΜΑΞΩΜΑΤΟΣ', 'BODY CODE') + ' · SA</text>' +
        '</g>';

    /* ── Σκηνή 3: φάκελος έγκρισης, λίστα ελέγχων, σφραγίδα ── */
    var rows = '', labels = [t('Τεχνικός φάκελος', 'Technical file'), t('Δοκιμές και μετρήσεις', 'Tests and measurements'), t('Πιστοποιητικό συμμόρφωσης', 'Certificate of conformity'), t('Καταχώρηση ΤΑΟ', 'TAO registration')];
    for (var i = 0; i < 4; i++) {
        var y = 132 + i * 44;
        rows += '<g class="es-row es-f" style="--d:' + (0.9 + i * 0.45).toFixed(2) + 's"><rect x="258" y="' + (y - 14) + '" width="18" height="18" rx="3"/>' +
            '<text x="290" y="' + (y + 1) + '">' + labels[i] + '</text>' +
            '<path class="es-tick" style="--d:' + (1.2 + i * 0.45).toFixed(2) + 's" pathLength="1" d="M262 ' + (y - 5) + ' L267 ' + y + ' L275 ' + (y - 11) + '"/></g>';
    }
    var s3 =
        '<g class="es-scene" data-s="2">' +
        '<g class="es-ln">' +
        D('M236 36 L484 36 L512 64 L512 320 L236 320 Z', 0) +
        D('M484 36 L484 64 L512 64', 0.3) +
        D('M258 70 L420 70', 0.45, ' stroke-width="3"') + D('M258 90 L470 90', 0.55, ' opacity=".45"') +
        '</g>' + rows +
        '<g class="es-stamp"><g class="es-stamp-in">' +
        '<circle cx="596" cy="236" r="74"/><circle cx="596" cy="236" r="63" stroke-dasharray="3 4"/>' +
        '<text class="es-stamp-t" x="596" y="238">' + t('ΕΓΚΡΙΘΗΚΕ', 'APPROVED') + '</text>' +
        '<text class="es-stamp-s" x="596" y="258">e13 · 2018/858</text>' +
        '</g></g>' +
        '</g>';

    var tabs = SCENES.map(function (s, i) {
        return '<button type="button" class="es-tab" data-i="' + i + '"><b>0' + (i + 1) + '</b>' + s.tab + '</button>';
    }).join('');
    wrap.innerHTML =
        '<div class="es-tabs">' + tabs + '</div>' +
        '<div class="es-stage"><svg viewBox="0 0 820 350" fill="none" role="img" aria-label="' + t('Υπολογισμοί, μετατροπές και έγκριση τύπου', 'Calculations, conversions and type approval') + '">' + s1 + s2 + s3 + '</svg></div>' +
        '<div class="es-read"><div class="es-r"><span></span><b></b></div><div class="es-r"><span></span><b></b></div><div class="es-r"><span></span><b></b></div></div>';
    wrap.style.setProperty('--es-dur', DUR + 'ms');

    var scenes = wrap.querySelectorAll('.es-scene'), tabEls = wrap.querySelectorAll('.es-tab'), reads = wrap.querySelectorAll('.es-r');
    var cur = -1, timer = null, running = false;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function fmt(v, dec) { return dec ? v.toFixed(dec).replace('.', EN ? '.' : ',') : Math.round(v).toLocaleString(EN ? 'en-GB' : 'el-GR'); }
    function count(el, to, suf, dec, delay) {
        if (typeof to !== 'number' || reduce) { el.textContent = (typeof to === 'number' ? fmt(to, dec) : to) + suf; return; }
        var t0 = null, dur = 1300;
        el.textContent = fmt(0, dec) + suf;
        setTimeout(function () {
            function step(ts) {
                if (!t0) t0 = ts;
                var p = Math.min(1, (ts - t0) / dur), e = 1 - Math.pow(1 - p, 3);
                el.textContent = fmt(to * e, dec) + suf;
                if (p < 1 && running) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
        }, delay);
    }
    function show(i) {
        cur = i;
        scenes.forEach(function (s, k) { s.classList.remove('is-on'); });
        tabEls.forEach(function (b, k) { b.classList.remove('is-on'); });
        void wrap.offsetWidth; /* επανεκκίνηση των κινήσεων CSS */
        scenes[i].classList.add('is-on');
        tabEls[i].classList.add('is-on');
        SCENES[i].read.forEach(function (r, k) {
            reads[k].querySelector('span').textContent = r[0];
            count(reads[k].querySelector('b'), r[1], r[2], r[3], 600 + k * 350);
        });
    }
    function next() { show((cur + 1) % scenes.length); schedule(); }
    function schedule() { clearTimeout(timer); if (running && !reduce) timer = setTimeout(next, DUR); }
    function start() { if (running) return; running = true; wrap.classList.add('is-running'); if (cur < 0) show(0); schedule(); }
    function stop() { running = false; wrap.classList.remove('is-running'); clearTimeout(timer); }

    tabEls.forEach(function (b) {
        b.addEventListener('click', function () { show(+b.getAttribute('data-i')); schedule(); });
    });
    if (reduce) { wrap.classList.add('es-static'); show(0); return; }
    if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) start(); else stop(); }); }, { threshold: 0.3 }).observe(wrap);
    } else { start(); }
})();
