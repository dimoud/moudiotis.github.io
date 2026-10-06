/**
 * partners-carousel.js — κυλιόμενη ζώνη «Πελάτες & Συνεργάτες»
 *
 * Η ζώνη είναι απλή οριζόντια κύλιση με scroll-snap, οπότε δουλεύει και χωρίς
 * JavaScript (σύρσιμο με το δάχτυλο, τροχός, πληκτρολόγιο). Το σενάριο προσθέτει:
 *   - βέλη που μετακινούν κατά μία «σελίδα» και κρύβονται όταν δεν χρειάζονται·
 *   - αργή αυτόματη μετακίνηση κατά μία κάρτα, που σταματά με τον κέρσορα, την
 *     εστίαση, το άγγιγμα, όταν η ενότητα βγει από το κάδρο ή η καρτέλα πάει
 *     σε δεύτερο πλάνο· με prefers-reduced-motion δεν κινείται καθόλου.
 */
(function () {
  'use strict';
  var DELAY = 3800;

  function init(root) {
    var vp = root.querySelector('[data-pc-viewport]');
    var prev = root.querySelector('[data-pc-prev]');
    var next = root.querySelector('[data-pc-next]');
    if (!vp) return;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var paused = false, visible = true, timer = null;

    function step() {
      var item = vp.querySelector('.pc-item');
      if (!item) return vp.clientWidth;
      var gap = parseFloat(getComputedStyle(vp.firstElementChild).columnGap) || 0;
      return item.getBoundingClientRect().width + gap;
    }
    function maxScroll() { return vp.scrollWidth - vp.clientWidth; }

    function update() {
      var max = maxScroll();
      var overflow = max > 4;
      root.classList.toggle('pc-static', !overflow);
      if (prev) prev.disabled = vp.scrollLeft <= 4;
      if (next) next.disabled = vp.scrollLeft >= max - 4;
    }

    function page(dir) {
      var s = step();
      var n = Math.max(1, Math.floor(vp.clientWidth / s));
      vp.scrollBy({ left: dir * n * s, behavior: reduce ? 'auto' : 'smooth' });
    }

    function tick() {
      if (paused || !visible || document.hidden) return;
      if (vp.scrollLeft >= maxScroll() - 4) vp.scrollTo({ left: 0, behavior: 'smooth' });
      else vp.scrollBy({ left: step(), behavior: 'smooth' });
    }
    function start() { if (!reduce && !timer) timer = setInterval(tick, DELAY); }

    if (prev) prev.addEventListener('click', function () { page(-1); });
    if (next) next.addEventListener('click', function () { page(1); });
    vp.addEventListener('scroll', function () { window.requestAnimationFrame(update); }, { passive: true });
    window.addEventListener('resize', update);

    ['mouseenter', 'focusin', 'touchstart', 'pointerdown'].forEach(function (ev) {
      root.addEventListener(ev, function () { paused = true; }, { passive: true });
    });
    root.addEventListener('mouseleave', function () { paused = false; });
    root.addEventListener('focusout', function (e) { if (!root.contains(e.relatedTarget)) paused = false; });

    vp.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); page(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); page(-1); }
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }, { threshold: 0.2 }).observe(root);
    }
    // οι εικόνες φορτώνουν αργότερα (lazy) — ξαναμέτρησε όταν έρθουν
    Array.prototype.forEach.call(vp.querySelectorAll('img'), function (im) {
      if (!im.complete) im.addEventListener('load', update, { once: true });
    });
    update();
    start();
  }

  function boot() { Array.prototype.forEach.call(document.querySelectorAll('[data-pc]'), init); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
