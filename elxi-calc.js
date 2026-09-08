/**
 * elxi-calc.js — Υπολογιστής συμβατότητας έλξης (οχήματα κατηγορίας Ο)
 *
 * Εφαρμόζει τα άρθρα 5 και 8 της ΥΑ 2805/2021, όπως ισχύουν μετά τις
 * ΥΑ 292015/2021 (Β΄ 4966) και ΥΑ 113794/2023 (Β΄ 2525).
 *
 * Χρήση: <div class="ta-box" id="elxiCalc" data-open="true|false"></div>
 * Το σενάριο χτίζει ολόκληρο το κουτί, σε ελληνικά ή αγγλικά ανάλογα με το
 * <html lang>, και ξαναχτίζεται μόνο του όταν αλλάξει η γλώσσα στην αρχική.
 * Καμία εξωτερική εξάρτηση.
 */
(function () {
  'use strict';

  var L = {
    el: {
      badge: 'ΥΠΟΛΟΓΙΣΤΗΣ ΕΛΞΗΣ · ΑΡΘΡΑ 5 ΚΑΙ 8 ΥΑ 2805/2021',
      title: 'Επιτρέπεται να τραβήξω αυτό το ρυμουλκούμενο;',
      catV: 'Ο1 έως Ο4', catK: 'ΚΑΤΗΓΟΡΙΑ',
      lead: 'Συμπληρώστε τα πεδία από τις δύο άδειες κυκλοφορίας. Οι κωδικοί δίπλα σε κάθε πεδίο είναι οι εναρμονισμένοι κοινοτικοί κωδικοί που θα βρείτε τυπωμένους στην άδεια.',
      openHint: 'ΑΝΟΙΞΤΕ ΤΟΝ ΥΠΟΛΟΓΙΣΤΗ ΚΑΙ ΚΑΝΤΕ ΤΟΝ ΕΛΕΓΧΟ',
      colTow: 'ΕΛΚΟΝ ΟΧΗΜΑ', colTr: 'ΕΛΚΟΜΕΝΟ ΟΧΗΜΑ',
      lCat: 'Κατηγορία έλκοντος', lCatH: 'Η κατηγορία αναγράφεται στην άδεια κυκλοφορίας. «G» σημαίνει όχημα παντός εδάφους.',
      lF2t: 'ΜΑΜΦΟ έλκοντος', lF2tH: 'Μέγιστη αποδεκτή μάζα φορτωμένου οχήματος, σε κιλά.',
      lO1: 'Μέγιστη μάζα έλξης με πέδηση', lO2: 'Μέγιστη μάζα έλξης χωρίς πέδηση',
      lG: 'Μάζα σε τάξη πορείας (AR)', lGH: 'Χρειάζεται μόνο για ρυμουλκούμενο Ο1 χωρίς πέδηση.',
      lF3: 'ΜΑΜΦΣ, μάζα συνδυασμού', lF3H: 'Προαιρετικό. Αν το συμπληρώσετε, ελέγχεται και ο συνδυασμός.',
      lFprT: 'Φορτίο πλάκας επικαθίσεως (ΦΠR)', lFprTH: 'Μόνο για ημιρυμουλκούμενα.',
      lKind: 'Είδος ελκομένου', lKindTr: 'Ρυμουλκούμενο', lKindSemi: 'Ημιρυμουλκούμενο',
      lSub: 'Υποκατηγορία', lBrake: 'Σύστημα πέδησης', lYes: 'Ναι', lNo: 'Όχι',
      lF2r: 'ΜΑΜΦΟ ελκομένου', lF2rH: 'Μέγιστη αποδεκτή μάζα φορτωμένου, σε κιλά.',
      lFprR: 'Φορτίο πείρου (ΦΠρ)', lFprRH: 'Μόνο για ημιρυμουλκούμενα.',
      lUse: 'Χρήση του ρυμουλκούμενου', lUseH: 'Πίσω από Ε.Ι.Χ., η κατηγορία Ο2 επιτρέπεται μόνο για συγκεκριμένες χρήσεις.',
      cats: [['M1','M1 — επιβατικό'],['M1G','M1G — επιβατικό παντός εδάφους'],['N1','N1 — ελαφρύ φορτηγό έως 3,5 t'],['N1G','N1G — ελαφρύ φορτηγό παντός εδάφους'],['M23','M2 / M3 — λεωφορείο'],['N23','N2 / N3 — φορτηγό'],['N23T','N2 / N3 — ρυμουλκό, ελκυστήρας']],
      subs: [['O1','Ο1 — έως 750 kg'],['O2','Ο2 — έως 3.500 kg'],['O3','Ο3 — έως 10 t'],['O4','Ο4 — άνω των 10 t']],
      uses: [['','— επιλέξτε —'],['horses','Μεταφορά αλόγων'],['boats','Μεταφορά σκαφών'],['historic','Οχήματα ιστορικού ενδιαφέροντος'],['racing','Αγωνιστικά αυτοκίνητα και μοτοσικλέτες'],['sport','Εξοπλισμός ερασιτεχνικής ή αθλητικής ενασχόλησης'],['training','Εκπαιδευτικό όχημα'],['caravan','Τροχόσπιτο'],['other','Άλλη χρήση — μεταφορά εμπορευμάτων, εργαλείων, υλικών']],
      go: 'ΕΛΕΓΧΟΣ', clear: 'ΚΑΘΑΡΙΣΜΟΣ',
      note: 'Εφαρμόζονται τα άρθρα 5 και 8 της ΥΑ 2805/2021, όπως ισχύουν μετά τις ΥΑ 292015/2021 (Β΄ 4966) και ΥΑ 113794/2023 (Β΄ 2525). Προϋποτίθεται ότι και τα δύο οχήματα φέρουν άδεια κυκλοφορίας.',
      warnH: 'ΤΟ ΕΡΓΑΛΕΙΟ ΕΙΝΑΙ ΕΝΔΕΙΚΤΙΚΟ',
      warnP: 'Καθοριστικές είναι οι προδιαγραφές του κατασκευαστή. Οι τιμές της άδειας κυκλοφορίας προκύπτουν από την έγκριση τύπου, όμως ο κατασκευαστής μπορεί να θέτει αυστηρότερα όρια για τη συγκεκριμένη έκδοση του μοντέλου, για τη διάταξη ζεύξης ή για τον κοτσαδόρο. Ο υπολογισμός στηρίζεται αποκλειστικά στα στοιχεία που εισάγετε και δεν υποκαθιστά το κείμενο του ΦΕΚ, το εγχειρίδιο του κατασκευαστή ή τον έλεγχο μηχανικού. Το γραφείο δεν φέρει ευθύνη για χρήση του αποτελέσματος χωρίς επαλήθευση.',
      yes: 'Πληρούται', no: 'Δεν πληρούται', ask: 'Χρειάζεται στοιχείο',
      okTitle: 'Ο συνδυασμός επιτρέπεται',
      okSub: 'Με βάση τα στοιχεία που δώσατε, πληρούνται οι προϋποθέσεις έλξης.',
      noTitle: 'Ο συνδυασμός δεν επιτρέπεται',
      noSub: 'Ένας τουλάχιστον όρος του άρθρου 5 ή 8 δεν πληρούται.',
      warnTitle: 'Χρειάζονται επιπλέον στοιχεία',
      warnSub: 'Συμπληρώστε τα πεδία που λείπουν για πλήρη έλεγχο.',
      missing: 'Λείπει τιμή από την άδεια κυκλοφορίας.',
      cLicence: 'Άδεια κυκλοφορίας και στα δύο οχήματα',
      cLicenceD: 'Και το έλκον και το ελκόμενο πρέπει να φέρουν άδεια κυκλοφορίας.',
      cPair: 'Επιτρεπτός συνδυασμός κατηγοριών', cLimit: 'Όριο μάζας υποκατηγορίας',
      cTM: 'Μέγιστη τεχνικώς αποδεκτή μάζα έλξης', cSpec: 'Ειδική προϋπόθεση κατά περίπτωση',
      cSemi: 'Ημιρυμουλκούμενο — μάζα έλξης και φορτίο πλάκας', cPin: 'Φορτίο πλάκας επικαθίσεως και πείρου',
      cUse: 'Επιτρεπόμενη χρήση Ο2 πίσω από Ε.Ι.Χ.', cComb: 'Μάζα φορτωμένου συνδυασμού',
      art5: 'άρθρο 5', art8: 'άρθρο 8', unbraked: 'χωρίς σύστημα πέδησης',
      useOk: 'Η χρήση περιλαμβάνεται στον κλειστό κατάλογο της περ. β΄ της παρ. 3.',
      useNo: 'Η χρήση δεν περιλαμβάνεται στον κλειστό κατάλογο της περ. β΄ της παρ. 3.',
      pairNo: 'Η κατηγορία του έλκοντος δεν επιτρέπεται να έλκει αυτή την υποκατηγορία.',
      pairSemi: 'Ημιρυμουλκούμενα έλκουν μόνο ρυμουλκά, δηλαδή ελκυστήρες Ν2 και Ν3, υποκατηγορίες Ο2 έως Ο4.',
      cta: 'Θέλετε να το ελέγξουμε εμείς;',
      ctaTxt: 'Στείλτε μας φωτογραφία των δύο αδειών κυκλοφορίας και σας απαντάμε αν ο συνδυασμός στέκει.',
      locale: 'el-GR'
    },
    en: {
      badge: 'TOWING CALCULATOR · ARTICLES 5 AND 8, MD 2805/2021',
      title: 'May I tow this trailer?',
      catV: 'O1 to O4', catK: 'CATEGORY',
      lead: 'Fill in the values from both registration documents. The codes next to each field are the harmonised EU codes printed on the document itself.',
      openHint: 'OPEN THE CALCULATOR AND RUN THE CHECK',
      colTow: 'TOWING VEHICLE', colTr: 'TOWED VEHICLE',
      lCat: 'Category of towing vehicle', lCatH: 'The category is printed on the registration document. "G" means an off-road vehicle.',
      lF2t: 'Max laden mass of towing vehicle', lF2tH: 'Maximum permissible laden mass, in kilograms.',
      lO1: 'Max towable mass, braked', lO2: 'Max towable mass, unbraked',
      lG: 'Mass in running order (AR)', lGH: 'Needed only for an unbraked O1 trailer.',
      lF3: 'Max laden mass of combination', lF3H: 'Optional. If given, the combination is checked as well.',
      lFprT: 'Fifth-wheel load', lFprTH: 'Semi-trailers only.',
      lKind: 'Type of towed vehicle', lKindTr: 'Trailer', lKindSemi: 'Semi-trailer',
      lSub: 'Subcategory', lBrake: 'Braking system', lYes: 'Yes', lNo: 'No',
      lF2r: 'Max laden mass of trailer', lF2rH: 'Maximum permissible laden mass, in kilograms.',
      lFprR: 'Kingpin load', lFprRH: 'Semi-trailers only.',
      lUse: 'Use of the trailer', lUseH: 'Behind a private car, category O2 is permitted only for specific uses.',
      cats: [['M1','M1 — passenger car'],['M1G','M1G — off-road passenger car'],['N1','N1 — light goods up to 3.5 t'],['N1G','N1G — off-road light goods'],['M23','M2 / M3 — bus or coach'],['N23','N2 / N3 — lorry'],['N23T','N2 / N3 — tractor unit']],
      subs: [['O1','O1 — up to 750 kg'],['O2','O2 — up to 3,500 kg'],['O3','O3 — up to 10 t'],['O4','O4 — over 10 t']],
      uses: [['','— select —'],['horses','Carrying horses'],['boats','Carrying boats'],['historic','Vehicles of historic interest'],['racing','Racing cars and motorcycles'],['sport','Equipment for amateur or sporting activity'],['training','Driver-training vehicle'],['caravan','Caravan'],['other','Other use — goods, tools, materials']],
      go: 'CHECK', clear: 'CLEAR',
      note: 'Articles 5 and 8 of MD 2805/2021 apply, as in force after MD 292015/2021 (B’ 4966) and MD 113794/2023 (B’ 2525). Both vehicles are assumed to hold a valid registration document.',
      warnH: 'THE TOOL IS INDICATIVE',
      warnP: 'The manufacturer’s specification is what governs. The figures on the registration document come from the type approval, but the manufacturer may set stricter limits for the particular version of the model, for the coupling device or for the towbar. The calculation rests solely on the values you enter and does not replace the text of the Government Gazette, the manufacturer’s handbook or an engineer’s assessment. The office accepts no liability for use of the result without verification.',
      yes: 'Satisfied', no: 'Not satisfied', ask: 'Value needed',
      okTitle: 'The combination is allowed',
      okSub: 'Based on the values you entered, the towing conditions are met.',
      noTitle: 'The combination is not allowed',
      noSub: 'At least one condition of article 5 or 8 is not met.',
      warnTitle: 'More data needed',
      warnSub: 'Fill in the missing fields for a complete check.',
      missing: 'A value from the registration document is missing.',
      cLicence: 'Both vehicles registered',
      cLicenceD: 'Both the towing and the towed vehicle must hold a registration document.',
      cPair: 'Permitted category combination', cLimit: 'Subcategory mass limit',
      cTM: 'Maximum technically permissible towable mass', cSpec: 'Case-specific condition',
      cSemi: 'Semi-trailer — towable mass and coupling load', cPin: 'Fifth-wheel and kingpin load',
      cUse: 'Permitted use of an O2 behind a private car', cComb: 'Laden combination mass',
      art5: 'article 5', art8: 'article 8', unbraked: 'unbraked',
      useOk: 'The use is in the closed list of para. 3(b).',
      useNo: 'The use is not in the closed list of para. 3(b).',
      pairNo: 'This towing category may not tow this subcategory.',
      pairSemi: 'Semi-trailers may only be towed by N2/N3 tractor units, subcategories O2 to O4.',
      cta: 'Want us to check it for you?',
      ctaTxt: 'Send us a photo of both registration documents and we will tell you whether the combination stands.',
      locale: 'en-GB'
    }
  };

  var root = null, t = L.el;

  function lang() {
    var l = (document.documentElement.lang || 'el').toLowerCase();
    return l.indexOf('en') === 0 ? 'en' : 'el';
  }
  function opts(list, arr) {
    var h = '';
    for (var i = 0; i < arr.length; i++) h += '<option value="' + arr[i][0] + '">' + arr[i][1] + '</option>';
    return h;
  }
  function field(id, label, key, hint, extra) {
    return '<div class="ec-f"' + (extra || '') + '><label for="' + id + '">' + label +
           (key ? '<span class="ec-f-key">' + key + '</span>' : '') +
           (hint ? '<small>' + hint + '</small>' : '') + '</label>' +
           '<input type="number" id="' + id + '" min="0" step="1" inputmode="numeric" placeholder="kg"></div>';
  }

  function markup(open) {
    return '' +
      '<div class="ta-topbar"><span class="ta-badge"><i class="fa-solid fa-scale-balanced"></i>&nbsp;<span>' + t.badge + '</span></span></div>' +
      '<div class="ta-title-row"><h3 class="ta-title">' + t.title + '</h3>' +
        '<div class="ta-cat-badge"><span class="ta-cat-bv">' + t.catV + '</span><span class="ta-cat-bk">' + t.catK + '</span></div></div>' +
      '<p class="ec-lead">' + t.lead + '</p>' +
      '<button type="button" class="ta-toggle ta-toggle--bar" id="ecToggle" aria-expanded="' + (open ? 'true' : 'false') + '" aria-controls="ecCollapse">' +
        '<span>' + t.openHint + '</span><i class="fa-solid fa-chevron-down ta-chevron"></i></button>' +
      '<div class="ta-collapse' + (open ? ' is-open' : '') + '" id="ecCollapse">' +
        '<form class="ec-form" id="ecForm" novalidate><div class="ec-grid">' +
          '<div class="ec-col"><div class="ec-col-h">' + t.colTow + '</div>' +
            '<div class="ec-f"><label for="ecCat">' + t.lCat + '<small>' + t.lCatH + '</small></label>' +
              '<select id="ecCat">' + opts(0, t.cats) + '</select></div>' +
            field('ecTowF2', t.lF2t, 'F.2', t.lF2tH) +
            field('ecTowO1', t.lO1, 'O.1', '') +
            field('ecTowO2', t.lO2, 'O.2', '') +
            field('ecTowG',  t.lG,  'G',   t.lGH) +
            field('ecTowF3', t.lF3, 'F.3', t.lF3H) +
            field('ecTowFpr', t.lFprT, '18', t.lFprTH, ' data-when="semi" hidden') +
          '</div>' +
          '<div class="ec-col"><div class="ec-col-h">' + t.colTr + '</div>' +
            '<div class="ec-f"><label for="ecKind">' + t.lKind + '</label><select id="ecKind">' +
              '<option value="trailer">' + t.lKindTr + '</option><option value="semi">' + t.lKindSemi + '</option></select></div>' +
            '<div class="ec-f"><label for="ecSub">' + t.lSub + '</label><select id="ecSub">' + opts(0, t.subs) + '</select></div>' +
            '<div class="ec-f"><label for="ecBrake">' + t.lBrake + '</label><select id="ecBrake">' +
              '<option value="yes">' + t.lYes + '</option><option value="no">' + t.lNo + '</option></select></div>' +
            field('ecTrF2', t.lF2r, 'F.2', t.lF2rH) +
            field('ecTrFpr', t.lFprR, '18', t.lFprRH, ' data-when="semi" hidden') +
            '<div class="ec-f" id="ecUseWrap" hidden><label for="ecUse">' + t.lUse + '<small>' + t.lUseH + '</small></label>' +
              '<select id="ecUse">' + opts(0, t.uses) + '</select></div>' +
          '</div>' +
        '</div>' +
        '<div class="ec-actions"><button type="submit" class="ec-go">' + t.go + '</button>' +
          '<button type="button" class="ec-clear" id="ecReset">' + t.clear + '</button></div>' +
        '<p class="ec-note">' + t.note + '</p></form>' +
        '<div class="ec-result" id="ecResult" hidden></div>' +
        '<div class="ta-warning"><div class="ta-warning-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>' +
          '<div class="ta-warning-body"><strong>' + t.warnH + '</strong><p>' + t.warnP + '</p></div></div>' +
      '</div>';
  }

  /* ── υπολογισμός ─────────────────────────────────────────────────── */
  function num(id) {
    var e = document.getElementById(id);
    if (!e) return null;
    var v = String(e.value).replace(',', '.').trim();
    if (v === '') return null;
    var n = parseFloat(v);
    return isFinite(n) && n > 0 ? n : null;
  }
  function val(id) { var e = document.getElementById(id); return e ? e.value : ''; }
  function fmt(n) { return Math.round(n).toLocaleString(t.locale); }
  function catLabel(c) {
    return { M1:'M1', M1G:'M1G', N1:'N1', N1G:'N1G', M23:'M2/M3', N23:'N2/N3', N23T:'N2/N3' }[c] || c;
  }
  function pairAllowed(cat, kind, sub) {
    if (kind === 'semi') return cat === 'N23T' && (sub === 'O2' || sub === 'O3' || sub === 'O4');
    if (cat === 'M1' || cat === 'M1G' || cat === 'N1' || cat === 'N1G' || cat === 'M23') return sub === 'O1' || sub === 'O2';
    if (cat === 'N23') return true;
    return false;
  }
  var USES = ['horses','boats','historic','racing','sport','training','caravan'];

  function run() {
    var cat = val('ecCat'), kind = val('ecKind'), sub = val('ecSub');
    var brake = val('ecBrake') === 'yes', use = val('ecUse');
    var f2t = num('ecTowF2'), g = num('ecTowG'), o1 = num('ecTowO1'), o2 = num('ecTowO2');
    var f3 = num('ecTowF3'), fpR = num('ecTowFpr'), f2r = num('ecTrF2'), fpr = num('ecTrFpr');
    var rows = [], fail = false, unknown = false;
    function add(title, state, detail, ref) {
      rows.push({ title: title, state: state, detail: detail, ref: ref });
      if (state === 'no') fail = true;
      if (state === 'ask') unknown = true;
    }
    add(t.cLicence, 'yes', t.cLicenceD, t.art5 + ' παρ. 1 περ. α΄');
    if (pairAllowed(cat, kind, sub)) add(t.cPair, 'yes', catLabel(cat) + ' → ' + sub, t.art5 + ' παρ. 1');
    else add(t.cPair, 'no', kind === 'semi' ? t.pairSemi : t.pairNo, t.art5 + ' παρ. 1');

    var cap = sub === 'O1' ? 750 : (sub === 'O2' ? 3500 : null);
    if (cap && f2r !== null) {
      add(t.cLimit, f2r <= cap ? 'yes' : 'no',
          'ΜΑΜΦΟ ' + fmt(f2r) + ' kg ' + (f2r <= cap ? '≤ ' : '> ') + fmt(cap) + ' kg', t.art5 + ' παρ. 3.2 περ. γ΄');
    } else if (cap) add(t.cLimit, 'ask', t.missing, t.art5 + ' παρ. 3.2 περ. γ΄');

    if (kind === 'trailer') {
      var tm = brake ? o1 : o2, tmLbl = brake ? 'O.1' : 'O.2';
      if (tm !== null && f2r !== null) {
        add(t.cTM, tm >= f2r ? 'yes' : 'no',
            'TM (' + tmLbl + ') ' + fmt(tm) + ' kg ' + (tm >= f2r ? '≥ ' : '< ') + 'ΜΑΜΦΟ ' + fmt(f2r) + ' kg', t.art5 + ' παρ. 2 περ. α΄');
      } else add(t.cTM, 'ask', t.missing + ' (' + tmLbl + ', F.2)', t.art5 + ' παρ. 2 περ. α΄');

      var isLight = cat === 'M1' || cat === 'N1', isOff = cat === 'M1G' || cat === 'N1G';
      if (sub === 'O1' && !brake && (isLight || isOff)) {
        if (g !== null && f2r !== null) {
          add(t.cSpec, (0.5 * g) >= f2r ? 'yes' : 'no',
              '0,5 × AR = ' + fmt(0.5 * g) + ' kg ' + ((0.5 * g) >= f2r ? '≥ ' : '< ') + fmt(f2r) + ' kg — Ο1 ' + t.unbraked,
              t.art5 + ' παρ. 2 περ. αα΄');
        } else add(t.cSpec, 'ask', t.missing + ' (G, F.2)', t.art5 + ' παρ. 2 περ. αα΄');
      } else if ((sub === 'O1' && brake) || sub === 'O2') {
        if (isLight) {
          if (f2t !== null && f2r !== null) {
            add(t.cSpec, f2t >= f2r ? 'yes' : 'no',
                'ΜΑΜΦΟ έλκοντος ' + fmt(f2t) + ' kg ' + (f2t >= f2r ? '≥ ' : '< ') + fmt(f2r) + ' kg', t.art5 + ' παρ. 2 περ. ββ΄');
          } else add(t.cSpec, 'ask', t.missing + ' (F.2)', t.art5 + ' παρ. 2 περ. ββ΄');
        } else if (isOff) {
          if (f2t !== null && f2r !== null) {
            add(t.cSpec, (1.5 * f2t) >= f2r ? 'yes' : 'no',
                '1,5 × ΜΑΜΦΟ έλκοντος = ' + fmt(1.5 * f2t) + ' kg ' + ((1.5 * f2t) >= f2r ? '≥ ' : '< ') + fmt(f2r) + ' kg',
                t.art5 + ' παρ. 2 περ. γγ΄');
          } else add(t.cSpec, 'ask', t.missing + ' (F.2)', t.art5 + ' παρ. 2 περ. γγ΄');
        }
      }
    } else {
      if (o1 !== null && fpR !== null && f2r !== null) {
        var sm = o1 + fpR;
        add(t.cSemi, sm >= f2r ? 'yes' : 'no',
            'TM (O.1) + ΦΠR = ' + fmt(sm) + ' kg ' + (sm >= f2r ? '≥ ' : '< ') + 'ΜΑΜΦΟ ' + fmt(f2r) + ' kg', t.art5 + ' παρ. 2 περ. β΄');
      } else add(t.cSemi, 'ask', t.missing + ' (O.1, 18, F.2)', t.art5 + ' παρ. 2 περ. β΄');
      if (fpR !== null && fpr !== null) {
        add(t.cPin, fpR >= fpr ? 'yes' : 'no',
            'ΦΠR ' + fmt(fpR) + ' ' + (fpR >= fpr ? '≥' : '<') + ' ΦΠρ ' + fmt(fpr), t.art5 + ' παρ. 2 περ. γ΄');
      } else add(t.cPin, 'ask', t.missing + ' (πεδίο 18)', t.art5 + ' παρ. 2 περ. γ΄');
    }

    if ((cat === 'M1' || cat === 'M1G') && sub === 'O2' && kind === 'trailer') {
      var ok = USES.indexOf(use) >= 0;
      add(t.cUse, use === '' ? 'ask' : (ok ? 'yes' : 'no'),
          use === '' ? t.missing : (ok ? t.useOk : t.useNo), t.art8 + ' παρ. 3 περ. β΄');
    }
    if (f3 !== null && f2t !== null && f2r !== null) {
      var need = f2t + f2r;
      add(t.cComb, f3 >= need ? 'yes' : 'no',
          'ΜΑΜΦΣ (F.3) ' + fmt(f3) + ' kg ' + (f3 >= need ? '≥ ' : '< ') + fmt(need) + ' kg', t.art5 + ' παρ. 2 περ. δ΄');
    }
    render(rows, fail, unknown);
  }

  function render(rows, fail, unknown) {
    var box = document.getElementById('ecResult');
    if (!box) return;
    var cls = fail ? 'ec-bad' : (unknown ? 'ec-warn' : 'ec-good');
    var title = fail ? t.noTitle : (unknown ? t.warnTitle : t.okTitle);
    var sub = fail ? t.noSub : (unknown ? t.warnSub : t.okSub);
    var icon = fail ? 'fa-circle-xmark' : (unknown ? 'fa-circle-question' : 'fa-circle-check');
    var h = '<div class="ec-verdict ' + cls + '"><i class="fa-solid ' + icon + '" aria-hidden="true"></i>' +
            '<div><strong>' + title + '</strong><span>' + sub + '</span></div></div><ul class="ec-rows">';
    rows.forEach(function (r) {
      var m = { yes: ['ec-r-ok','fa-check',t.yes], no: ['ec-r-no','fa-xmark',t.no], ask: ['ec-r-ask','fa-question',t.ask] }[r.state];
      h += '<li class="' + m[0] + '"><span class="ec-r-mark"><i class="fa-solid ' + m[1] + '"></i></span>' +
           '<span class="ec-r-body"><strong>' + r.title + '</strong><span class="ec-r-detail">' + r.detail + '</span>' +
           '<span class="ec-r-ref">' + r.ref + ' ΥΑ 2805/2021</span></span><span class="ec-r-state">' + m[2] + '</span></li>';
    });
    h += '</ul><div class="ec-after"><strong>' + t.cta + '</strong><p>' + t.ctaTxt + '</p></div>';
    box.innerHTML = h;
    box.hidden = false;
  }

  function syncFields() {
    var kind = val('ecKind'), cat = val('ecCat'), sub = val('ecSub');
    var n = root.querySelectorAll('[data-when="semi"]');
    for (var i = 0; i < n.length; i++) n[i].hidden = kind !== 'semi';
    var u = document.getElementById('ecUseWrap');
    if (u) u.hidden = !((cat === 'M1' || cat === 'M1G') && sub === 'O2' && kind === 'trailer');
  }

  function build() {
    if (!root) return;
    t = L[lang()];
    var open = root.getAttribute('data-open') !== 'false';
    if (window.matchMedia('(max-width: 768px)').matches) open = false;
    root.innerHTML = markup(open);

    var form = document.getElementById('ecForm');
    form.addEventListener('submit', function (e) { e.preventDefault(); run(); });
    ['ecKind','ecCat','ecSub'].forEach(function (id) {
      var e = document.getElementById(id);
      if (e) e.addEventListener('change', syncFields);
    });
    document.getElementById('ecReset').addEventListener('click', function () {
      form.reset(); syncFields();
      var b = document.getElementById('ecResult');
      if (b) { b.hidden = true; b.innerHTML = ''; }
    });
    var btn = document.getElementById('ecToggle'), panel = document.getElementById('ecCollapse');
    btn.addEventListener('click', function () {
      var o = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!o));
      panel.classList.toggle('is-open', !o);
    });
    syncFields();
  }

  function init() {
    root = document.getElementById('elxiCalc');
    if (!root) return;
    build();
    var prev = window.setLang;
    window.setLang = function (l) {
      if (typeof prev === 'function') prev(l);
      build();
    };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
