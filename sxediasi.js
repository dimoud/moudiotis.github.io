/* sxediasi.js — ΠΙΛΟΤΙΚΟ istoselides v2.14 (references/17), 13/10/2026.
   1) κουμπί παύσης στις ατέρμονες ταινίες (ΜΗ-02)  2) ειδήσεις: συλλογή με snap + κουμπιά (17 §ΣΤ)
   3) διακοσμητικός χάρακας ύψους: aria-hidden
   Αφαίρεση = revert του commit. */
(function () {
  'use strict';
  var EN = (document.documentElement.lang || 'el').slice(0, 2) === 'en';
  var T = EN ? { pause: 'Pause animation', play: 'Play animation', prev: 'Previous articles', next: 'Next articles',
                 call: 'Call', sections: 'Page sections' }
             : { pause: 'Παύση κίνησης', play: 'Συνέχεια κίνησης', prev: 'Προηγούμενα άρθρα', next: 'Επόμενα άρθρα',
                 call: 'Κλήση', sections: 'Ενότητες σελίδας' };

  /* 1. Παύση ταινιών: το κουμπί υπάρχει στο HTML (button.sx-pp[data-sx-target]) */
  function wirePause(btn) {
    var target = document.querySelector(btn.getAttribute('data-sx-target'));
    if (!target) { btn.hidden = true; return; }
    function set(paused) {
      target.classList.toggle('sx-paused', paused);
      btn.setAttribute('aria-pressed', paused ? 'true' : 'false');
      btn.setAttribute('aria-label', paused ? T.play : T.pause);
      btn.textContent = paused ? '▶' : '❚❚';
    }
    set(false);
    btn.addEventListener('click', function () { set(btn.getAttribute('aria-pressed') !== 'true'); });
  }

  /* 2. Ειδήσεις: η ατέρμονη κύλιση γίνεται συλλογή που τη σέρνει ή την πατά ο επισκέπτης */
  function newsGallery() {
    var band = document.getElementById('newsBand'), track = document.getElementById('newsTrack');
    if (!band || !track || band.classList.contains('sx-gallery')) return;
    var cards = track.children;
    if (!cards.length) return false;
    var n = cards.length;
    if (n % 2 === 0) {                       /* τα περιεχόμενα είναι διπλασιασμένα για τον βρόχο */
      var half = n / 2, same = true;
      for (var i = 0; i < half; i++) { if (cards[i].getAttribute('href') !== cards[i + half].getAttribute('href')) { same = false; break; } }
      if (same) for (var j = half; j < n; j++) { cards[j].classList.add('sx-dup'); cards[j].setAttribute('aria-hidden', 'true'); cards[j].tabIndex = -1; }
    }
    band.classList.add('sx-gallery');
    track.style.animation = 'none';
    var nav = document.createElement('div'); nav.className = 'sx-nav';
    nav.innerHTML = '<button type="button" class="sx-nb" data-d="-1" aria-label="' + T.prev + '">‹</button>' +
                    '<button type="button" class="sx-nb" data-d="1" aria-label="' + T.next + '">›</button>';
    band.parentNode.insertBefore(nav, band.nextSibling);
    var bPrev = nav.children[0], bNext = nav.children[1];
    function step() { var c = track.querySelector('.news-card'); return c ? c.getBoundingClientRect().width + 22 : 300; }
    function sync() {
      bPrev.disabled = band.scrollLeft < 4;
      bNext.disabled = band.scrollLeft + band.clientWidth >= band.scrollWidth - 4;
    }
    nav.addEventListener('click', function (e) {
      var b = e.target.closest('.sx-nb'); if (!b) return;
      band.scrollBy({ left: step() * (+b.getAttribute('data-d')), behavior: 'smooth' });
    });
    function onScroll() { requestAnimationFrame(sync); }
    band.addEventListener('scroll', onScroll, { passive: true });
    sync();
    return true;
  }

  function init() {
    Array.prototype.forEach.call(document.querySelectorAll('button.sx-pp[data-sx-target]'), wirePause);
    var el = document.getElementById('scrollElev'); if (el) el.setAttribute('aria-hidden', 'true');
    /* οι ειδήσεις χτίζονται ασύγχρονα (news.json): περίμενε τις κάρτες */
    if (!newsGallery()) {
      var track = document.getElementById('newsTrack');
      if (track && 'MutationObserver' in window) {
        var mo = new MutationObserver(function () { if (newsGallery()) mo.disconnect(); });
        mo.observe(track, { childList: true });
      }
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
