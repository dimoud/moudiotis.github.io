/**
 * service-animations.js
 * Δύο σκίτσα-κινούμενα γραφικά, ένα ανά σελίδα υπηρεσίας, με τον ίδιο
 * μηχανισμό σχεδίασης που χρησιμοποιούν τα type-approval-animation.js και
 * trailer-animation.js: κάθε γραμμή «γράφεται» με προοδευτικό
 * stroke-dashoffset, ύστερα εμφανίζονται τα κείμενα και τέλος μπαίνει το
 * στοιχείο-αποκάλυψη.
 *
 *   #impAnimWrap  → Εισαγόμενα & τροχόσπιτα: το όχημα και η αλλαγή
 *                   πινακίδας, από ξένη σε ελληνική άδεια κυκλοφορίας.
 *   #exesAnimWrap → Οχήματα ειδικού σκοπού: πλαίσιο-καμπίνα και η
 *                   υπερκατασκευή που κατεβαίνει και βιδώνεται πάνω του.
 *
 * Η γλώσσα διαβάζεται από το <html lang> τη στιγμή της δημιουργίας — οι
 * σελίδες υπηρεσιών αλλάζουν γλώσσα με σύνδεσμο, όχι επιτόπου.
 *
 * Ίδιο viewBox (820×340) με τα υπόλοιπα γραφικά ώστε να έχουν όλα το ίδιο
 * οπτικό βάρος μέσα στο container.
 */
(function () {
  'use strict';

  var DRAW_DURATION = 3200;
  var TEXT_DELAY    = 200;
  var REVEAL_DELAY  = 760;
  var RESTART_DELAY = 9000;
  var AUTO_RESTART  = true;

  var GOLD  = '#c9a86c';
  var NAVY  = '#1d3a5c';
  var GREEN = '#38a169';
  var MUTED = '#9aa3ad';
  var CREAM = '#f5f4ef';

  function isEn() {
    return (document.documentElement.getAttribute('lang') || 'el')
      .toLowerCase().indexOf('en') === 0;
  }

  /* Επιλογή κειμένου: t(['ελληνικά','english']) */
  function t(pair) { return isEn() ? pair[1] : pair[0]; }

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  var MONO = "'IBM Plex Mono',monospace";
  var OSW  = "'Oswald',sans-serif";

  /* Βοηθός για <text>: txt(x,y,size,content,extra) */
  function txt(x, y, size, content, opts) {
    opts = opts || {};
    return '<text class="sv-t" x="' + x + '" y="' + y + '"' +
      ' font-family="' + (opts.font || MONO) + '"' +
      ' font-size="' + size + '"' +
      ' letter-spacing="' + (opts.ls !== undefined ? opts.ls : 1.6) + '"' +
      (opts.weight ? ' font-weight="' + opts.weight + '"' : '') +
      (opts.anchor ? ' text-anchor="' + opts.anchor + '"' : '') +
      ' fill="' + (opts.fill || GOLD) + '"' +
      (opts.op !== undefined ? ' fill-opacity="' + opts.op + '"' : '') +
      ' opacity="0">' + esc(content) + '</text>';
  }

  /* ────────────────────────────────────────────────────────────────
     ΣΚΗΝΗ 1 — ΕΙΣΑΓΟΜΕΝΑ & ΤΡΟΧΟΣΠΙΤΑ
     Αριστερά το τροχόσπιτο σε τομή σκίτσου, δεξιά η ξένη πινακίδα που
     σβήνει και η ελληνική που προσγειώνεται στη θέση της.
     ──────────────────────────────────────────────────────────────── */
  function buildImport() {
    var alt = t([
      'Σκίτσο τροχόσπιτου και αλλαγή από ξένη σε ελληνική πινακίδα',
      'Sketch of a motorhome and the change from a foreign to a Greek plate'
    ]);

    var s = [];
    s.push('<svg id="svcSvg" viewBox="0 0 820 340" fill="none"',
      ' xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + esc(alt) + '"',
      ' style="width:100%;max-width:820px;overflow:visible;display:block;margin:0 auto">');

    s.push('<g stroke-linecap="round" stroke-linejoin="round" fill="none">');

    /* — ΟΧΗΜΑ: τροχόσπιτο με θάλαμο πάνω από την καμπίνα — */
    s.push('<g stroke="' + GOLD + '">');
    s.push('<path class="sv-p" d="M60 236 L60 200" stroke-width="3.5"/>');
    s.push('<path class="sv-p" d="M60 200 L96 162" stroke-width="3.5"/>');
    s.push('<path class="sv-p" d="M96 162 L96 150 L415 150" stroke-width="4"/>');
    s.push('<path class="sv-p" d="M415 150 L415 236" stroke-width="4"/>');
    s.push('<path class="sv-p" d="M60 236 L415 236" stroke-width="4"/>');
    /* όριο θαλάμου ύπνου πάνω από την καμπίνα */
    s.push('<path class="sv-p" d="M96 178 L168 178" stroke-width="2" stroke-opacity="0.7"/>');
    s.push('<path class="sv-p" d="M168 150 L168 178" stroke-width="2" stroke-opacity="0.7"/>');
    /* παρμπρίζ και πόρτα οδηγού */
    s.push('<path class="sv-p" d="M104 186 L154 186 L154 232 L104 232 Z" stroke-width="2"/>');
    /* παράθυρο διαμονής */
    s.push('<path class="sv-p" d="M196 172 L300 172 L300 210 L196 210 Z" stroke-width="2.5"/>');
    s.push('<path class="sv-p" d="M248 172 L248 210" stroke-width="1.2" stroke-opacity="0.5"/>');
    /* πόρτα εισόδου */
    s.push('<path class="sv-p" d="M322 178 L322 236" stroke-width="2"/>');
    s.push('<path class="sv-p" d="M322 178 L370 178 L370 236" stroke-width="2"/>');
    s.push('<path class="sv-p" d="M360 204 L360 214" stroke-width="2.4"/>');
    /* φεγγίτης οροφής και ράγα τέντας */
    s.push('<path class="sv-p" d="M242 138 L282 138 L282 150 L242 150 Z" stroke-width="2"/>');
    s.push('<path class="sv-p" d="M180 158 L410 158" stroke-width="1" stroke-opacity="0.35"/>');
    /* θόλοι και τροχοί */
    s.push('<path class="sv-p" d="M88 236 Q110 206 132 236" stroke-width="2.5"/>');
    s.push('<path class="sv-p" d="M330 236 Q352 206 374 236" stroke-width="2.5"/>');
    s.push('<circle class="sv-p" cx="110" cy="242" r="22" stroke-width="3.2"/>');
    s.push('<circle class="sv-p" cx="110" cy="242" r="10" stroke-width="2" stroke-opacity="0.6"/>');
    s.push('<circle class="sv-p" cx="352" cy="242" r="22" stroke-width="3.2"/>');
    s.push('<circle class="sv-p" cx="352" cy="242" r="10" stroke-width="2" stroke-opacity="0.6"/>');
    /* έδαφος και γραμμή διαστάσεων */
    s.push('<path class="sv-p" d="M26 264 L480 264" stroke-width="2.2"/>');
    s.push('<path class="sv-p" d="M60 290 L415 290" stroke-width="1.4" stroke-dasharray="4 3" stroke-opacity="0.6"/>');
    s.push('<path class="sv-p" d="M60 284 L60 296" stroke-width="2"/>');
    s.push('<path class="sv-p" d="M415 284 L415 296" stroke-width="2"/>');
    s.push('</g>');

    /* — ΞΕΝΗ ΠΙΝΑΚΙΔΑ (σβήνει στο τέλος) — */
    s.push('<g id="impOld" stroke="' + MUTED + '">');
    s.push('<path class="sv-p" d="M520 92 L790 92 L790 158 L520 158 Z" stroke-width="3"/>');
    s.push('<path class="sv-p" d="M520 92 L556 92 L556 158 L520 158 Z" stroke-width="2"/>');
    s.push('</g>');

    /* — ΒΕΛΟΣ ΜΕΤΑΒΑΣΗΣ — */
    s.push('<g stroke="' + GOLD + '">');
    s.push('<path class="sv-p" d="M655 172 L655 204" stroke-width="2.6"/>');
    s.push('<path class="sv-p" d="M646 195 L655 205 L664 195" stroke-width="2.6"/>');
    s.push('</g>');

    s.push('</g>');

    /* — ΚΕΙΜΕΝΑ — */
    s.push(txt(60, 112, 10,
      t(['ΕΙΣΑΓΟΜΕΝΟ · ΤΡΟΧΟΣΠΙΤΟ · ΙΔΙΟΚΑΤΑΣΚΕΥΗ',
         'IMPORTED · MOTORHOME · CUSTOM-BUILT']), { ls: 1.8 }));
    s.push(txt(237, 308, 10,
      t(['ΚΑΤΗΓΟΡΙΕΣ  M1 · N1 · O · L', 'CATEGORIES  M1 · N1 · O · L']),
      { anchor: 'middle', ls: 1.8 }));
    s.push(txt(520, 82, 9,
      t(['ΞΕΝΗ ΑΔΕΙΑ ΚΥΚΛΟΦΟΡΙΑΣ', 'FOREIGN REGISTRATION']),
      { ls: 1.6, fill: MUTED }));
    s.push(txt(538, 132, 15, 'D', { anchor: 'middle', fill: MUTED, font: OSW, weight: '700', ls: 0 }));
    s.push(txt(676, 134, 24, 'MH-AB 471', { anchor: 'middle', fill: MUTED, font: OSW, weight: '700', ls: 3 }));
    s.push(txt(645, 194, 9.5,
      t(['ΜΕΜΟΝΩΜΕΝΗ ΕΓΚΡΙΣΗ', 'INDIVIDUAL APPROVAL']),
      { anchor: 'end', ls: 1.6 }));

    /* — ΕΛΛΗΝΙΚΗ ΠΙΝΑΚΙΔΑ: το στοιχείο-αποκάλυψη — */
    s.push('<g id="svcReveal" opacity="0">');
    s.push('<rect x="520" y="222" width="270" height="72" rx="9" fill="' + CREAM + '"',
           ' stroke="' + GREEN + '" stroke-width="4"/>');
    s.push('<path d="M529 222 L560 222 L560 294 L529 294 Q520 294 520 285 L520 231 Q520 222 529 222 Z"',
           ' fill="' + NAVY + '"/>');
    /* κύκλος αστεριών της ΕΕ, απλοποιημένος */
    var i, ang, cx, cy;
    for (i = 0; i < 8; i++) {
      ang = (i / 8) * Math.PI * 2 - Math.PI / 2;
      cx = (540 + Math.cos(ang) * 10).toFixed(1);
      cy = (248 + Math.sin(ang) * 10).toFixed(1);
      s.push('<circle cx="' + cx + '" cy="' + cy + '" r="1.5" fill="' + GOLD + '"/>');
    }
    s.push('<text x="540" y="284" text-anchor="middle" font-family="' + OSW + '"',
           ' font-size="13" font-weight="700" letter-spacing="1" fill="' + GOLD + '">GR</text>');
    s.push('<text x="678" y="272" text-anchor="middle" font-family="' + OSW + '"',
           ' font-size="34" font-weight="700" letter-spacing="5" fill="' + NAVY + '">ΙΖΡ 4471</text>');
    s.push('<circle cx="789" cy="293" r="17" fill="' + GREEN + '"/>');
    s.push('<path d="M781 293 L787 299 L797 287" stroke="#fff" stroke-width="3"',
           ' stroke-linecap="round" stroke-linejoin="round" fill="none"/>');
    s.push('<text x="655" y="322" text-anchor="middle" font-family="' + MONO + '"',
           ' font-size="9.5" letter-spacing="1.6" fill="' + GREEN + '">' +
           esc(t(['ΕΛΛΗΝΙΚΗ ΑΔΕΙΑ ΚΥΚΛΟΦΟΡΙΑΣ', 'GREEK REGISTRATION'])) + '</text>');
    s.push('</g>');

    s.push('</svg>');
    return s.join('\n');
  }

  /* Αποκάλυψη σκηνής 1: η ξένη πινακίδα ξεθωριάζει, η ελληνική προσγειώνεται. */
  function revealImport(svg) {
    var old = svg.querySelector('#impOld');
    if (old) {
      old.style.transition = 'opacity 0.5s ease';
      old.style.opacity    = '0.25';
    }
    var g = svg.querySelector('#svcReveal');
    if (!g) return;
    g.style.transition = 'none';
    g.style.opacity    = '0';
    g.setAttribute('transform', 'translate(294.8,116.1) scale(0.55)');
    void g.getBoundingClientRect();
    g.style.transition = 'opacity 0.4s ease, transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
    g.style.opacity    = '1';
    g.setAttribute('transform', 'translate(0,0) scale(1)');
  }

  function resetImport(svg) {
    var old = svg.querySelector('#impOld');
    if (old) { old.style.transition = 'none'; old.style.opacity = '1'; }
  }

  /* ────────────────────────────────────────────────────────────────
     ΣΚΗΝΗ 2 — ΟΧΗΜΑΤΑ ΕΙΔΙΚΟΥ ΣΚΟΠΟΥ
     Σχεδιάζεται το γυμνό πλαίσιο-καμπίνα· ύστερα η υπερκατασκευή
     κατεβαίνει από ψηλά, βιδώνεται με τέσσερις κοχλίες και ο κωδικός
     αμαξώματος SG φωτίζεται.
     ──────────────────────────────────────────────────────────────── */
  var EXES_CODES = ['SA', 'SB', 'SC', 'SD', 'SE', 'SF', 'SG', 'SH', 'SJ', 'SK'];
  var EXES_X0 = 448, EXES_STEP = 36, EXES_SG = 6;

  function buildExes() {
    var alt = t([
      'Σκίτσο πλαισίου-καμπίνας και υπερκατασκευής οχήματος ειδικού σκοπού',
      'Sketch of a chassis-cab and the superstructure of a special purpose vehicle'
    ]);

    var s = [];
    s.push('<svg id="svcSvg" viewBox="0 0 820 340" fill="none"',
      ' xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + esc(alt) + '"',
      ' style="width:100%;max-width:820px;overflow:visible;display:block;margin:0 auto">');

    /* — ΠΛΑΙΣΙΟ-ΚΑΜΠΙΝΑ (σχεδιάζεται) — */
    s.push('<g stroke="' + GOLD + '" stroke-linecap="round" stroke-linejoin="round" fill="none">');
    /* καμπίνα */
    s.push('<path class="sv-p" d="M72 258 L72 178 L104 178 L128 142 L200 142 L200 258" stroke-width="4"/>');
    s.push('<path class="sv-p" d="M136 150 L192 150 L192 176 L118 176 Z" stroke-width="2"/>');
    s.push('<path class="sv-p" d="M162 186 L162 252" stroke-width="2" stroke-opacity="0.7"/>');
    s.push('<path class="sv-p" d="M152 210 L152 220" stroke-width="2.4"/>');
    /* διαμήκεις δοκοί πλαισίου */
    s.push('<path class="sv-p" d="M200 232 L644 232" stroke-width="5"/>');
    s.push('<path class="sv-p" d="M200 250 L644 250" stroke-width="5"/>');
    s.push('<path class="sv-p" d="M644 232 L644 250" stroke-width="3.5"/>');
    /* εγκάρσιες τραβέρσες */
    s.push('<path class="sv-p" d="M300 232 L300 250" stroke-width="2" stroke-opacity="0.7"/>');
    s.push('<path class="sv-p" d="M400 232 L400 250" stroke-width="2" stroke-opacity="0.7"/>');
    s.push('<path class="sv-p" d="M500 232 L500 250" stroke-width="2" stroke-opacity="0.7"/>');
    s.push('<path class="sv-p" d="M600 232 L600 250" stroke-width="2" stroke-opacity="0.7"/>');
    /* θόλος και τροχοί */
    s.push('<path class="sv-p" d="M110 250 Q136 220 162 250" stroke-width="2.5"/>');
    s.push('<circle class="sv-p" cx="136" cy="260" r="26" stroke-width="3.4"/>');
    s.push('<circle class="sv-p" cx="136" cy="260" r="12" stroke-width="2" stroke-opacity="0.6"/>');
    s.push('<circle class="sv-p" cx="520" cy="260" r="26" stroke-width="3.4"/>');
    s.push('<circle class="sv-p" cx="520" cy="260" r="12" stroke-width="2" stroke-opacity="0.6"/>');
    s.push('<circle class="sv-p" cx="596" cy="260" r="26" stroke-width="3.4"/>');
    s.push('<circle class="sv-p" cx="596" cy="260" r="12" stroke-width="2" stroke-opacity="0.6"/>');
    /* έδαφος */
    s.push('<path class="sv-p" d="M30 286 L790 286" stroke-width="2.2"/>');
    /* οδηγός για την ετικέτα υπερκατασκευής */
    s.push('<path class="sv-p" d="M628 140 L690 140" stroke-width="1.4" stroke-opacity="0.6"/>');
    s.push('</g>');

    /* — ΥΠΕΡΚΑΤΑΣΚΕΥΗ: κατεβαίνει, δεν σχεδιάζεται — */
    s.push('<g id="exesBody" opacity="0" stroke="' + GOLD + '"',
           ' stroke-linecap="round" stroke-linejoin="round" fill="none">');
    s.push('<path d="M220 228 L220 108 L620 108 L620 228" stroke-width="4"/>');
    s.push('<path d="M240 150 L600 150" stroke-width="1.4" stroke-opacity="0.45"/>');
    s.push('<path d="M240 192 L370 192" stroke-width="1.4" stroke-opacity="0.45"/>');
    s.push('<path d="M510 192 L600 192" stroke-width="1.4" stroke-opacity="0.45"/>');
    s.push('<path d="M560 108 L560 228" stroke-width="2.2" stroke-opacity="0.7"/>');
    /* γερανός επί της υπερκατασκευής: κολόνα, αρθρωτός βραχίονας με πάχος,
       δεύτερο σκέλος με απότομη κλίση προς το άγκιστρο — όχι συμμετρική
       κορυφή, που θα διαβαζόταν ως στέγη. */
    s.push('<path d="M242 108 L242 56 L272 56 L272 108" stroke-width="3.2"/>');
    s.push('<path d="M256 60 L452 26 L456 38 L260 72 Z" stroke-width="2.6"/>');
    s.push('<path d="M452 28 L512 72 L503 80 L448 40 Z" stroke-width="2.4"/>');
    s.push('<path d="M508 78 L508 102" stroke-width="1.3" stroke-dasharray="4 3" stroke-opacity="0.7"/>');
    s.push('<path d="M501 102 Q508 116 515 104" stroke-width="2.6"/>');
    s.push('<path d="M248 88 L266 88" stroke-width="1.6" stroke-opacity="0.55"/>');
    s.push('</g>');

    /* — ΚΟΧΛΙΕΣ ΣΤΗΡΙΞΗΣ — */
    s.push('<g id="exesBolts">');
    [250, 360, 470, 590].forEach(function (x) {
      s.push('<circle class="sv-bolt" cx="' + x + '" cy="230" r="5.5" fill="' + GREEN + '" opacity="0"/>');
    });
    s.push('</g>');

    /* — ΚΕΙΜΕΝΑ — */
    s.push(txt(72, 318, 10, t(['ΠΛΑΙΣΙΟ · ΚΑΜΠΙΝΑ', 'CHASSIS · CAB']), { ls: 1.8 }));
    s.push(txt(696, 144, 10, t(['ΥΠΕΡΚΑΤΑΣΚΕΥΗ', 'SUPERSTRUCTURE']), { ls: 1.6 }));
    s.push(txt(EXES_X0 - 16, 302, 8.5,
      t(['ΚΩΔΙΚΟΙ ΑΜΑΞΩΜΑΤΟΣ', 'BODYWORK CODES']), { ls: 1.5, op: 0.75 }));
    EXES_CODES.forEach(function (c, i) {
      s.push(txt(EXES_X0 + i * EXES_STEP, 326, 12, c,
        { anchor: 'middle', font: OSW, weight: '700', ls: 1,
          op: i === EXES_SG ? 1 : 0.42 }));
    });

    /* — ΑΠΟΚΑΛΥΨΗ: πλαίσιο γύρω από τον SG και σήμα ΕΧΕΣ — */
    var sgx = EXES_X0 + EXES_SG * EXES_STEP;
    s.push('<g id="svcReveal" opacity="0">');
    s.push('<rect x="' + (sgx - 17) + '" y="310" width="34" height="23" rx="4"',
           ' fill="rgba(56,161,105,0.12)" stroke="' + GREEN + '" stroke-width="2.4"/>');
    s.push('<text x="' + sgx + '" y="326" text-anchor="middle" font-family="' + OSW + '"',
           ' font-size="12" font-weight="700" letter-spacing="1" fill="' + GREEN + '">SG</text>');
    s.push('<rect x="376" y="156" width="124" height="40" rx="6" fill="' + CREAM + '"',
           ' stroke="' + GREEN + '" stroke-width="3"/>');
    s.push('<text x="438" y="184" text-anchor="middle" font-family="' + OSW + '"',
           ' font-size="21" font-weight="700" letter-spacing="3" fill="' + GREEN + '">' +
           esc(t(['ΕΧΕΣ', 'SPV'])) + '</text>');
    s.push('</g>');

    s.push('</svg>');
    return s.join('\n');
  }

  /* Αποκάλυψη σκηνής 2: πτώση υπερκατασκευής, κοχλίες, σήμανση. */
  function revealExes(svg) {
    var body = svg.querySelector('#exesBody');
    if (body) {
      body.style.transition = 'none';
      body.style.opacity    = '0';
      body.setAttribute('transform', 'translate(0,-140)');
      void body.getBoundingClientRect();
      body.style.transition = 'opacity 0.35s ease, transform 0.75s cubic-bezier(0.34,1.35,0.5,1)';
      body.style.opacity    = '1';
      body.setAttribute('transform', 'translate(0,0)');
    }
    svg.querySelectorAll('.sv-bolt').forEach(function (b, i) {
      b.style.transition = 'opacity 0.25s ease';
      setTimeout(function () { b.style.opacity = '1'; }, 780 + i * 90);
    });
    var g = svg.querySelector('#svcReveal');
    if (!g) return;
    setTimeout(function () {
      g.style.transition = 'none';
      g.style.opacity    = '0';
      g.setAttribute('transform', 'translate(219,120) scale(0.5)');
      void g.getBoundingClientRect();
      g.style.transition = 'opacity 0.4s ease, transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
      g.style.opacity    = '1';
      g.setAttribute('transform', 'translate(0,0) scale(1)');
    }, 1150);
  }

  function resetExes(svg) {
    var body = svg.querySelector('#exesBody');
    if (body) {
      body.style.transition = 'none';
      body.style.opacity    = '0';
      body.setAttribute('transform', 'translate(0,-140)');
    }
    svg.querySelectorAll('.sv-bolt').forEach(function (b) {
      b.style.transition = 'none';
      b.style.opacity    = '0';
    });
  }

  /* ── ΣΚΗΝΕΣ ── */
  var SCENES = {
    impAnimWrap:  { build: buildImport, reveal: revealImport, reset: resetImport },
    exesAnimWrap: { build: buildExes,   reveal: revealExes,   reset: resetExes }
  };

  /* ── ΜΗΧΑΝΗ ΣΧΕΔΙΑΣΗΣ (ίδια με τα υπόλοιπα γραφικά) ── */
  function measurePaths(container) {
    var data = [];
    container.querySelectorAll('.sv-p').forEach(function (el) {
      var len = 0;
      try {
        if (el.tagName.toLowerCase() === 'circle') {
          len = 2 * Math.PI * parseFloat(el.getAttribute('r') || 0);
        } else {
          len = el.getTotalLength ? el.getTotalLength() : 0;
        }
      } catch (e) { len = 0; }
      if (!len) return;
      data.push({ el: el, len: len });
    });
    return data;
  }

  function easeInOut(x) {
    return x < 0.5 ? 2 * x * x : -1 + (4 - 2 * x) * x;
  }

  function animateDraw(pathData, duration, onComplete) {
    if (!pathData.length) { if (onComplete) onComplete(); return; }
    var total = pathData.reduce(function (a, d) { return a + d.len; }, 0);
    var acc = 0, start = null;
    pathData.forEach(function (d) {
      d.start = acc; acc += d.len;
      d.el.style.strokeDasharray  = d.len + ' ' + d.len;
      d.el.style.strokeDashoffset = d.len;
    });
    function frame(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var done = easeInOut(p) * total;
      pathData.forEach(function (d) {
        var shown = Math.max(0, Math.min(done - d.start, d.len));
        d.el.style.strokeDashoffset = (d.len - shown);
      });
      if (p < 1) requestAnimationFrame(frame);
      else if (onComplete) onComplete();
    }
    requestAnimationFrame(frame);
  }

  function showTexts(svg) {
    svg.querySelectorAll('.sv-t').forEach(function (el, i) {
      el.style.transition = 'opacity 0.4s ease';
      setTimeout(function () { el.style.opacity = '1'; }, i * 80);
    });
  }

  function resetAll(svg, pathData, scene) {
    pathData.forEach(function (d) {
      d.el.style.strokeDasharray  = d.len + ' ' + d.len;
      d.el.style.strokeDashoffset = d.len;
    });
    svg.querySelectorAll('.sv-t').forEach(function (el) {
      el.style.transition = 'none';
      el.style.opacity    = '0';
    });
    var g = svg.querySelector('#svcReveal');
    if (g) { g.style.transition = 'none'; g.style.opacity = '0'; }
    if (scene.reset) scene.reset(svg);
  }

  function showStatic(svg, scene) {
    svg.querySelectorAll('.sv-p').forEach(function (el) {
      el.style.strokeDasharray  = 'none';
      el.style.strokeDashoffset = '0';
    });
    svg.querySelectorAll('.sv-t').forEach(function (el) { el.style.opacity = '1'; });
    svg.querySelectorAll('.sv-bolt').forEach(function (el) { el.style.opacity = '1'; });
    var body = svg.querySelector('#exesBody');
    if (body) { body.setAttribute('transform', 'translate(0,0)'); body.style.opacity = '1'; }
    var old = svg.querySelector('#impOld');
    if (old) old.style.opacity = '0.25';
    var g = svg.querySelector('#svcReveal');
    if (g) g.style.opacity = '1';
  }

  function runSequence(svg, scene) {
    var pathData = measurePaths(svg);
    function start() {
      resetAll(svg, pathData, scene);
      setTimeout(function () {
        animateDraw(pathData, DRAW_DURATION, function () {
          setTimeout(function () { showTexts(svg); }, TEXT_DELAY);
          setTimeout(function () {
            scene.reveal(svg);
            if (AUTO_RESTART) setTimeout(start, RESTART_DELAY);
          }, REVEAL_DELAY);
        });
      }, 60);
    }
    start();
  }

  function init() {
    Object.keys(SCENES).forEach(function (id) {
      var wrapper = document.getElementById(id);
      if (!wrapper) return;
      var scene = SCENES[id];
      wrapper.innerHTML = scene.build();
      var svg = wrapper.querySelector('#svcSvg');
      if (!svg) return;

      var reduced = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) { showStatic(svg, scene); return; }

      if ('IntersectionObserver' in window) {
        var started = false;
        new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting && !started) { started = true; runSequence(svg, scene); }
          });
        }, { threshold: 0.25 }).observe(wrapper);
      } else {
        runSequence(svg, scene);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.ServiceAnim = { init: init };
}());
