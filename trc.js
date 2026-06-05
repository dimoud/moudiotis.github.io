/**
 * trc.js — Trailer Road Check interactive widget
 * Bilingual (el/en), interactive checklist, expandable cards, progress bar.
 */
(function () {
  'use strict';

  var I18N = {
    el: {
      title1:      'Έλεγχοι ',
      title2:      'Ρυμουλκούμενων',
      badgeKey:    'ΚΑΤΗΓΟΡΙΑ',
      diagramTag:  'ΠΛΑΓΙΑ & ΠΙΣΩ ΟΨΗ',
      diagramAlt:  'Πλάγια και Πίσω Όψη Ρυμουλκούμενου Κατ. Ο1 & Ο2',
      intro:       'Τα σημεία που ελέγχονται ώστε το ρυμουλκούμενο να είναι <strong>σύμφωνο με τον Κ.Ο.Κ.</strong> και ασφαλές στον δρόμο — ανακλαστήρες, πίσω τρίγωνα, φωτισμός, πινακίδα και σύστημα ζεύξης. Κατηγορία Ο1 &amp; Ο2.',
      tagline:     'Δες αν το ρυμουλκούμενο σου πληροί τις απαιτήσεις του Κ.Ο.Κ.!',
      toggleHint:  'Δείτε τους ελέγχους',
      progressLbl: 'Πρόοδος Ελέγχου',
      resetBtn:    'ΕΠΑΝΑΦΟΡΑ',
      completeMsg: 'Το ρυμουλκούμενο είναι έτοιμο για τον δρόμο!',
      secLbl:      'Σημεία Ελέγχου & Νόμιμος Εξοπλισμός',
      bc0Lbl:      'Περιοδικός Έλεγχος',
      bc1Lbl:      'Ασφάλιση',
      noteBox:     'Απαιτείται <b>ξεχωριστή ασφάλιση</b> του ρυμουλκούμενου από το ρυμουλκό όχημα. Ενημερωθείτε από τον ασφαλιστή σας.',
      items: [
        { n:1, title:'Κεφαλή ζεύξης',            desc:'Ασφάλιση, φθορά, λίπανση' },
        { n:2, title:'Λασπωτήρες / φτερά',        desc:'Πάνω από τους τροχούς — σταθερά, ακέραια' },
        { n:3, title:'Ελαστικά',                   desc:'Εγκεκριμένου τύπου — πίεση, βάθος πέλματος, φθορά' },
        { n:4, title:'Πλευρικοί ανακλαστήρες',     desc:'Πορτοκαλί — παρόντες &amp; καθαροί' },
        { n:5, title:'Πίσω τρίγωνα ανακλαστήρες', desc:'Κόκκινα — υποχρεωτικά' },
        { n:6, title:'Πίσω φώτα',                  desc:'Φλας, φρένων, θέσης, ομίχλης σε λειτουργία' },
        { n:7, title:'Πινακίδα κυκλοφορίας',       desc:'Πινακίδα &amp; φωτισμός πινακίδας' },
        { n:8, title:'Ποδαράκι στήριξης (jockey)', desc:'Υποχρεωτικό, σε καλή κατάσταση' }
      ],
      bc0List: [
        { lbl:'Ελαστικά — πίεση &amp; φθορά',          val:'✓ έλεγχος' },
        { lbl:'Πλαίσιο — φθορές, σκουριά, ρωγμές',     val:'✓ έλεγχος' },
        { lbl:'Σημάνσεις &amp; ανακλαστήρες',           val:'✓ έλεγχος' },
        { lbl:'Φωτισμός — πλήρης λειτουργία',           val:'✓ έλεγχος' }
      ]
    },
    en: {
      title1:      'Trailer ',
      title2:      'Road Checks',
      badgeKey:    'CATEGORY',
      diagramTag:  'SIDE & REAR VIEW',
      diagramAlt:  'Side and Rear View of Trailer Cat. O1 & O2',
      intro:       'The checkpoints verified to ensure the trailer is <strong>compliant with Road Code</strong> and road-safe — reflectors, rear triangles, lights, number plate, and coupling system. Category O1 &amp; O2.',
      tagline:     'Check if your trailer meets Road Code requirements!',
      toggleHint:  'View checks',
      progressLbl: 'Inspection Progress',
      resetBtn:    'RESET',
      completeMsg: 'The trailer is road-ready!',
      secLbl:      'Check Points & Legal Equipment',
      bc0Lbl:      'Periodic Inspection',
      bc1Lbl:      'Insurance',
      noteBox:     '<b>Separate insurance</b> is required for the trailer, distinct from the towing vehicle. Contact your insurance provider.',
      items: [
        { n:1, title:'Coupling head',             desc:'Locking mechanism, wear, lubrication' },
        { n:2, title:'Mudguards / wings',          desc:'Above wheels — secure, intact' },
        { n:3, title:'Tyres',                      desc:'Approved type — pressure, tread depth, wear' },
        { n:4, title:'Side reflectors',            desc:'Orange — present &amp; clean' },
        { n:5, title:'Rear triangle reflectors',   desc:'Red — mandatory' },
        { n:6, title:'Rear lights',                desc:'Indicators, brake, position, fog — all working' },
        { n:7, title:'Number plate',               desc:'Plate &amp; plate light' },
        { n:8, title:'Jockey wheel (support leg)', desc:'Mandatory — good condition' }
      ],
      bc0List: [
        { lbl:'Tyres — pressure &amp; wear',       val:'✓ check' },
        { lbl:'Frame — damage, rust, cracks',      val:'✓ check' },
        { lbl:'Signs &amp; reflectors',            val:'✓ check' },
        { lbl:'Lighting — fully operational',      val:'✓ check' }
      ]
    }
  };

  var checked      = new Set();
  var currentItems = [];

  function getLang() {
    return (window.I18n && window.I18n.getLang()) ||
           localStorage.getItem('lang') ||
           document.documentElement.lang ||
           'el';
  }

  function setText(id, text) { var e = document.getElementById(id); if (e) e.textContent = text; }
  function setHTML(id, html) { var e = document.getElementById(id); if (e) e.innerHTML  = html; }

  function renderLang(lang) {
    var t = I18N[lang] || I18N.el;
    setText('trcTitle1',          t.title1);
    setText('trcTitle2',          t.title2);
    setText('trcBadgeKey',        t.badgeKey);
    setText('trcDiagramTag',      t.diagramTag);
    var diagramImg = document.querySelector('.trc-diagram-wrap img');
    if (diagramImg) diagramImg.alt = t.diagramAlt;
    setHTML('trcIntro',           t.intro);
    setText('trcTagline',         t.tagline);
    setText('trcProgressLbl',     t.progressLbl);
    setText('trcResetBtn',        t.resetBtn);
    setText('trcCompleteText',    t.completeMsg);
    setText('trcSecLbl',          t.secLbl);
    setText('trcBc0Lbl',          t.bc0Lbl);
    setText('trcBc0InnerLbl',     t.bc0Lbl);
    setText('trcBc1Lbl',          t.bc1Lbl);
    setText('trcBc1InnerLbl',     t.bc1Lbl);
    setHTML('trcNoteBox',         t.noteBox);
    buildBc0List(t.bc0List);
    currentItems = t.items;
    buildCards(t.items);
    updateProgress();
  }

  function buildBc0List(list) {
    var ul = document.getElementById('trcBc0List');
    if (!ul) return;
    ul.innerHTML = list.map(function (r) {
      return '<li><span class="trc-spec-lbl">' + r.lbl + '</span>' +
             '<span class="trc-spec-val">'     + r.val + '</span></li>';
    }).join('');
  }

  function buildCards(items) {
    var grid = document.getElementById('trcChecksGrid');
    if (!grid) return;
    grid.innerHTML = '';
    items.forEach(function (item) {
      var card = document.createElement('div');
      card.className = 'trc-check-card';
      card.innerHTML =
        '<div class="trc-c-num">' + (checked.has(item.n) ? '✓' : item.n) + '</div>' +
        '<div class="trc-c-check-hint" aria-hidden="true"></div>' +
        '<div class="trc-c-txt">' +
          '<div class="trc-c-title">' + item.title + '</div>' +
          '<div class="trc-c-desc">'  + item.desc  + '</div>' +
        '</div><div class="trc-c-tick">✓</div>';

      if (checked.has(item.n)) card.classList.add('trc-checked');

      card.addEventListener('click', function (e) {
        spawnRipple(e, card);
        toggleCard(item.n, card);
      });

      card.addEventListener('mousemove', function (e) {
        if (card.classList.contains('trc-checked')) return;
        var r  = card.getBoundingClientRect();
        var dx = ((e.clientX - r.left) / r.width  - 0.5) * 2;
        var dy = ((e.clientY - r.top)  / r.height - 0.5) * 2;
        card.style.transform =
          'perspective(500px) rotateY(' + (dx * 5) + 'deg) rotateX(' + (-dy * 4) + 'deg) translateY(-3px)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transition = 'transform 0.4s ease, border-color 0.2s, box-shadow 0.2s, background 0.28s';
        card.style.transform  = '';
        setTimeout(function () { card.style.transition = ''; }, 420);
      });

      grid.appendChild(card);
    });
  }

  function toggleCard(n, card) {
    var numEl = card.querySelector('.trc-c-num');
    numEl.classList.remove('trc-popping');
    void numEl.offsetWidth;
    numEl.classList.add('trc-popping');
    numEl.addEventListener('animationend', function () {
      numEl.classList.remove('trc-popping');
    }, { once: true });
    if (checked.has(n)) {
      checked.delete(n);
      card.classList.remove('trc-checked');
      numEl.textContent = n;
    } else {
      checked.add(n);
      card.classList.add('trc-checked');
      numEl.textContent = '✓';
    }
    updateProgress();
  }

  function spawnRipple(e, card) {
    var r    = card.getBoundingClientRect();
    var size = Math.max(r.width, r.height) * 1.2;
    var dot  = document.createElement('span');
    dot.className = 'trc-ripple';
    dot.style.cssText =
      'width:'  + size + 'px;height:' + size + 'px;' +
      'left:'   + (e.clientX - r.left - size / 2) + 'px;' +
      'top:'    + (e.clientY - r.top  - size / 2) + 'px;' +
      'background:rgba(31,60,99,.09);';
    card.appendChild(dot);
    setTimeout(function () { dot.remove(); }, 700);
  }

  function updateProgress() {
    var n    = checked.size;
    var tot  = currentItems.length;
    var done = n === tot && tot > 0;

    var fill = document.getElementById('trcFill');
    if (fill) {
      fill.style.width = (tot ? (n / tot * 100) : 0) + '%';
      fill.className   = 'trc-progress-fill' + (done ? ' trc-all-done' : '');
    }
    var pNum = document.getElementById('trcNum');
    if (pNum) {
      pNum.classList.remove('trc-bump');
      void pNum.offsetWidth;
      pNum.classList.add('trc-bump');
      pNum.textContent = n + ' / ' + tot;
      pNum.className   = 'trc-progress-num trc-bump' + (done ? ' trc-all-done' : '');
    }
    var msg = document.getElementById('trcCompleteMsg');
    if (msg) {
      if (done) {
        msg.style.display = 'flex';
        requestAnimationFrame(function () { msg.classList.add('trc-show'); });
      } else {
        msg.classList.remove('trc-show');
        setTimeout(function () {
          if (!msg.classList.contains('trc-show')) msg.style.display = 'none';
        }, 420);
      }
    }
  }

  /* Accordion toggle — called via onclick in HTML */
  window.trcToggle = function (btn) {
    var open   = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    var target = document.getElementById(btn.getAttribute('aria-controls'));
    if (target) target.hidden = open;
  };

  /* Combined toggle — opens both panels as one unit */
  window.trcToggleCombined = function (btn) {
    var open   = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    var target = document.getElementById(btn.getAttribute('aria-controls'));
    if (target) target.hidden = open;
  };

  /* Hook into site language toggle */
  var _orig = window.setLang;
  window.setLang = function (lang) {
    if (_orig) _orig(lang);
    renderLang(lang);
  };

  function init() {
    var resetBtn = document.getElementById('trcResetBtn');
    if (resetBtn) resetBtn.addEventListener('click', function () {
      checked.clear();
      buildCards(currentItems);
      updateProgress();
    });
    renderLang(getLang());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
