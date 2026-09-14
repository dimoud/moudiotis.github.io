/**
 * trc.js — Trailer Road Check interactive widget
 * Bilingual (el/en), two variants (box trailer / boat trailer),
 * interactive checklist, expandable cards, progress bar.
 */
(function () {
  'use strict';

  var PREVIEW_ITEMS = {
    el: [
      { icon: 'fa-solid fa-circle-dot',         label: 'Πίσω φώτα\nλειτουργικά' },
      { icon: 'fa-solid fa-triangle-exclamation',label: 'Τρίγωνα\nασφαλείας' },
      { icon: 'fa-solid fa-square-check',        label: 'Πινακίδα\nκυκλοφορίας' },
      { icon: 'fa-solid fa-link',                label: 'Σύστημα\nζεύξης' },
      { icon: 'fa-solid fa-shield-halved',       label: 'Ανακλαστικά\nσήματα' }
    ],
    en: [
      { icon: 'fa-solid fa-circle-dot',         label: 'Rear lights\nworking' },
      { icon: 'fa-solid fa-triangle-exclamation',label: 'Safety\ntriangles' },
      { icon: 'fa-solid fa-square-check',        label: 'Number\nplate' },
      { icon: 'fa-solid fa-link',                label: 'Coupling\nsystem' },
      { icon: 'fa-solid fa-shield-halved',       label: 'Reflective\nmarkers' }
    ]
  };

  /* ---- Variant tabs ------------------------------------------------- */
  var TABS = {
    el: [
      { id: 'box',  icon: 'fa-solid fa-box', label: 'Τρέιλερ αποσκευών' },
      { id: 'boat', icon: 'fa-solid fa-ship', label: 'Τρέιλερ σκάφους' }
    ],
    en: [
      { id: 'box',  icon: 'fa-solid fa-box', label: 'Box / luggage trailer' },
      { id: 'boat', icon: 'fa-solid fa-ship', label: 'Boat trailer' }
    ]
  };

  var I18N = {
    el: {
      title1:      'Έλεγχοι ',
      badgeKey:    'ΚΑΤΗΓΟΡΙΑ',
      diagramTag:  'ΠΛΑΓΙΑ και ΠΙΣΩ ΟΨΗ',
      tagline:     'ΚΑΝΕ ΤΟΝ ΠΛΗΡΗ ΕΛΕΓΧΟ ΚΑΙ ΔΕΣ ΑΝΑΛΥΤΙΚΑ',
      progressLbl: 'Πρόοδος Ελέγχου',
      resetBtn:    'ΕΠΑΝΑΦΟΡΑ',
      secLbl:      'Σημεία Ελέγχου και Νόμιμος Εξοπλισμός',
      bc0Lbl:      'Περιοδικός Έλεγχος',
      bc1Lbl:      'Ασφάλιση',
      noteBox:     'Απαιτείται <b>ξεχωριστή ασφάλιση</b> του ρυμουλκούμενου από το ρυμουλκό όχημα. Ενημερωθείτε από τον ασφαλιστή σας.',
      box: {
        title2:      'Ρυμουλκούμενων',
        diagramAlt:  'Πλάγια και Πίσω Όψη Ρυμουλκούμενου Κατ. Ο1 και Ο2',
        intro:       'Τα σημεία που ελέγχονται ώστε το ρυμουλκούμενο να είναι <strong>σύμφωνο με τον Κ.Ο.Κ.</strong> και ασφαλές στον δρόμο — ανακλαστήρες, πίσω τρίγωνα, φωτισμός, πινακίδα και σύστημα ζεύξης. Κατηγορία Ο1 και Ο2.',
        completeMsg: 'Το ρυμουλκούμενο είναι έτοιμο για τον δρόμο!',
        items: [
          { n:1, title:'Κεφαλή ζεύξης',            desc:'Ασφάλιση, φθορά, λίπανση' },
          { n:2, title:'Λασπωτήρες / φτερά',        desc:'Πάνω από τους τροχούς — σταθερά, ακέραια' },
          { n:3, title:'Ελαστικά',                   desc:'Εγκεκριμένου τύπου — πίεση, βάθος πέλματος, φθορά' },
          { n:4, title:'Πλευρικοί ανακλαστήρες',     desc:'Πορτοκαλί — παρόντες και καθαροί' },
          { n:5, title:'Πίσω τρίγωνα ανακλαστήρες', desc:'Κόκκινα — υποχρεωτικά' },
          { n:6, title:'Πίσω φώτα',                  desc:'Φλας, φρένων, θέσης, ομίχλης σε λειτουργία' },
          { n:7, title:'Πινακίδα κυκλοφορίας',       desc:'Πινακίδα και φωτισμός πινακίδας' },
          { n:8, title:'Εμπρόσθιος τροχός στήριξης (jockey)', desc:'Υποχρεωτικό, σε καλή κατάσταση' }
        ],
        bc0List: [
          { lbl:'Ελαστικά — πίεση και φθορά',          val:'✓ έλεγχος' },
          { lbl:'Πλαίσιο — φθορές, σκουριά, ρωγμές',     val:'✓ έλεγχος' },
          { lbl:'Σημάνσεις και ανακλαστήρες',           val:'✓ έλεγχος' },
          { lbl:'Φωτισμός — πλήρης λειτουργία',           val:'✓ έλεγχος' }
        ],
        extraLbl:  '',
        extraList: []
      },
      boat: {
        title2:      'Τρέιλερ Σκάφους',
        diagramAlt:  'Πλάγια και Πίσω Όψη Τρέιλερ Σκάφους Κατ. Ο1 και Ο2',
        intro:       'Τα ίδια σημεία του Κ.Ο.Κ. ισχύουν και στο τρέιλερ σκάφους — ανακλαστήρες, πίσω τρίγωνα, φωτισμός, πινακίδα και σύστημα ζεύξης. Προστίθενται όμως τα σημεία που αφορούν τη βύθιση στη θάλασσα και την πρόσδεση του σκάφους. Κατηγορία Ο1 και Ο2.',
        completeMsg: 'Το τρέιλερ σκάφους είναι έτοιμο για τον δρόμο!',
        items: [
          { n:1, title:'Κεφαλή ζεύξης',            desc:'Ασφάλιση, φθορά, λίπανση — προσοχή στη διάβρωση' },
          { n:2, title:'Λασπωτήρες / φτερά',        desc:'Πάνω από τους τροχούς — σταθερά, ακέραια' },
          { n:3, title:'Ελαστικά',                   desc:'Εγκεκριμένου τύπου — πίεση, πέλμα, γήρανση από ακινησία' },
          { n:4, title:'Πλευρικοί ανακλαστήρες',     desc:'Πορτοκαλί — παρόντες και καθαροί' },
          { n:5, title:'Πίσω τρίγωνα ανακλαστήρες', desc:'Κόκκινα — υποχρεωτικά' },
          { n:6, title:'Πίσω φώτα',                  desc:'Φλας, φρένων, θέσης, ομίχλης — στεγανά και σε λειτουργία' },
          { n:7, title:'Πινακίδα κυκλοφορίας',       desc:'Πινακίδα και φωτισμός πινακίδας' },
          { n:8, title:'Εμπρόσθιος τροχός στήριξης (jockey)', desc:'Υποχρεωτικό, σε καλή κατάσταση' }
        ],
        bc0List: [
          { lbl:'Ελαστικά — πίεση, πέλμα, γήρανση',      val:'✓ έλεγχος' },
          { lbl:'Πλαίσιο — διάβρωση, ρωγμές, συγκολλήσεις', val:'✓ έλεγχος' },
          { lbl:'Τριβείς τροχών — μετά από βύθιση',        val:'✓ έλεγχος' },
          { lbl:'Φωτισμός — στεγανότητα και λειτουργία',   val:'✓ έλεγχος' }
        ],
        extraLbl:  'Επιπλέον σημεία στο τρέιλερ σκάφους',
        extraList: [
          { title:'Βαρούλκο και ιμάντας ή συρματόσχοινο', desc:'Αντοχή, φθορά, ασφάλεια στο άγκιστρο' },
          { title:'Πρόσδεση σκάφους',                     desc:'Ιμάντες σε πλώρη και πρύμνη — το βαρούλκο μόνο του δεν αρκεί' },
          { title:'Ράουλα και βάσεις στήριξης',           desc:'Σωστή έδραση της γάστρας, χωρίς τζόγο' },
          { title:'Κατανομή φορτίου',                     desc:'Σκάφος κεντραρισμένο, σωστό φορτίο στην κεφαλή ζεύξης' },
          { title:'Έκπλυση με γλυκό νερό',                desc:'Μετά από κάθε βύθιση — τριβείς, φρένα, φωτισμός, πλαίσιο' }
        ]
      }
    },
    en: {
      title1:      'Trailer ',
      badgeKey:    'CATEGORY',
      diagramTag:  'SIDE and REAR VIEW',
      tagline:     'RUN THE FULL CHECKLIST and SEE DETAILS',
      progressLbl: 'Inspection Progress',
      resetBtn:    'RESET',
      secLbl:      'Check Points and Legal Equipment',
      bc0Lbl:      'Periodic Inspection',
      bc1Lbl:      'Insurance',
      noteBox:     '<b>Separate insurance</b> is required for the trailer, distinct from the towing vehicle. Contact your insurance provider.',
      box: {
        title2:      'Road Checks',
        diagramAlt:  'Side and Rear View of Trailer Cat. O1 and O2',
        intro:       'The checkpoints verified to ensure the trailer is <strong>compliant with Road Code</strong> and road-safe — reflectors, rear triangles, lights, number plate, and coupling system. Category O1 and O2.',
        completeMsg: 'The trailer is road-ready!',
        items: [
          { n:1, title:'Coupling head',             desc:'Locking mechanism, wear, lubrication' },
          { n:2, title:'Mudguards / wings',          desc:'Above wheels — secure, intact' },
          { n:3, title:'Tyres',                      desc:'Approved type — pressure, tread depth, wear' },
          { n:4, title:'Side reflectors',            desc:'Orange — present and clean' },
          { n:5, title:'Rear triangle reflectors',   desc:'Red — mandatory' },
          { n:6, title:'Rear lights',                desc:'Indicators, brake, position, fog — all working' },
          { n:7, title:'Number plate',               desc:'Plate and plate light' },
          { n:8, title:'Jockey wheel (support leg)', desc:'Mandatory — good condition' }
        ],
        bc0List: [
          { lbl:'Tyres — pressure and wear',       val:'✓ check' },
          { lbl:'Frame — damage, rust, cracks',      val:'✓ check' },
          { lbl:'Signs and reflectors',            val:'✓ check' },
          { lbl:'Lighting — fully operational',      val:'✓ check' }
        ],
        extraLbl:  '',
        extraList: []
      },
      boat: {
        title2:      'Boat Trailer Checks',
        diagramAlt:  'Side and Rear View of a Boat Trailer Cat. O1 and O2',
        intro:       'The same Road Code checkpoints apply to a boat trailer — reflectors, rear triangles, lights, number plate, and coupling system. On top of those come the points that relate to seawater immersion and securing the boat. Category O1 and O2.',
        completeMsg: 'The boat trailer is road-ready!',
        items: [
          { n:1, title:'Coupling head',             desc:'Locking mechanism, wear, lubrication — watch for corrosion' },
          { n:2, title:'Mudguards / wings',          desc:'Above wheels — secure, intact' },
          { n:3, title:'Tyres',                      desc:'Approved type — pressure, tread, ageing from long standstill' },
          { n:4, title:'Side reflectors',            desc:'Orange — present and clean' },
          { n:5, title:'Rear triangle reflectors',   desc:'Red — mandatory' },
          { n:6, title:'Rear lights',                desc:'Indicators, brake, position, fog — watertight and working' },
          { n:7, title:'Number plate',               desc:'Plate and plate light' },
          { n:8, title:'Jockey wheel (support leg)', desc:'Mandatory — good condition' }
        ],
        bc0List: [
          { lbl:'Tyres — pressure, tread, ageing',     val:'✓ check' },
          { lbl:'Frame — corrosion, cracks, welds',    val:'✓ check' },
          { lbl:'Wheel bearings — after immersion',    val:'✓ check' },
          { lbl:'Lighting — watertight and working',   val:'✓ check' }
        ],
        extraLbl:  'Additional checks on a boat trailer',
        extraList: [
          { title:'Winch and strap or cable',   desc:'Strength, wear, safety catch on the hook' },
          { title:'Securing the boat',          desc:'Straps at bow and stern — the winch alone is not enough' },
          { title:'Rollers and support pads',   desc:'Hull properly seated, no play' },
          { title:'Load distribution',          desc:'Boat centred, correct nose weight on the coupling' },
          { title:'Fresh-water rinse',          desc:'After every immersion — bearings, brakes, lights, frame' }
        ]
      }
    }
  };

  var checked      = new Set();
  var currentItems = [];
  var variant      = 'box';
  var imgBase      = '';
  var IMG          = { box: 'TRAILER_EXAMPLE.png', boat: 'BOAT_TRAILER_EXAMPLE.png' };

  function getLang() {
    return (window.I18n && window.I18n.getLang()) ||
           localStorage.getItem('lang') ||
           document.documentElement.lang ||
           'el';
  }

  function setText(id, text) { var e = document.getElementById(id); if (e) e.textContent = text; }
  function setHTML(id, html) { var e = document.getElementById(id); if (e) e.innerHTML  = html; }

  /* ---- Variant tab row — injected once ------------------------------ */
  function ensureTabs() {
    if (document.getElementById('trcVariantTabs')) return;
    var strip = document.getElementById('trcPreviewStrip');
    if (!strip || !strip.parentNode) return;
    var row = document.createElement('div');
    row.className = 'trc-variant-tabs';
    row.id        = 'trcVariantTabs';
    row.setAttribute('role', 'tablist');
    strip.parentNode.insertBefore(row, strip);
  }

  function buildTabs(lang) {
    var row = document.getElementById('trcVariantTabs');
    if (!row) return;
    var tabs = TABS[lang] || TABS.el;
    row.innerHTML = tabs.map(function (tb) {
      return '<button type="button" class="trc-vtab' + (tb.id === variant ? ' is-active' : '') +
             '" data-variant="' + tb.id + '" role="tab" aria-selected="' + (tb.id === variant) + '">' +
             '<i class="' + tb.icon + '"></i><span>' + tb.label + '</span></button>';
    }).join('');
    row.querySelectorAll('.trc-vtab').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var v = btn.getAttribute('data-variant');
        if (v === variant) return;
        variant = v;
        checked.clear();
        renderLang(getLang());
      });
    });
  }

  /* ---- Boat-only extra list — injected once ------------------------- */
  function ensureExtra() {
    if (document.getElementById('trcExtraWrap')) return;
    var grid = document.getElementById('trcChecksGrid');
    if (!grid || !grid.parentNode) return;
    var wrap = document.createElement('div');
    wrap.className = 'trc-extra-wrap';
    wrap.id        = 'trcExtraWrap';
    wrap.hidden    = true;
    wrap.innerHTML =
      '<div class="trc-sec-lbl trc-sec-lbl--extra">' +
        '<span class="trc-b trc-b--sea"><i class="fa-solid fa-anchor"></i></span>' +
        '<span id="trcExtraLbl"></span>' +
      '</div><ul class="trc-extra-list" id="trcExtraList"></ul>';
    grid.parentNode.insertBefore(wrap, grid.nextSibling);
  }

  function buildExtra(v) {
    var wrap = document.getElementById('trcExtraWrap');
    if (!wrap) return;
    if (!v.extraList || !v.extraList.length) { wrap.hidden = true; return; }
    wrap.hidden = false;
    setText('trcExtraLbl', v.extraLbl);
    var ul = document.getElementById('trcExtraList');
    if (ul) ul.innerHTML = v.extraList.map(function (r) {
      return '<li><span class="trc-extra-title">' + r.title + '</span>' +
             '<span class="trc-extra-desc">'      + r.desc  + '</span></li>';
    }).join('');
  }

  function renderLang(lang) {
    var t = I18N[lang] || I18N.el;
    var v = t[variant] || t.box;

    ensureTabs();
    ensureExtra();
    buildTabs(lang);

    setText('trcTitle1',          t.title1);
    setText('trcTitle2',          v.title2);
    setText('trcBadgeKey',        t.badgeKey);
    setText('trcDiagramTag',      t.diagramTag);

    var diagramImg = document.querySelector('.trc-diagram-wrap img');
    if (diagramImg) {
      if (!imgBase) imgBase = (diagramImg.getAttribute('src') || '').replace(/[^/]*$/, '');
      diagramImg.src = imgBase + IMG[variant];
      diagramImg.alt = v.diagramAlt;
    }

    setHTML('trcIntro',           v.intro);
    setText('trcTagline',         t.tagline);
    setText('trcProgressLbl',     t.progressLbl);
    setText('trcResetBtn',        t.resetBtn);
    setText('trcCompleteText',    v.completeMsg);
    setText('trcSecLbl',          t.secLbl);
    setText('trcBc0Lbl',          t.bc0Lbl);
    setText('trcBc0InnerLbl',     t.bc0Lbl);
    setText('trcBc1Lbl',          t.bc1Lbl);
    setText('trcBc1InnerLbl',     t.bc1Lbl);
    setHTML('trcNoteBox',         t.noteBox);
    buildBc0List(v.bc0List);
    buildExtra(v);
    buildPreview(lang);
    currentItems = v.items;
    buildCards(v.items);
    updateProgress();
  }

  function buildPreview(lang) {
    var strip = document.getElementById('trcPreviewStrip');
    if (!strip) return;
    var items = PREVIEW_ITEMS[lang] || PREVIEW_ITEMS.el;
    strip.innerHTML = items.map(function (item) {
      var lines = item.label.split('\n');
      return '<div class="trc-preview-item">' +
        '<div class="trc-preview-icon"><i class="' + item.icon + '"></i></div>' +
        '<div class="trc-preview-lbl">' + lines.join('<br>') + '</div>' +
      '</div>';
    }).join('');
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

  /* Deep link: #trailer-road-check-skafous opens the boat tab */
  function variantFromHash() {
    var h = (location.hash || '').toLowerCase();
    if (h.indexOf('skafous') > -1 || h.indexOf('boat') > -1) { variant = 'boat'; return true; }
    return false;
  }

  function scrollToWidget() {
    var sec = document.getElementById('trailer-road-check') ||
              document.querySelector('.trc-section');
    if (!sec) return;
    var panel = document.getElementById('trcMainCollapse');
    if (panel) {
      panel.classList.add('is-open');
      var tg = document.getElementById('trcMainToggle');
      if (tg) tg.setAttribute('aria-expanded', 'true');
    }
    sec.classList.add('vis', 'is-visible');
    setTimeout(function () { sec.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 300);
  }

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
    var deep = variantFromHash();
    renderLang(getLang());
    if (deep) setTimeout(scrollToWidget, 600);
    window.addEventListener('hashchange', function () {
      var before = variant;
      var d = variantFromHash();
      if (variant !== before) { checked.clear(); renderLang(getLang()); }
      if (d) scrollToWidget();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
