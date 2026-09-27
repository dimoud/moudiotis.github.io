/* search.js — αναζήτηση στον ιστότοπο (μπάρα στο μενού).
   Διαβάζει το /search-index.json (χτίζεται από ~/gen/search_index.py) και δείχνει
   τις σχετικές σελίδες στη γλώσσα της σελίδας. Χωρίς εξωτερικές υπηρεσίες. */
(function () {
    'use strict';
    var boxes = document.querySelectorAll('.nav-search');
    if (!boxes.length) return;
    var EN = (document.documentElement.lang || 'el').indexOf('en') === 0;
    var IDX = null, loading = null;
    function norm(s) {
        return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ς/g, 'σ');
    }
    function load() {
        if (IDX) return Promise.resolve(IDX);
        if (!loading) loading = fetch('/search-index.json').then(function (r) { return r.json(); }).then(function (d) {
            IDX = d.map(function (p) { return { p: p, t: norm(p.t), d: norm(p.d), k: norm(p.k) }; });
            return IDX;
        }).catch(function () { loading = null; return []; });
        return loading;
    }
    function search(q) {
        var words = norm(q).split(/[^0-9a-zα-ω.]+/).filter(function (w) { return w.length > 1; });
        if (!words.length) return [];
        var lang = EN ? 'en' : 'el';
        return IDX.filter(function (x) { return x.p.l === lang; }).map(function (x) {
            var s = 0;
            for (var i = 0; i < words.length; i++) {
                var w = words[i], stem = w.length > 4 ? w.slice(0, -1) : w, hit = 0;
                if (x.t.indexOf(w) >= 0) hit = 8;
                else if (x.t.indexOf(stem) >= 0) hit = 6;
                else if (x.d.indexOf(stem) >= 0) hit = 3;
                else if (x.k.indexOf(stem) >= 0) hit = 2;
                if (!hit) return null;
                s += hit;
            }
            return { p: x.p, s: s - x.t.length / 100 };
        }).filter(Boolean).sort(function (a, b) { return b.s - a.s; }).slice(0, 6);
    }
    function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
    boxes.forEach(function (box) {
        var inp = box.querySelector('input'), res = box.querySelector('.nav-search-res'), sel = -1, cur = [];
        function render() {
            var q = inp.value.trim();
            if (q.length < 2) { res.hidden = true; box.classList.remove('has-res'); return; }
            load().then(function () {
                cur = search(q); sel = -1;
                res.innerHTML = cur.length ? cur.map(function (r, i) {
                    return '<a href="' + r.p.u + '" data-i="' + i + '"><b>' + esc(r.p.t) + '</b><span>' + esc(r.p.d.slice(0, 110)) + (r.p.d.length > 110 ? '…' : '') + '</span></a>';
                }).join('') : '<p class="nav-search-none">' + (EN ? 'No results. Call us: 210 756 1836' : 'Δεν βρέθηκε κάτι. Καλέστε μας: 210 756 1836') + '</p>';
                res.hidden = false; box.classList.add('has-res');
            });
        }
        function mark() { res.querySelectorAll('a').forEach(function (a, i) { a.classList.toggle('is-sel', i === sel); }); }
        inp.addEventListener('focus', load);
        inp.addEventListener('input', render);
        inp.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowDown') { sel = Math.min(sel + 1, cur.length - 1); mark(); e.preventDefault(); }
            else if (e.key === 'ArrowUp') { sel = Math.max(sel - 1, 0); mark(); e.preventDefault(); }
            else if (e.key === 'Enter') { var r = cur[sel >= 0 ? sel : 0]; if (r) { location.href = r.p.u; } e.preventDefault(); }
            else if (e.key === 'Escape') { inp.value = ''; res.hidden = true; box.classList.remove('has-res'); inp.blur(); }
        });
        box.addEventListener('submit', function (e) { e.preventDefault(); });
        document.addEventListener('click', function (e) { if (!box.contains(e.target)) { res.hidden = true; box.classList.remove('has-res'); } });
        /* μέσα στο μενού κινητού: το άγγιγμα στην αναζήτηση να μην κλείνει το μενού */
        box.addEventListener('click', function (e) { e.stopPropagation(); });
    });

    /* Κινητό: κουμπί «Αναζήτηση» στην κάτω μπάρα — ανοίγει/κλείνει το πάνελ αναζήτησης */
    var mb = document.querySelector('.mcb-search'), panel = document.getElementById('mcbSearch');
    if (mb && panel) {
        var pin = panel.querySelector('input');
        function setP(on) {
            panel.hidden = !on; mb.setAttribute('aria-expanded', on ? 'true' : 'false'); mb.classList.toggle('is-on', on);
            if (on) { load(); setTimeout(function () { pin.focus(); }, 30); } else { pin.blur(); }
        }
        mb.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); setP(panel.hidden); });
        document.addEventListener('click', function (e) { if (!panel.hidden && !panel.contains(e.target) && e.target !== mb) setP(false); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) setP(false); });
    }
})();
