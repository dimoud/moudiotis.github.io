/* hero-swap.js — η δεξιά πλευρά της πρώτης οθόνης εναλλάσσει κάθε 8 δευτερόλεπτα
 * τη φωτογραφία με το λογότυπο (δακτύλιος, κομήτης, περιστρεφόμενο κείμενο και
 * τα σκίτσα οχημάτων του hero-anim.js). Σταματά όταν η καρτέλα δεν φαίνεται ή
 * όταν η πρώτη οθόνη έχει φύγει από την οθόνη· με «μειωμένη κίνηση» μένει η
 * φωτογραφία. Οι τελείες κάτω δείχνουν ποια διαφάνεια είναι ενεργή. */
(function () {
    'use strict';
    var col = document.querySelector('.hero-portrait-col');
    if (!col) return;
    var slides = [].slice.call(col.querySelectorAll('.hero-swap'));
    var dots = [].slice.call(col.querySelectorAll('.hero-swap-dots span'));
    var timerBar = col.querySelector('.hero-swap-timer');
    if (slides.length < 2) return;
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    var INTERVAL = 8000, cur = 0, inView = true, t = null;

    function go(n) {
        slides[cur].classList.remove('is-on'); slides[cur].classList.add('is-off');
        var prev = slides[cur];
        setTimeout(function () { prev.classList.remove('is-off'); }, 1200);
        cur = n % slides.length;
        slides[cur].classList.add('is-on');
        dots.forEach(function (d, i) { d.classList.toggle('is-on', i === cur); });
        col.setAttribute('data-active', slides[cur].getAttribute('data-slide'));
        restartBar();
    }
    function restartBar() {
        if (!timerBar) return;
        timerBar.classList.remove('run'); void timerBar.offsetWidth; timerBar.classList.add('run');
    }
    function tick() {
        if (!document.hidden && inView) go(cur + 1);
        t = setTimeout(tick, INTERVAL);
    }
    if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (es) { es.forEach(function (e) { inView = e.isIntersecting; }); }, { threshold: 0.15 }).observe(col);
    }
    col.setAttribute('data-active', 'photo');
    restartBar();
    t = setTimeout(tick, INTERVAL);
})();
