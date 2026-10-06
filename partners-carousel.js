/**
 * partners-carousel.js — συνεχής λωρίδα «Πελάτες & Συνεργάτες»
 *
 * Ίδια συμπεριφορά με τη λωρίδα «Νέα του κλάδου» (news-carousel.js): οι κάρτες
 * κυλούν συνεχώς από τα αριστερά προς τα δεξιά, η λωρίδα σταματά με τον κέρσορα
 * ή την εστίαση, όταν βγει από το κάδρο και όταν η καρτέλα πάει σε δεύτερο
 * πλάνο. Το HTML έχει τις κάρτες μία φορά (για μηχανές αναζήτησης)· εδώ
 * διπλασιάζονται, με τα αντίγραφα κρυμμένα από αναγνώστες οθόνης και Tab.
 * Με prefers-reduced-motion δεν κινείται και κυλά με το χέρι.
 */
(function () {
  'use strict';
  var PX_PER_SEC = 72;   // ίδια ταχύτητα με τις κριτικές Google (1,2px/καρέ ≈ 72px/s)

  function init(root) {
    var vp = root.querySelector('[data-pc-viewport]');
    var track = root.querySelector('.pc-track');
    if (!vp || !track) return;
    var items = Array.prototype.slice.call(track.children);
    if (!items.length) return;

    var reduced = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { root.classList.add('pc-manual'); return; }

    items.forEach(function (li) {
      var c = li.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      Array.prototype.forEach.call(c.querySelectorAll('a'), function (a) { a.tabIndex = -1; });
      Array.prototype.forEach.call(c.querySelectorAll('img'), function (im) { im.loading = 'eager'; });
      track.appendChild(c);
    });
    function setSpeed() {
      var half = track.scrollWidth / 2;
      if (half > 0) track.style.animationDuration = (half / PX_PER_SEC).toFixed(1) + 's';
    }
    setSpeed();
    window.addEventListener('resize', setSpeed);
    Array.prototype.forEach.call(track.querySelectorAll('img'), function (im) {
      if (!im.complete) im.addEventListener('load', setSpeed, { once: true });
    });
    root.classList.add('pc-run');

    var inView = true, hover = false;
    function sync() {
      track.style.animationPlayState = (inView && !hover && !document.hidden) ? 'running' : 'paused';
    }
    root.addEventListener('mouseenter', function () { hover = true; sync(); });
    root.addEventListener('mouseleave', function () { hover = false; sync(); });
    root.addEventListener('focusin', function () { hover = true; sync(); });
    root.addEventListener('focusout', function (e) { if (!root.contains(e.relatedTarget)) { hover = false; sync(); } });
    document.addEventListener('visibilitychange', sync);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { inView = en[0].isIntersecting; sync(); }, { threshold: 0 }).observe(root);
    }
  }

  function boot() { Array.prototype.forEach.call(document.querySelectorAll('[data-pc]'), init); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
