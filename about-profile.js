/* «Εμπειρία & Εξειδίκευση»: ακορντεόν + ισομετρικό σχέδιο.
   Ένα στοιχείο ανοιχτό κάθε φορά· το ανοιχτό φωτίζει το αντίστοιχο επίπεδο
   του σχεδίου (01 μελέτη, 02 ενημέρωση, 03 άδεια). Το σχέδιο «σχεδιάζεται»
   όταν μπει στην οθόνη· χωρίς JavaScript μένει στατικό και ορατό. */
(function () {
    var root = document.getElementById('aboutProfile');
    if (!root) return;
    var art = root.querySelector('.apf-art');
    var items = [].slice.call(root.querySelectorAll('.apf-item'));

    function setOpen(item, open) {
        item.classList.toggle('is-open', open);
        var b = item.querySelector('.apf-btn');
        if (b) b.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    root.addEventListener('click', function (e) {
        var btn = e.target.closest ? e.target.closest('.apf-btn') : null;
        if (!btn) return;
        var item = btn.closest('.apf-item');
        var willOpen = !item.classList.contains('is-open');
        items.forEach(function (it) { setOpen(it, it === item && willOpen); });
        if (art) art.setAttribute('data-active', willOpen ? item.getAttribute('data-art') : '0');
    });
    // Πέρασμα του ποντικιού πάνω από τίτλο: προεπισκόπηση επιπέδου.
    items.forEach(function (it) {
        it.addEventListener('mouseenter', function () { if (art) art.setAttribute('data-hover', it.getAttribute('data-art')); });
        it.addEventListener('mouseleave', function () { if (art) art.removeAttribute('data-hover'); });
    });

    if (!art) return;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) { art.classList.add('is-in', 'is-still'); return; }
    art.classList.add('apf-ready');
    var io = new IntersectionObserver(function (en) {
        en.forEach(function (x) {
            if (x.isIntersecting) { art.classList.add('is-in'); }
            art.classList.toggle('is-paused', !x.isIntersecting);
        });
    }, { threshold: 0.25 });
    io.observe(art);
})();
