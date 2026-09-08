/**
 * elxi-calc.js — Υπολογιστής συμβατότητας έλξης (κατηγορία Ο)
 * Εφαρμόζει τα άρθρα 5 και 8 της ΥΑ 2805/2021, όπως ισχύουν μετά τις
 * ΥΑ 292015/2021 (Β' 4966) και ΥΑ 113794/2023 (Β' 2525).
 * Καμία εξωτερική εξάρτηση.
 */
(function () {
  'use strict';

  var L = {
    el: {
      yes: 'Πληρούται', no: 'Δεν πληρούται', na: 'Δεν εφαρμόζεται', ask: 'Χρειάζεται στοιχείο',
      okTitle: 'Ο συνδυασμός επιτρέπεται',
      okSub: 'Με βάση τα στοιχεία που δώσατε, πληρούνται οι προϋποθέσεις έλξης.',
      noTitle: 'Ο συνδυασμός δεν επιτρέπεται',
      noSub: 'Ένας τουλάχιστον όρος του άρθρου 5 ή 8 δεν πληρούται.',
      warnTitle: 'Χρειάζονται επιπλέον στοιχεία',
      warnSub: 'Συμπληρώστε τα πεδία που λείπουν για πλήρη έλεγχο.',
      missing: 'Λείπει τιμή από την άδεια κυκλοφορίας.',
      cLicence: 'Άδεια κυκλοφορίας και στα δύο οχήματα',
      cLicenceD: 'Και το έλκον και το ελκόμενο πρέπει να φέρουν άδεια κυκλοφορίας.',
      cPair: 'Επιτρεπτός συνδυασμός κατηγοριών',
      cLimit: 'Όριο μάζας υποκατηγορίας',
      cTM: 'Μέγιστη τεχνικώς αποδεκτή μάζα έλξης',
      cSpec: 'Ειδική προϋπόθεση κατά περίπτωση',
      cSemi: 'Ημιρυμουλκούμενο — μάζα έλξης και φορτίο πλάκας',
      cPin: 'Φορτίο πλάκας επικαθίσεως / πείρου',
      cUse: 'Επιτρεπόμενη χρήση Ο2 πίσω από Ε.Ι.Χ.',
      cComb: 'Μάζα φορτωμένου συνδυασμού',
      art5: 'άρθρο 5', art8: 'άρθρο 8',
      braked: 'με σύστημα πέδησης', unbraked: 'χωρίς σύστημα πέδησης',
      useOk: 'Η χρήση περιλαμβάνεται στον κλειστό κατάλογο της περ. β΄ της παρ. 3.',
      useNo: 'Η χρήση δεν περιλαμβάνεται στον κλειστό κατάλογο της περ. β΄ της παρ. 3.',
      pairNo: 'Η κατηγορία του έλκοντος δεν επιτρέπεται να έλκει αυτή την υποκατηγορία.',
      pairSemi: 'Ημιρυμουλκούμενα έλκουν μόνο ρυμουλκά (ελκυστήρες) Ν2 και Ν3, υποκατηγορίες Ο2 έως Ο4.',
      cta: 'Θέλετε να το ελέγξουμε εμείς;',
      ctaTxt: 'Στείλτε μας φωτογραφία των δύο αδειών κυκλοφορίας και σας απαντάμε αν ο συνδυασμός στέκει.'
    },
    en: {
      yes: 'Satisfied', no: 'Not satisfied', na: 'Not applicable', ask: 'Value needed',
      okTitle: 'The combination is allowed',
      okSub: 'Based on the values you entered, the towing conditions are met.',
      noTitle: 'The combination is not allowed',
      noSub: 'At least one condition of article 5 or 8 is not met.',
      warnTitle: 'More data needed',
      warnSub: 'Fill in the missing fields for a complete check.',
      missing: 'A value from the registration document is missing.',
      cLicence: 'Both vehicles registered',
      cLicenceD: 'Both the towing and the towed vehicle must hold a registration document.',
      cPair: 'Permitted category combination',
      cLimit: 'Subcategory mass limit',
      cTM: 'Maximum technically permissible towable mass',
      cSpec: 'Case-specific condition',
      cSemi: 'Semi-trailer — towable mass and coupling load',
      cPin: 'Fifth-wheel / kingpin load',
      cUse: 'Permitted use of an O2 behind a private car',
      cComb: 'Laden combination mass',
      art5: 'article 5', art8: 'article 8',
      braked: 'with braking system', unbraked: 'without braking system',
      useOk: 'The use is in the closed list of para. 3(b).',
      useNo: 'The use is not in the closed list of para. 3(b).',
      pairNo: 'This towing category may not tow this subcategory.',
      pairSemi: 'Semi-trailers may only be towed by N2/N3 tractor units, subcategories O2 to O4.',
      cta: 'Want us to check it for you?',
      ctaTxt: 'Send us a photo of both registration documents and we will tell you whether the combination stands.'
    }
  };

  function lang() {
    var l = document.documentElement.lang || 'el';
    return l.indexOf('en') === 0 ? 'en' : 'el';
  }

  function num(id) {
    var e = document.getElementById(id);
    if (!e) return null;
    var v = String(e.value).replace(',', '.').trim();
    if (v === '') return null;
    var n = parseFloat(v);
    return isFinite(n) && n > 0 ? n : null;
  }
  function val(id) { var e = document.getElementById(id); return e ? e.value : ''; }
  function fmt(n) { return Math.round(n).toLocaleString('el-GR'); }

  /* ---- Άρθρο 5 παρ. 1: ποιος έλκει τι ---- */
  function pairAllowed(cat, kind, sub) {
    if (kind === 'semi') {
      // περ. δ) — μόνο ρυμουλκά (ελκυστήρες) Ν2/Ν3, Ο2-Ο4
      return (cat === 'N23T') && (sub === 'O2' || sub === 'O3' || sub === 'O4');
    }
    // ρυμουλκούμενα
    if (cat === 'M1' || cat === 'M1G' || cat === 'N1' || cat === 'N1G' || cat === 'M23') {
      return sub === 'O1' || sub === 'O2';           // περ. β)
    }
    if (cat === 'N23') return true;                   // περ. γ) — όλες οι Ο
    if (cat === 'N23T') return false;                 // ελκυστήρας, μόνο ημιρυμ.
    return false;
  }

  var USES = ['horses', 'boats', 'historic', 'racing', 'sport', 'training', 'caravan'];

  function run() {
    var t = L[lang()];
    var cat   = val('ecCat');
    var kind  = val('ecKind');
    var sub   = val('ecSub');
    var brake = val('ecBrake') === 'yes';
    var use   = val('ecUse');

    var f2t = num('ecTowF2');      // ΜΑΜΦΟ έλκοντος (F.2)
    var g   = num('ecTowG');       // μάζα σε τάξη πορείας (G)
    var o1  = num('ecTowO1');      // ΤΜ με πέδηση (O.1)
    var o2  = num('ecTowO2');      // ΤΜ χωρίς πέδηση (O.2)
    var f3  = num('ecTowF3');      // ΜΑΜΦΣ (F.3)
    var fpR = num('ecTowFpr');     // ΦΠR (18)
    var f2r = num('ecTrF2');       // ΜΑΜΦΟ ελκομένου (F.2)
    var fpr = num('ecTrFpr');      // ΦΠρ (18)

    var rows = [], fail = false, unknown = false;

    function add(title, state, detail, ref) {
      rows.push({ title: title, state: state, detail: detail, ref: ref });
      if (state === 'no') fail = true;
      if (state === 'ask') unknown = true;
    }

    /* 1. Άδειες κυκλοφορίας */
    add(t.cLicence, 'yes', t.cLicenceD, t.art5 + ' παρ. 1 περ. α΄');

    /* 2. Επιτρεπτός συνδυασμός */
    if (pairAllowed(cat, kind, sub)) {
      add(t.cPair, 'yes', catLabel(cat) + ' → ' + sub, t.art5 + ' παρ. 1');
    } else {
      add(t.cPair, 'no', kind === 'semi' ? t.pairSemi : t.pairNo, t.art5 + ' παρ. 1');
    }

    /* 3. Όριο μάζας υποκατηγορίας */
    var cap = sub === 'O1' ? 750 : (sub === 'O2' ? 3500 : null);
    if (cap && f2r !== null) {
      add(t.cLimit, f2r <= cap ? 'yes' : 'no',
          'ΜΑΜΦΟ ' + fmt(f2r) + ' kg ' + (f2r <= cap ? '≤ ' : '> ') + fmt(cap) + ' kg',
          t.art5 + ' παρ. 3.2 περ. γ΄');
    } else if (cap) {
      add(t.cLimit, 'ask', t.missing, t.art5 + ' παρ. 3.2 περ. γ΄');
    }

    if (kind === 'trailer') {
      /* 4. ΤΜ ≥ ΜΑΜΦΟ ρυμουλκούμενου */
      var tm = brake ? o1 : o2;
      var tmLbl = brake ? 'O.1' : 'O.2';
      if (tm !== null && f2r !== null) {
        add(t.cTM, tm >= f2r ? 'yes' : 'no',
            'TM (' + tmLbl + ') ' + fmt(tm) + ' kg ' + (tm >= f2r ? '≥ ' : '< ') + 'ΜΑΜΦΟ ' + fmt(f2r) + ' kg',
            t.art5 + ' παρ. 2 περ. α΄');
      } else {
        add(t.cTM, 'ask', t.missing + ' (' + tmLbl + ', F.2)', t.art5 + ' παρ. 2 περ. α΄');
      }

      /* 5. Ειδική προϋπόθεση */
      var isLight = (cat === 'M1' || cat === 'N1');
      var isOff   = (cat === 'M1G' || cat === 'N1G');
      if (sub === 'O1' && !brake && (isLight || isOff)) {
        if (g !== null && f2r !== null) {
          add(t.cSpec, (0.5 * g) >= f2r ? 'yes' : 'no',
              '0,5 × AR = ' + fmt(0.5 * g) + ' kg ' + ((0.5 * g) >= f2r ? '≥ ' : '< ') + fmt(f2r) + ' kg — Ο1 ' + t.unbraked,
              t.art5 + ' παρ. 2 περ. αα΄');
        } else {
          add(t.cSpec, 'ask', t.missing + ' (G, F.2)', t.art5 + ' παρ. 2 περ. αα΄');
        }
      } else if ((sub === 'O1' && brake) || sub === 'O2') {
        if (isLight) {
          if (f2t !== null && f2r !== null) {
            add(t.cSpec, f2t >= f2r ? 'yes' : 'no',
                'ΜΑΜΦΟ έλκοντος ' + fmt(f2t) + ' kg ' + (f2t >= f2r ? '≥ ' : '< ') + fmt(f2r) + ' kg',
                t.art5 + ' παρ. 2 περ. ββ΄');
          } else { add(t.cSpec, 'ask', t.missing + ' (F.2)', t.art5 + ' παρ. 2 περ. ββ΄'); }
        } else if (isOff) {
          if (f2t !== null && f2r !== null) {
            add(t.cSpec, (1.5 * f2t) >= f2r ? 'yes' : 'no',
                '1,5 × ΜΑΜΦΟ έλκοντος = ' + fmt(1.5 * f2t) + ' kg ' + ((1.5 * f2t) >= f2r ? '≥ ' : '< ') + fmt(f2r) + ' kg — όχημα παντός εδάφους',
                t.art5 + ' παρ. 2 περ. γγ΄');
          } else { add(t.cSpec, 'ask', t.missing + ' (F.2)', t.art5 + ' παρ. 2 περ. γγ΄'); }
        }
      }
    } else {
      /* Ημιρυμουλκούμενο: ΤΜ(O.1) + ΦΠR ≥ ΜΑΜΦΟ */
      if (o1 !== null && fpR !== null && f2r !== null) {
        var s = o1 + fpR;
        add(t.cSemi, s >= f2r ? 'yes' : 'no',
            'TM (O.1) + ΦΠR = ' + fmt(s) + ' kg ' + (s >= f2r ? '≥ ' : '< ') + 'ΜΑΜΦΟ ' + fmt(f2r) + ' kg',
            t.art5 + ' παρ. 2 περ. β΄');
      } else {
        add(t.cSemi, 'ask', t.missing + ' (O.1, 18, F.2)', t.art5 + ' παρ. 2 περ. β΄');
      }
      if (fpR !== null && fpr !== null) {
        add(t.cPin, fpR >= fpr ? 'yes' : 'no',
            'ΦΠR ' + fmt(fpR) + ' ' + (fpR >= fpr ? '≥ ' : '< ') + ' ΦΠρ ' + fmt(fpr),
            t.art5 + ' παρ. 2 περ. γ΄');
      } else {
        add(t.cPin, 'ask', t.missing + ' (πεδίο 18)', t.art5 + ' παρ. 2 περ. γ΄');
      }
    }

    /* 6. Χρήση Ο2 πίσω από Ε.Ι.Χ. */
    if ((cat === 'M1' || cat === 'M1G') && sub === 'O2' && kind === 'trailer') {
      var ok = USES.indexOf(use) >= 0;
      add(t.cUse, use === '' ? 'ask' : (ok ? 'yes' : 'no'),
          use === '' ? t.missing : (ok ? t.useOk : t.useNo),
          t.art8 + ' παρ. 3 περ. β΄');
    }

    /* 7. ΜΑΜΦΣ — ενημερωτικά */
    if (f3 !== null && f2t !== null && f2r !== null) {
      var need = f2t + f2r;
      add(t.cComb, f3 >= need ? 'yes' : 'no',
          'ΜΑΜΦΣ (F.3) ' + fmt(f3) + ' kg ' + (f3 >= need ? '≥ ' : '< ') + fmt(need) + ' kg (άθροισμα ΜΑΜΦΟ)',
          t.art5 + ' παρ. 2 περ. δ΄ / 3.1');
    }

    render(rows, fail, unknown, t);
  }

  function catLabel(c) {
    return { M1: 'M1', M1G: 'M1G', N1: 'N1', N1G: 'N1G', M23: 'M2/M3', N23: 'N2/N3', N23T: 'N2/N3 (ρυμουλκό)' }[c] || c;
  }

  function render(rows, fail, unknown, t) {
    var box = document.getElementById('ecResult');
    if (!box) return;
    var cls = fail ? 'ec-bad' : (unknown ? 'ec-warn' : 'ec-good');
    var title = fail ? t.noTitle : (unknown ? t.warnTitle : t.okTitle);
    var sub = fail ? t.noSub : (unknown ? t.warnSub : t.okSub);
    var icon = fail ? 'fa-circle-xmark' : (unknown ? 'fa-circle-question' : 'fa-circle-check');

    var h = '<div class="ec-verdict ' + cls + '">' +
            '<i class="fa-solid ' + icon + '" aria-hidden="true"></i>' +
            '<div><strong>' + title + '</strong><span>' + sub + '</span></div></div>' +
            '<ul class="ec-rows">';
    rows.forEach(function (r) {
      var m = { yes: ['ec-r-ok', 'fa-check', t.yes], no: ['ec-r-no', 'fa-xmark', t.no], ask: ['ec-r-ask', 'fa-question', t.ask] }[r.state];
      h += '<li class="' + m[0] + '">' +
           '<span class="ec-r-mark"><i class="fa-solid ' + m[1] + '"></i></span>' +
           '<span class="ec-r-body"><strong>' + r.title + '</strong>' +
           '<span class="ec-r-detail">' + r.detail + '</span>' +
           '<span class="ec-r-ref">' + r.ref + ' ΥΑ 2805/2021</span></span>' +
           '<span class="ec-r-state">' + m[2] + '</span></li>';
    });
    h += '</ul><div class="ec-after"><strong>' + t.cta + '</strong><p>' + t.ctaTxt + '</p></div>';
    box.innerHTML = h;
    box.hidden = false;
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function syncFields() {
    var kind = val('ecKind');
    var cat  = val('ecCat');
    var sub  = val('ecSub');
    document.querySelectorAll('[data-when="semi"]').forEach(function (e) { e.hidden = kind !== 'semi'; });
    document.querySelectorAll('[data-when="trailer"]').forEach(function (e) { e.hidden = kind !== 'trailer'; });
    var useWrap = document.getElementById('ecUseWrap');
    if (useWrap) useWrap.hidden = !((cat === 'M1' || cat === 'M1G') && sub === 'O2' && kind === 'trailer');
  }

  function init() {
    var f = document.getElementById('ecForm');
    if (!f) return;
    f.addEventListener('submit', function (e) { e.preventDefault(); run(); });
    ['ecKind', 'ecCat', 'ecSub'].forEach(function (id) {
      var e = document.getElementById(id);
      if (e) e.addEventListener('change', syncFields);
    });
    var reset = document.getElementById('ecReset');
    if (reset) reset.addEventListener('click', function () {
      f.reset(); syncFields();
      var b = document.getElementById('ecResult');
      if (b) { b.hidden = true; b.innerHTML = ''; }
    });
    syncFields();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
