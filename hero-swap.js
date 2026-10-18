/* hero-swap.js — η δεξιά πλευρά της πρώτης οθόνης εναλλάσσει διαφάνειες:
 * 1) το έμβλημα (δακτύλιος, περιστρεφόμενο κείμενο), 2) την «ανάλυση αντοχής
 * πλαισίου» της βιτρίνας μηχανικού (eng-showcase.js, data-scene="0").
 * Κάθε διαφάνεια ορίζει τη διάρκειά της με data-dur (ms). Η βιτρίνα ξεκινά από
 * την αρχή κάθε φορά που εμφανίζεται (γεγονός es:play) και σταματά όταν κρύβεται.
 * Παύση όταν η καρτέλα ή η πρώτη οθόνη δεν φαίνονται· με «μειωμένη κίνηση»
 * μένει η πρώτη διαφάνεια. */
(function () {
    'use strict';
    var col = document.querySelector('.hero-portrait-col');
    if (!col) return;
    var slides = [].slice.call(col.querySelectorAll('.hero-swap'));
    var dots = [].slice.call(col.querySelectorAll('.hero-swap-dots span'));
    if (slides.length < 2) return;
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    var cur = 0, inView = true, t = null;
    function dur(i) { return +(slides[i].getAttribute('data-dur') || 8000); }
    function signal(el, name) {
        var w = el.querySelector('.es-wrap');
        if (w) { try { w.dispatchEvent(new Event(name)); } catch (e) {} }
    }
    function go(n) {
        var prev = slides[cur];
        prev.classList.remove('is-on'); prev.classList.add('is-off');
        signal(prev, 'es:stop');
        setTimeout(function () { prev.classList.remove('is-off'); }, 1200);
        cur = n % slides.length;
        slides[cur].classList.add('is-on');
        signal(slides[cur], 'es:play');
        dots.forEach(function (d, i) { d.classList.toggle('is-on', i === cur); });
        col.setAttribute('data-active', slides[cur].getAttribute('data-slide'));
    }
    function tick() {
        if (!document.hidden && inView) go(cur + 1);
        t = setTimeout(tick, dur(cur));
    }
    if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (es) { es.forEach(function (e) { inView = e.isIntersecting; }); }, { threshold: 0.15 }).observe(col);
    }
    col.setAttribute('data-active', slides[0].getAttribute('data-slide'));
    t = setTimeout(tick, dur(0));
})();
