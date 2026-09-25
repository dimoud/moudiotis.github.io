/* Αρχική — «οκτώ βήματα» τρέιλερ: ένας δείκτης περνά αργά από βήμα σε βήμα
   και το φωτίζει (τα προηγούμενα μένουν «ολοκληρωμένα»), σε συνεχή κύκλο,
   μόνο όσο η λωρίδα φαίνεται στην οθόνη. */
(function () {
    var rail = document.querySelector('.hm-rail');
    if (!rail) return;
    var items = rail.querySelectorAll('li');
    if (!items.length) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var i = -1, timer = null, STEP = 1700, PAUSE = 2600;
    function paint() {
        items.forEach(function (li, k) {
            li.classList.toggle('is-active', k === i);
            li.classList.toggle('is-done', k < i);
        });
        rail.style.setProperty('--hm-prog', items.length > 1 ? Math.max(0, i) / (items.length - 1) : 1);
    }
    function tick() {
        i++;
        if (i >= items.length) { i = -1; paint(); timer = setTimeout(tick, 700); return; }
        paint();
        timer = setTimeout(tick, i === items.length - 1 ? PAUSE : STEP);
    }
    function start() { if (timer) return; rail.classList.add('is-playing'); timer = setTimeout(tick, 400); }
    function stop() { clearTimeout(timer); timer = null; }
    if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (es) {
            es.forEach(function (e) { if (e.isIntersecting) start(); else stop(); });
        }, { threshold: 0.35 }).observe(rail);
    } else { start(); }
})();

/* Έλεγχος Κ.Ο.Κ.: τα σημεία φωτίζονται ένα-ένα */
(function () {
    var sec = document.querySelector('.hm-rc'); if (!sec) return;
    var pins = sec.querySelectorAll('.hm-pins > g'), leads = sec.querySelectorAll('.hm-leads > line'), rows = sec.querySelectorAll('.hm-pinlist li');
    var n = Math.min(pins.length, rows.length); if (!n) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var i = -1, timer = null, STEP = 1900;
    function paint() {
        for (var k = 0; k < n; k++) {
            var on = k === i;
            pins[k].classList.toggle('is-active', on);
            rows[k].classList.toggle('is-active', on);
            if (leads[k]) leads[k].classList.toggle('is-active', on);
        }
        sec.classList.toggle('is-cycling', i >= 0);
    }
    function tick() { i++; if (i >= n) { i = -1; paint(); timer = setTimeout(tick, 900); return; } paint(); timer = setTimeout(tick, STEP); }
    function start() { if (timer) return; timer = setTimeout(tick, 1800); }
    function stop() { clearTimeout(timer); timer = null; }
    var art = sec.querySelector('.hm-rc-art') || sec;
    if ('IntersectionObserver' in window) { new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) start(); else stop(); }); }, { threshold: 0.35 }).observe(art); } else { start(); }
})();
