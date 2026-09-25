/* Βήματα τρέιλερ: η επισήμανση ακολουθεί την κύλιση — κάτω προχωρά, πάνω γυρίζει πίσω */
(function () {
    var rail = document.querySelector('.hm-rail'); if (!rail) return;
    var items = rail.querySelectorAll('li'); if (!items.length) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var n = items.length, raf = 0, last = -2;
    rail.classList.add('is-playing');
    function paint() {
        raf = 0;
        var vh = window.innerHeight, i, prog;
        var r0 = items[0].getBoundingClientRect(), r1 = items[n - 1].getBoundingClientRect();
        if (r1.top - r0.top > 10) {
            /* κάθετη λίστα (κινητό): «γραμμή ανάγνωσης» στο 55% της οθόνης */
            var line = vh * 0.55, c0 = r0.top + r0.height / 2, c1 = r1.top + r1.height / 2;
            prog = Math.min(1, Math.max(0, (line - c0) / (c1 - c0)));
            i = -1;
            for (var k = 0; k < n; k++) { var r = items[k].getBoundingClientRect(); if (r.top <= line) i = k; }
            if (i < 0 && r0.top < vh * 0.9) i = 0;
        } else {
            /* οριζόντια σειρά (υπολογιστής): πρόοδος όσο η σειρά ανεβαίνει από το 85% στο 30% της οθόνης */
            var rr = rail.getBoundingClientRect();
            prog = Math.min(1, Math.max(0, (vh * 0.85 - rr.top) / (vh * 0.55)));
            i = rr.top < vh * 0.9 ? Math.min(n - 1, Math.floor(prog * n)) : -1;
        }
        rail.style.setProperty('--hm-prog', prog.toFixed(4));
        if (i === last) return; last = i;
        items.forEach(function (li, k) { li.classList.toggle('is-active', k === i); li.classList.toggle('is-done', k < i); });
    }
    function req() { if (!raf) raf = requestAnimationFrame(paint); }
    window.addEventListener('scroll', req, { passive: true });
    window.addEventListener('resize', req);
    window.addEventListener('load', req);
    paint();
})();

/* Έλεγχος Κ.Ο.Κ.: τα σημεία φωτίζονται ένα-ένα· μετά εναλλάσσεται το σχέδιο (κλειστό ρυμουλκούμενο ↔ τρέιλερ λέμβου) */
(function () {
    var sec = document.querySelector('.hm-rc'); if (!sec) return;
    var svgs = sec.querySelectorAll('.hm-rc-stage .hm-trailer'), kinds = sec.querySelectorAll('.hm-rc-kind span');
    var rows = sec.querySelectorAll('.hm-pinlist li'); if (!svgs.length || !rows.length) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var s = 0, i = -1, timer = null, STEP = 1700;
    function parts() { return { pins: svgs[s].querySelectorAll('.hm-pins > g'), leads: svgs[s].querySelectorAll('.hm-leads > line') }; }
    function paint() {
        var p = parts(), n = rows.length;
        for (var k = 0; k < n; k++) {
            var on = k === i;
            rows[k].classList.toggle('is-active', on);
            if (p.pins[k]) p.pins[k].classList.toggle('is-active', on);
            if (p.leads[k]) p.leads[k].classList.toggle('is-active', on);
        }
        sec.classList.toggle('is-cycling', i >= 0);
    }
    function show(k) {
        svgs.forEach(function (el, j) { el.classList.toggle('is-shown', j === k); });
        kinds.forEach(function (el, j) { el.classList.toggle('is-shown', j === k); });
    }
    function tick() {
        i++;
        if (i >= rows.length) {
            i = -1; paint();
            if (svgs.length > 1) { s = (s + 1) % svgs.length; show(s); timer = setTimeout(tick, 2600); }
            else timer = setTimeout(tick, 900);
            return;
        }
        paint(); timer = setTimeout(tick, STEP);
    }
    function start() { if (timer) return; timer = setTimeout(tick, 1800); }
    function stop() { clearTimeout(timer); timer = null; }
    var art = sec.querySelector('.hm-rc-art') || sec;
    if ('IntersectionObserver' in window) { new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) start(); else stop(); }); }, { threshold: 0.3 }).observe(art); } else { start(); }
})();

/* Κινητό: οι τέσσερις ετικέτες του hero έρχονται από τα άκρα προς τα μέσα καθώς ο χρήστης κυλά προς τα κάτω */
(function () {
    var wrap = document.querySelector('.hero-cta-block .hero-pillars'); if (!wrap) return;
    var ps = wrap.querySelectorAll('.hero-pillar'); if (!ps.length) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var mq = window.matchMedia('(max-width: 768px)'), D = 200, raf = 0;
    function measure() {
        var r = wrap.getBoundingClientRect(), vh = window.innerHeight;
        var absTop = r.top + window.scrollY;
        D = Math.max(180, absTop - vh * 0.42);
    }
    function ease(t) { return 1 - Math.pow(1 - t, 3); }
    function paint() {
        raf = 0;
        if (!mq.matches) { wrap.classList.remove('hp-scroll'); ps.forEach(function (p) { p.style.transform = ''; p.style.opacity = ''; }); return; }
        wrap.classList.add('hp-scroll');
        var W = window.innerWidth, vh = window.innerHeight, a = vh * 1.0, b = vh * 0.76;
        ps.forEach(function (p, k) {
            var dir = k % 2 ? 1 : -1;
            var top = p.getBoundingClientRect().top - (parseFloat(p.dataset.hpY) || 0);
            var t = Math.min(1, Math.max(0, (a - top) / (a - b)));
            var e = ease(t);
            p.style.transform = 'translateX(' + (dir * (1 - e) * W * 0.55).toFixed(1) + 'px)';
            p.style.opacity = (0.15 + 0.85 * e).toFixed(3);
        });
    }
    function req() { if (!raf) raf = requestAnimationFrame(paint); }
    measure(); paint();
    window.addEventListener('scroll', req, { passive: true });
    window.addEventListener('resize', function () { measure(); req(); });
    window.addEventListener('load', function () { measure(); req(); });
    /* τα στοιχεία πάνω από τις ετικέτες κινούνται ακόμη στο άνοιγμα της σελίδας· ξαναμετράμε για λίγα δευτερόλεπτα */
    var t0 = Date.now();
    (function loop() { paint(); if (Date.now() - t0 < 5000) requestAnimationFrame(loop); })();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(req);
})();

/* Εγκρίσεις τύπου: η γραμμή που περνά από τη μέση της οθόνης φωτίζεται — ακολουθεί την κύλιση και στις δύο κατευθύνσεις */
(function () {
    var list = document.querySelector('.hm-idx'); if (!list) return;
    var rows = list.querySelectorAll('li'); if (!rows.length) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var raf = 0, last = -2;
    list.classList.add('is-scrub');
    function paint() {
        raf = 0;
        var vh = window.innerHeight, line = vh * 0.55, i = -1, best = 1e9;
        rows.forEach(function (li, k) {
            var r = li.getBoundingClientRect();
            if (r.bottom < vh * 0.12 || r.top > vh * 0.9) return;
            var d = Math.abs(r.top + r.height / 2 - line);
            if (d < best) { best = d; i = k; }
        });
        if (i === last) return; last = i;
        rows.forEach(function (li, k) { li.classList.toggle('is-focus', k === i); });
    }
    function req() { if (!raf) raf = requestAnimationFrame(paint); }
    window.addEventListener('scroll', req, { passive: true });
    window.addEventListener('resize', req);
    window.addEventListener('load', req);
    paint();
})();
