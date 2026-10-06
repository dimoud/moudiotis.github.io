/* «Εμπειρία & Εξειδίκευση»: ακορντεόν + τεχνικό σχέδιο δίαξονου φορτηγού
   Ν3 με ζωντανό υπολογισμό κατανομής φορτίων αξόνων. Χωρίς JavaScript
   μένει η στατική λύση για x = 4,12 m. */
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

    // ── υπολογισμός: δίαξονο Ν3, ισορροπία ροπών ως προς τον εμπρός άξονα ──
    //    R = R0 + Q·x/WB,  F = (F0 + R0 + Q) − R,  έλεγχος F ≤ Fmax, R ≤ Rmax
    var art = root.querySelector('.apf-art');
    var calc = root.querySelector('.apf-calc');
    if (!art || !calc) return;
    var F0 = 4800, R0 = 2700, Q = 10000, WB = 5.00, FMAX = 7100, RMAX = 11500, K = 60, XF = 134, X0 = 4.12;
    var DEC = calc.getAttribute('data-dec') || ',', TH = calc.getAttribute('data-th') || '.';
    var EL = calc.getAttribute('data-lang') !== 'en';
    var MSG = EL
        ? { ok: '✓ εντός ορίων', f: '✗ υπέρβαση εμπρός άξονα', r: '✗ υπέρβαση πίσω άξονα' }
        : { ok: '✓ within limits', f: '✗ front axle overloaded', r: '✗ rear axle overloaded' };
    var q = function (s) { return root.querySelectorAll(s); };
    var dec = function (v, d) { return v.toFixed(d).replace('.', DEC); };
    var kg = function (v) { return Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, TH); };
    var one = function (s) { return root.querySelector(s); };
    var cg = one('[data-cg]'), cgExt = one('[data-cgx]'), aDim = one('[data-adim]'), aTx = one('[data-atx]'),
        fLine = one('[data-fline]'), rLine = one('[data-rline]'), range = one('.apf-range');
    var cgx0 = XF + X0 * K;
    function each(sel, fn) { [].forEach.call(q(sel), fn); }

    function set(x) {
        var R = R0 + Q * x / WB, F = F0 + R0 + Q - R;
        var st = F > FMAX ? 'f' : (R > RMAX ? 'r' : 'ok');
        var px = XF + x * K;
        if (cg) cg.setAttribute('transform', 'translate(' + (px - cgx0).toFixed(1) + ' 0)');
        if (cgExt) cgExt.setAttribute('d', 'M' + px.toFixed(1) + ' 248 V400');
        if (aDim) aDim.setAttribute('d', 'M' + XF + ' 392 H' + px.toFixed(1) + ' M' + (XF - 4) + ' 386 l8 12 M' + (px - 4).toFixed(1) + ' 386 l8 12');
        if (aTx) aTx.setAttribute('x', ((XF + px) / 2).toFixed(1));
        if (fLine) fLine.setAttribute('d', 'M' + XF + ' ' + (306 + F * 0.0042).toFixed(1) + ' V306');
        if (rLine) rLine.setAttribute('d', 'M' + (XF + WB * K) + ' ' + (306 + R * 0.0042).toFixed(1) + ' V306');
        each('[data-v="x"]', function (e) { e.textContent = dec(x, 2); });
        each('[data-v="R"]', function (e) { e.textContent = kg(R); });
        each('[data-v="F"]', function (e) { e.textContent = kg(F); });
        each('[data-v="st"]', function (e) { e.textContent = MSG[st]; e.className = 'is-' + st; });
        art.setAttribute('data-state', st);
        if (range && document.activeElement !== range) range.value = x.toFixed(2);
    }

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var visible = false, userUntil = 0, t0 = null, raf = 0, cur = X0, auto = false;
    function loop(ts) {
        raf = 0;
        if (!visible) return;
        if (ts > userUntil) {
            // ήπια μετακίνηση του φορτίου 3,82 … 4,42 m (κυρίως εντός ορίων)
            if (!auto) { auto = true; t0 = ts; }
            var t = (ts - t0) / 1000;
            var target = 4.12 + 0.30 * Math.sin(t * 2 * Math.PI / 12);
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
