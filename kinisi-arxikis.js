/* kinisi-arxikis.js — μικρός παρατηρητής για τους τίτλους ενοτήτων της αρχικής.
   Προσθέτει .kn-in όταν ο τίτλος πλησιάζει στην οθόνη (μία φορά). Χωρίς κύλιση-ακροατή, χωρίς ανάγνωση διάταξης ανά καρέ. */
(function () {
  'use strict';
  try {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;
    var hs = document.querySelectorAll('.section-heading');
    if (!hs.length) return;
    document.documentElement.classList.add('kn-js');
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('kn-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.2 });
    Array.prototype.forEach.call(hs, function (h) { io.observe(h); });
  } catch (err) { /* διακοσμητικό: αποτυχία = στατικός τίτλος */ }
})();
