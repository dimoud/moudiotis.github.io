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
