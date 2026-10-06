/* «Εμπειρία & Εξειδίκευση»: ακορντεόν + τεχνικό σχέδιο Ο1 με ζωντανό
   υπολογισμό φορτίου ζεύξης. Ισορροπία ροπών ως προς τον άξονα:
   S·L = G·(L − a)  →  S = G·(L − a)/L,  R = G − S.
   Κριτήριο: S ≥ 4 % G και S ≤ Smax. Χωρίς JavaScript μένει η στατική
   λύση για a = 2,25 m. */
(function () {
    var root = document.getElementById('aboutProfile');
    if (!root) return;

    // ── ακορντεόν: ένα ανοιχτό κάθε φορά ──
    var items = [].slice.call(root.querySelectorAll('.apf-item'));
    root.addEventListener('click', function (e) {
        var btn = e.target.closest ? e.target.closest('.apf-btn') : null;
        if (!btn) return;
        var item = btn.closest('.apf-item');
        var open = !item.classList.contains('is-open');
        items.forEach(function (it) {
            var on = it === item && open;
            it.classList.toggle('is-open', on);
            it.querySelector('.apf-btn').setAttribute('aria-expanded', on ? 'true' : 'false');
        });
    });

    // ── υπολογισμός ──
    var art = root.querySelector('.apf-art');
    var calc = root.querySelector('.apf-calc');
    if (!art || !calc) return;
    var G = 750, L = 2.40, SMAX = 75, K = 150, X0 = 60;
    var DEC = calc.getAttribute('data-dec') || ',';
    var EL = calc.getAttribute('data-lang') !== 'en';
    var MSG = EL
        ? { ok: '✓ εντός ορίων', lo: '✗ κάτω από 4 % — αστάθεια', hi: '✗ πάνω από Smax κοτσαδόρου' }
        : { ok: '✓ within limits', lo: '✗ below 4 % — unstable', hi: '✗ above tow bar Smax' };
    var q = function (s) { return root.querySelectorAll(s); };
    var fmt = function (v, d) { return v.toFixed(d).replace('.', DEC); };
    var cg = root.querySelector('[data-cg]'), cgExt = root.querySelector('[data-cgx]'),
        aDim = root.querySelector('[data-adim]'), aTx = root.querySelector('[data-atx]'),
        sLine = root.querySelector('[data-sline]'),
        rLine = root.querySelector('[data-rline]'), rTx = root.querySelector('[data-rtx]'),
        range = root.querySelector('.apf-range');
    var A0 = 2.25, cgx0 = X0 + A0 * K;

    function set(a) {
        var S = G * (L - a) / L, R = G - S, p = S / G * 100;
        var st = S > SMAX ? 'hi' : (p < 4 ? 'lo' : 'ok');
        var x = X0 + a * K, ls = S * 0.55, lr = R * 0.065;
        if (cg) cg.setAttribute('transform', 'translate(' + (x - cgx0).toFixed(1) + ' 0)');
        if (cgExt) cgExt.setAttribute('d', 'M' + x.toFixed(1) + ' 270 V400');
        if (aDim) aDim.setAttribute('d', 'M60 392 H' + x.toFixed(1) + ' M56 386 l8 12 M' + (x - 4).toFixed(1) + ' 386 l8 12');
        if (aTx) aTx.setAttribute('x', ((X0 + x) / 2).toFixed(1));
        if (sLine) sLine.setAttribute('d', 'M60 ' + (256 + ls).toFixed(1) + ' V256');
        if (rLine) rLine.setAttribute('d', 'M420 ' + (306 + lr).toFixed(1) + ' V306');
        if (rTx) rTx.setAttribute('y', (320 + lr / 2).toFixed(1));
        [].forEach.call(q('[data-v="a"]'), function (e) { e.textContent = fmt(a, 2); });
        [].forEach.call(q('[data-v="S"]'), function (e) { e.textContent = fmt(S, 1); });
        [].forEach.call(q('[data-v="R"]'), function (e) { e.textContent = fmt(R, 1); });
        [].forEach.call(q('[data-v="p"]'), function (e) { e.textContent = fmt(p, 1); });
        [].forEach.call(q('[data-v="st"]'), function (e) { e.textContent = MSG[st]; e.className = 'is-' + st; });
        art.setAttribute('data-state', st);
        if (range && document.activeElement !== range) range.value = a.toFixed(3);
    }

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var visible = false, userUntil = 0, t0 = null, raf = 0, cur = A0, auto = false;
    function loop(ts) {
        raf = 0;
        if (!visible) return;
        if (ts > userUntil) {
            // ήπιο «φόρτωμα»: το κέντρο βάρους πηγαινοέρχεται 2,15 … 2,32 m (κυρίως εντός ορίων)
            if (!auto) { auto = true; t0 = ts; }
            var t = (ts - t0) / 1000;
            var target = 2.235 + 0.085 * Math.sin(t * 2 * Math.PI / 11);
            cur += (target - cur) * 0.06;
            set(cur);
        } else { auto = false; }
        raf = requestAnimationFrame(loop);
    }
    if (range) range.addEventListener('input', function () {
        userUntil = performance.now() + 8000;
        cur = parseFloat(range.value); auto = false;
        set(cur);
    });

    if (reduce || !('IntersectionObserver' in window)) { art.classList.add('is-in'); return; }
    art.classList.add('apf-ready');
    new IntersectionObserver(function (en) {
        en.forEach(function (x) {
            visible = x.isIntersecting;
            if (visible) {
                if (!art.classList.contains('is-in')) { art.classList.add('is-in'); userUntil = performance.now() + 4200; }
                if (!raf) raf = requestAnimationFrame(loop);
            }
        });
    }, { threshold: 0.2 }).observe(art);
})();
