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


  /* 4. Τρέιλερ Ο1/Ο2: τεχνικό σχέδιο που ακολουθεί τα 8 βήματα της διπλανής σειράς (references/17 §Ζ, kinisi).
     Όρια από πηγή: Ο1 ≤ 0,75 t, Ο2 ≤ 3,5 t (Καν. ΕΕ 2018/858, Παρ. Ι)· πλάτος ≤ 2,55 m (Οδ. 96/53/ΕΚ)·
     VIN 17 χαρακτήρες (ISO 3779). Χωρίς επινοημένους αριθμούς. */
  function trailerFigure() {
    var sec = document.getElementById('adeia-treyler-o1-o2'); if (!sec) return;
    var inner = sec.querySelector('.hm-in'), rail = sec.querySelector('.hm-rail'); if (!inner || !rail) return;
    var L = EN ? { hd: 'FIG. 01 · TRAILER O1/O2 · SIDE ELEVATION', docs: 'DOCUMENTS 3/3', stamp: 'FILED', vin: 'VIN · 17 CHARACTERS · ISO 3779',
                   len: 'OVERALL LENGTH', w: 'width ≤ 2.55 m · Dir. 96/53/EC', o1: 'O1 ≤ 750 kg', o2: 'O2 ≤ 3,500 kg', rep1: 'TECHNICAL REPORT', rep2: 'BY MECHANICAL ENGINEER',
                   dir: '→ TRANSPORT DIRECTORATE', plate: 'PLATE', ok: 'Road-legal', step: 'Step', aria: 'Technical drawing of a light trailer that follows the eight licensing steps, ending with the licence plate.' }
             : { hd: 'ΣΧ. 01 · ΡΥΜΟΥΛΚΟΥΜΕΝΟ Ο1/Ο2 · ΠΛΑΓΙΑ ΟΨΗ', docs: 'ΔΙΚΑΙΟΛΟΓΗΤΙΚΑ 3/3', stamp: 'ΚΑΤΑΤΕΘΗΚΕ', vin: 'VIN · 17 ΧΑΡΑΚΤΗΡΕΣ · ISO 3779',
                   len: 'ΣΥΝΟΛΙΚΟ ΜΗΚΟΣ', w: 'πλάτος ≤ 2,55 m · Οδ. 96/53/ΕΚ', o1: 'Ο1 ≤ 750 kg', o2: 'Ο2 ≤ 3.500 kg', rep1: 'ΤΕΧΝΙΚΗ ΕΚΘΕΣΗ', rep2: 'ΜΗΧΑΝΟΛΟΓΟΥ ΜΗΧΑΝΙΚΟΥ',
                   dir: '→ ΔΙΕΥΘΥΝΣΗ ΜΕΤΑΦΟΡΩΝ', plate: 'ΠΙΝΑΚΙΔΑ', ok: 'Νόμιμο', step: 'Βήμα', aria: 'Τεχνικό σχέδιο ελαφρού ρυμουλκούμενου που ακολουθεί τα οκτώ βήματα της άδειας και καταλήγει στην πινακίδα.' };
    /* κλίμακα μάζας: 0 → 3.500 kg σε 250 px· το όριο Ο1 πέφτει στα 750/3500 × 250 = 53,57 px */
    var X0 = 330, W = 250, x750 = X0 + W * 750 / 3500, x3500 = X0 + W;
    var slots = ''; for (var k = 0; k < 17; k++) slots += '<rect class="slot" x="' + (20 + k * 15) + '" y="206" width="11" height="16" rx="1.5" style="transition-delay:' + (k * 70) + 'ms"/>';
    var sheet = function (x, y) { return '<rect class="ln" x="' + x + '" y="' + y + '" width="30" height="40" rx="2"/><path class="ln ln--dim" d="M' + (x + 6) + ' ' + (y + 10) + 'h18M' + (x + 6) + ' ' + (y + 17) + 'h18M' + (x + 6) + ' ' + (y + 24) + 'h12"/>'; };
    var pin = function (x, y) { return '<circle class="ok" cx="' + x + '" cy="' + y + '" r="10"/><path class="ok" d="M' + (x - 4.5) + ' ' + y + 'l3 3 6-6.5"/>'; };
    var svg =
      '<svg viewBox="0 0 600 500" role="img" aria-label="' + L.aria + '">' +
      '<text class="hd" x="0" y="14">' + L.hd + '</text>' +
      '<path class="ln ln--dim" d="M0 24H600"/>' +
      /* το ρυμουλκούμενο — σχεδιάζεται μία φορά όταν μπει στο κάδρο */
      '<path class="ln draw" pathLength="1" d="M230 250H520V330H230Z"/>' +
      '<path class="ln draw" pathLength="1" d="M200 336H540M230 336L90 346"/>' +
      '<circle class="ln draw" pathLength="1" cx="82" cy="346" r="8"/>' +
      '<path class="ln draw" pathLength="1" d="M120 344V370"/><circle class="ln draw" pathLength="1" cx="120" cy="376" r="6"/>' +
      '<circle class="ln draw" pathLength="1" cx="400" cy="358" r="22"/><circle class="ln draw" pathLength="1" cx="400" cy="358" r="7"/>' +
      '<path class="ln draw" pathLength="1" d="M368 336A34 34 0 0 1 432 336"/>' +
      '<rect class="ln draw" pathLength="1" x="512" y="300" width="8" height="14"/>' +
      '<path class="ln draw" pathLength="1" d="M248 262H502M248 318H502M330 250V330M420 250V330"/>' +
      '<path class="ln ln--dim" d="M20 380H580"/>' +
      /* 01 δικαιολογητικά */
      '<g class="st" data-k="0">' + sheet(20, 44) + sheet(58, 44) + sheet(96, 44) + '<text x="20" y="104">' + L.docs + '</text></g>' +
      /* 02 κατάθεση */
      '<g class="st" data-k="1"><g transform="rotate(-8 92 64)"><rect class="ln" x="34" y="52" width="116" height="26" rx="3"/><text class="hd" x="44" y="70">' + L.stamp + '</text></g></g>' +
      /* 03 χάραξη 17ψήφιου */
      '<g class="st" data-k="2"><text x="20" y="196">' + L.vin + '</text>' + slots + '<path class="ln ln--dim" d="M150 222L160 340"/><circle cx="160" cy="341" r="3" fill="#e4b7a2"/></g>' +
      /* 04 επιθεώρηση: όρια */
      '<g class="st" data-k="3"><path class="ln" d="M82 402H540M82 396V408M540 396V408"/><text x="250" y="422">' + L.len + '</text>' +
        '<path class="ln" d="M' + X0 + ' 60H' + x3500 + '"/><path class="ln" d="M' + X0 + ' 54V66M' + x750.toFixed(2) + ' 54V66M' + x3500 + ' 54V66"/>' +
        '<text x="' + X0 + '" y="84">' + L.o1 + '</text><text x="' + (x3500 - 104) + '" y="84">' + L.o2 + '</text><text x="' + X0 + '" y="104">' + L.w + '</text></g>' +
      /* 05 τεχνικός φάκελος */
      '<g class="st" data-k="4"><rect class="ln" x="330" y="124" width="34" height="46" rx="2"/><path class="ln ln--dim" d="M336 134h22M336 141h22M336 148h22M336 155h14"/><text x="376" y="140">' + L.rep1 + '</text><text x="376" y="156">' + L.rep2 + '</text></g>' +
      /* 06 τελική κατάθεση */
      '<g class="st" data-k="5"><text class="hd" x="376" y="184">' + L.dir + '</text></g>' +
      /* 07 έλεγχος: ζεύξη, φανός, τροχός */
      '<g class="st" data-k="6">' + pin(82, 318) + pin(516, 282) + pin(400, 308) + '</g>' +
      /* 08 πινακίδες */
      '<g class="st" data-k="7"><rect class="plate" x="430" y="440" width="150" height="38" rx="4"/><text x="472" y="464" style="fill:#0a1828">' + L.plate + '</text>' +
        '<circle class="ok" cx="34" cy="458" r="14"/><path class="ok" d="M27 458l5 5 9-10"/><text class="big okt" x="58" y="468">' + L.ok + '</text></g>' +
      '</svg>';
    var fig = document.createElement('figure');
    fig.className = 'sx-trfig'; fig.setAttribute('aria-hidden', 'false');
    fig.innerHTML = svg + '<figcaption aria-live="off"></figcaption>';
    inner.appendChild(fig);
    var groups = fig.querySelectorAll('.st'), slotEls = fig.querySelectorAll('.slot'), cap = fig.querySelector('figcaption');
    var items = rail.querySelectorAll('li');
    function current() {
      if (!rail.classList.contains('is-playing')) return items.length - 1;      /* μειωμένη κίνηση → τελικό καρέ */
      var a = -1;
      items.forEach(function (li, k) { if (li.classList.contains('is-active')) a = k; });
      return a;
    }
    var last = -2;
    function render() {
      var i = current(); if (i === last) return; last = i;
      groups.forEach(function (g) { var k = +g.getAttribute('data-k'); g.classList.toggle('on', k <= i); g.classList.toggle('cur', k === i); });
      slotEls.forEach(function (r) { r.classList.toggle('f', i >= 2); });
      var t = i >= 0 ? items[i].querySelector('.hm-rail-t') : null;
      cap.textContent = t ? L.step + ' ' + ('0' + (i + 1)).slice(-2) + '/0' + items.length + ' · ' + t.textContent.trim() : '';
    }
    new MutationObserver(render).observe(rail, { subtree: true, attributes: true, attributeFilter: ['class'] });
    render();
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { fig.classList.add('is-on'); io.disconnect(); } }, { rootMargin: '0px 0px 10% 0px' });
      io.observe(fig);
    } else fig.classList.add('is-on');
  }

  function init() {
    Array.prototype.forEach.call(document.querySelectorAll('button.sx-pp[data-sx-target]'), wirePause);
    trailerFigure();
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
