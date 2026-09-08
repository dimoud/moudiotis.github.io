/**
 * news-carousel.js — καρουζέλ ενημερώσεων και νομοθεσίας
 *
 * Διαβάζει το news.json και εμφανίζει τις εγγραφές σε συνεχή λωρίδα που
 * κυλά αργά από τα αριστερά προς τα δεξιά. Το ίδιο αρχείο τροφοδοτεί και
 * τις αναρτήσεις στο Facebook, οπότε η ενημέρωση γίνεται σε ένα σημείο.
 *
 * Η λωρίδα σταματά όταν ο κέρσορας περνά από πάνω, όταν η ενότητα βγει από
 * το κάδρο και όταν η καρτέλα πάει σε δεύτερο πλάνο. Με prefers-reduced-motion
 * δεν κινείται καθόλου και οι κάρτες κυλούν με το χέρι.
 *
 * Τοπικά (άνοιγμα με file://) ο browser δεν επιτρέπει την ανάγνωση του JSON.
 * Σε αυτή την περίπτωση η ενότητα αποκρύπτεται αθόρυβα· στον διακομιστή
 * δουλεύει κανονικά.
 */
(function () {
  'use strict';

  var SPEED = 26;   // δευτερόλεπτα ανά πλήρη κύκλο — αργό επίτηδες
  var MIN_COPIES = 2;

  function isEn() {
    return (document.documentElement.getAttribute('lang') || 'el')
      .toLowerCase().indexOf('en') === 0;
  }
  function pick(v) {
    if (v && typeof v === 'object') return isEn() ? (v.en || v.el) : (v.el || v.en);
    return v || '';
  }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* Ημερομηνία σε μορφή «Μάρτιος 2026» — ο ακριβής αριθμός δεν προσθέτει εδώ. */
  var MONTHS = {
    el: ['Ιανουάριος','Φεβρουάριος','Μάρτιος','Απρίλιος','Μάιος','Ιούνιος',
         'Ιούλιος','Αύγουστος','Σεπτέμβριος','Οκτώβριος','Νοέμβριος','Δεκέμβριος'],
    en: ['January','February','March','April','May','June',
         'July','August','September','October','November','December']
  };
  function fmtDate(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    if (!m) return '';
    var arr = isEn() ? MONTHS.en : MONTHS.el;
    return arr[parseInt(m[2], 10) - 1] + ' ' + m[1];
  }

  function card(it) {
    var url   = it.url || '';
    var tag   = it.tag || 'div';
    var title = esc(pick(it.title));
    var body =
      '<span class="news-card-top">' +
        '<span class="news-card-cat">' + esc(pick(it.category)) + '</span>' +
        '<span class="news-card-date">' + esc(fmtDate(it.date)) + '</span>' +
      '</span>' +
      '<span class="news-card-title">' + title + '</span>' +
      '<span class="news-card-sum">' + esc(pick(it.summary)) + '</span>' +
      (it.source ? '<span class="news-card-src">' + esc(it.source) + '</span>' : '');

    if (!url) return '<div class="news-card">' + body + '</div>';
    var href = isEn() && url.charAt(0) === '/' ? '/en' + url : url;
    return '<a class="news-card news-card--link" href="' + esc(href) + '">' + body +
           '<span class="news-card-go" aria-hidden="true">&rarr;</span></a>';
  }

  function build(items) {
    var sec   = document.getElementById('newsSection');
    var track = document.getElementById('newsTrack');
    if (!sec || !track || !items.length) return;

    /* Ταξινόμηση: νεότερα πρώτα */
    items = items.slice().sort(function (a, b) {
      return String(b.date || '').localeCompare(String(a.date || ''));
    });

    var one = items.map(card).join('');
    /* Διπλασιάζεται ώστε ο βρόχος να μη δείχνει κενό στο γύρισμα */
    var html = '';
    for (var i = 0; i < MIN_COPIES; i++) html += one;
    track.innerHTML = html;
    sec.hidden = false;

    var reduced = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { track.style.animation = 'none'; return; }

    track.style.animationDuration = (items.length * SPEED / 4).toFixed(1) + 's';

    var band = document.getElementById('newsBand');
    function play(on) { track.style.animationPlayState = on ? 'running' : 'paused'; }
    if (band) {
      band.addEventListener('mouseenter', function () { play(false); });
      band.addEventListener('mouseleave', function () { play(true); });
    }
    document.addEventListener('visibilitychange', function () { play(!document.hidden); });
    if ('IntersectionObserver' in window && band) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { play(e.isIntersecting); });
      }, { threshold: 0 }).observe(band);
    }
  }

  function init() {
    var sec = document.getElementById('newsSection');
    if (!sec) return;
    var base = sec.getAttribute('data-src') || 'news.json';

    if (location.protocol === 'file:') { sec.remove(); return; }

    fetch(base, { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (d && d.items && d.items.length) build(d.items);
        else sec.remove();
      })
      .catch(function () { sec.remove(); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.NewsCarousel = { init: init };
}());
