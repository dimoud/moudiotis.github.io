/* Αναδυόμενο μενού «Υπηρεσίες» στη μπάρα πλοήγησης.
   Υπολογιστής: ανοίγει με πέρασμα του ποντικιού (CSS) ή με κλικ/Enter.
   Κινητό (συρτάρι): το κουμπί ανοίγει/κλείνει τη λίστα μέσα στο συρτάρι. */
(function () {
    var dd = document.querySelector('#navLinks .nav-dd');
    if (!dd) return;
    var btn = dd.querySelector('.nav-dd-btn');
    function set(open) {
        dd.classList.toggle('open', open);
        btn.setAttribute('aria-expanded', String(open));
    }
    btn.addEventListener('click', function (e) {
        e.stopPropagation();
        set(!dd.classList.contains('open'));
    });
    document.addEventListener('click', function (e) {
        if (!dd.contains(e.target)) set(false);
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && dd.classList.contains('open')) { set(false); btn.focus(); }
    });
})();

/* Μενού κινητού: κουμπί «Χ» μέσα στο συρτάρι + κλείσιμο με σουάιπ αριστερά ή
   δεξιά οπουδήποτε στην οθόνη (όχι μόνο πάνω στο συρτάρι). */
(function () {
    var menu = document.getElementById('navLinks');
    if (!menu) return;
    function isOpen() { return menu.classList.contains('open'); }
    function close() { if (isOpen() && typeof window.toggleMenu === 'function') window.toggleMenu(); }
    var en = (document.documentElement.lang || '').indexOf('en') === 0;
    var x = document.createElement('button');
    x.type = 'button'; x.className = 'nav-close';
    x.setAttribute('aria-label', en ? 'Close menu' : 'Κλείσιμο μενού');
    x.innerHTML = '<span aria-hidden="true">&times;</span>';
    x.addEventListener('click', function (e) { e.stopPropagation(); close(); });
    menu.insertBefore(x, menu.firstChild);
    var sx = 0, sy = 0, on = false;
    document.addEventListener('touchstart', function (e) {
        if (!isOpen() || !e.touches || !e.touches[0]) { on = false; return; }
        on = true; sx = e.touches[0].clientX; sy = e.touches[0].clientY;
    }, { passive: true });
    document.addEventListener('touchend', function (e) {
        if (!on || !e.changedTouches || !e.changedTouches[0]) return;
        on = false;
        var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
        if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) close();
    }, { passive: true });
})();
