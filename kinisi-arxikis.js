/* kinisi-arxikis.js — κινήσεις αρχικής που παίζουν ΜΟΝΟ όταν το στοιχείο φαίνεται.
   Ένας παρατηρητής: προσθέτει .kn-in όταν ≥ 30 % του στοιχείου είναι μέσα στην οθόνη και πάνω από
   το κάτω 14 % της. Ό,τι έχει ήδη περάσει πάνω από την οθόνη παίρνει .kn-skip (χωρίς κίνηση).
   Χωρίς ακροατή κύλισης, χωρίς ανάγνωση διάταξης ανά καρέ. Με prefers-reduced-motion δεν κάνει τίποτα. */
(function () {
  'use strict';
  try {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;
    var els = document.querySelectorAll('.section-heading, .trust-pillar, .trust-stats, .about-stats, .hm-idx, .hm-rail, .hm-rc-art, .hm-calc, .pc, .contact-form-wrap, .about-portrait, .person-photo');
    if (!els.length) return;
    var root = document.documentElement;
    root.classList.add('kn-js');
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var t = e.target;
        if (e.isIntersecting) { t.classList.add('kn-in'); io.unobserve(t); }
        else if (e.boundingClientRect.bottom < 0) { t.classList.add('kn-in', 'kn-skip'); io.unobserve(t); }
      });
    }, { rootMargin: '0px 0px -14% 0px', threshold: 0.3 });
    Array.prototype.forEach.call(els, function (el) { io.observe(el); });
    /* δίχτυ ασφαλείας: αν κάτι δεν ειδοποιηθεί ποτέ, να μη μείνει κρυμμένο */
    setTimeout(function () {
      Array.prototype.forEach.call(els, function (el) {
        var r = el.getBoundingClientRect();
        if (!el.classList.contains('kn-in') && r.bottom < 0) el.classList.add('kn-in', 'kn-skip');
      });
    }, 4000);
  } catch (err) { document.documentElement.classList.remove('kn-js'); }
})();
