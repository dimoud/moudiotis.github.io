/**
 * site-init.js — Site Initializer & Rendering Engine
 * ════════════════════════════════════════════════════════════════════════════
 * LOAD ORDER CRITICAL — no defer, no async.
 * Must be loaded at the bottom of <body>, AFTER config.js (which is in <head>),
 * and BEFORE eng-animations.js and i18n.js.
 *
 * Why synchronous (no DOMContentLoaded wrapper):
 *   Scripts at the bottom of <body> run after all HTML above them is parsed.
 *   The DOM is fully available. Rendering here synchronously means that when
 *   eng-animations.js runs next, it can observe ALL [data-reveal] elements —
 *   including the dynamically rendered service cards and project cards.
 *   Using DOMContentLoaded would delay rendering until after eng-animations.js
 *   has already scanned the DOM, causing those cards to never animate.
 *
 * Responsibilities:
 *   1. Build window.SITE_CONFIG.translations from config data  →  for i18n.js
 *   2. Inject CSS theme variables (accent color override)
 *   3. Set <title> and <meta description>
 *   4. Set asset sources (logo, photo, hero slides)
 *   5. Set contact links (phone, email)
 *   6. Set measurement labels (auto-generated from array lengths)
 *   7. Set name fields (nav brand, contact person, footer)
 *   8. Render marquee items
 *   9. Render about features
 *  10. Render services grid
 *  11. Render projects grid
 *  12. Render contact form dropdown options
 * ════════════════════════════════════════════════════════════════════════════
 */

/* LOAD ORDER CRITICAL — no defer, no async */

(function () {
    'use strict';

    var C = window.SITE_CONFIG;
    if (!C) {
        console.error('[site-init] window.SITE_CONFIG not found. Did config.js load before site-init.js?');
        return;
    }

    var P = C.profile;
    var A = C.about;


    // ── 1. BUILD TRANSLATIONS ────────────────────────────────────────────────
    var T = {};

    var yearsExp = new Date().getFullYear() - (P.expStartYear || 2000);
    function injectYears(str) {
        return (str || '').replace(/\{years\}/g, yearsExp);
    }

    // NAV
    T['nav.title']    = { el: P.professionEl,  en: P.professionEn };
    T['nav.about']    = { el: 'Σχετικά',       en: 'About' };
    T['nav.services'] = { el: 'Υπηρεσίες',     en: 'Services' };
    T['nav.trust']    = { el: 'Αξιοπιστία',    en: 'Why Us' };
    T['nav.contact']  = { el: 'Επικοινωνία',   en: 'Contact' };

    // HERO
    T['hero.name1']   = { el: P.firstNameEl,   en: P.firstNameEn };
    T['hero.name2']   = { el: P.lastNameEl,    en: P.lastNameEn };
    T['hero.name3']   = { el: P.suffixEl || '', en: P.suffixEn || '' };
    T['hero.eyebrow'] = {
        el: P.universityEl ? P.professionEl + ' ' + P.universityEl : P.professionEl,
        en: P.universityEn ? P.professionEn + ' \u2014 ' + P.universityEn : P.professionEn,
    };
    T['hero.cta']     = { el: 'Επικοινωνία',   en: 'Get in Touch' };

    // MARQUEE
    (C.marquee || []).forEach(function (m, i) {
        T['marquee.m' + (i + 1)] = { el: m.el, en: m.en };
    });

    // ABOUT
    T['about.heading'] = { el: A.headingEl, en: A.headingEn };
    T['about.lead']    = { el: injectYears(A.leadEl), en: injectYears(A.leadEn) };
    T['about.dim']     = { el: P.locationEl, en: P.locationEn };

    (A.features || []).forEach(function (f, i) {
        var n = i + 1;
        T['feature.' + n + '.label'] = { el: f.labelEl, en: f.labelEn };
        T['feature.' + n + '.text']  = { el: f.textEl,  en: f.textEn };
    });

    // SERVICES
    T['services.eyebrow'] = { el: 'Τι προσφέρουμε', en: 'What we offer' };
    T['services.heading'] = { el: 'Οι <em>Υπηρεσίες</em> μας', en: 'Our <em>Services</em>' };

    // TRAILER ANNOUNCEMENT GUIDE
    T['ta.badge']       = { el: 'ΝΕΟΣ ΝΟΜΟΣ', en: 'NEW LAW' };
    T['ta.title']       = { el: 'ΤΡΕΪΛΕΡ — Οδηγός Νομιμοποίησης & Έκδοσης Άδειας Κυκλοφορίας', en: 'TRAILER — Legalization & Registration Guide' };
    T['ta.intro']       = {
        el: 'Στις <strong>23 Μαρτίου 2026</strong> ψηφίστηκε νόμος του Υπουργείου Υποδομών και Μεταφορών με αντικείμενο την <strong>κυκλοφορία οχημάτων κατηγορίας Ο1 και Ο2</strong> — δηλαδή ρυμουλκούμενων τρέιλερ. Ο νόμος ορίζει για πρώτη φορά σαφή διαδικασία νομιμοποίησης για τα αναρίθμητα ρυμουλκούμενα που κυκλοφορούν χωρίς άδεια στην Ελληνική επικράτεια. Η διαδικασία είναι πλέον ανοιχτή.',
        en: 'On <strong>23 March 2026</strong>, the Ministry of Infrastructure and Transport enacted a law governing the <strong>circulation of O1 and O2 category vehicles</strong> — i.e. towed trailers. For the first time, the law defines a clear legalization procedure for the many trailers circulating without registration in Greece. The process is now open.'
    };
    T['ta.col1.head']   = { el: 'Ποια οχήματα εντάσσονται', en: 'Eligible vehicles' };
    T['ta.elig1']       = { el: 'Ρυμουλκούμενα με <strong>Ειδικό Σημείωμα Ρυμούλκησης (Ε.Σ.Ρ.)</strong> ή <strong>Υπεύθυνη Δήλωση Μηχανολόγου</strong> με αποτύπωμα πινακιδίου χαρακτηριστικών.', en: 'Trailers with a <strong>Special Towing Note (E.S.R.)</strong> or a <strong>Mechanical Engineer\'s Declaration</strong> with a characteristic plate imprint.' };
    T['ta.elig2']       = { el: 'Ρυμουλκούμενα <strong>ειδικής χρήσης και ειδικού σκοπού</strong>, μη μεταφοράς εμπορευμάτων.', en: 'Trailers of <strong>special use and special purpose</strong>, not intended for goods transport.' };
    T['ta.elig3']       = { el: 'Δεν υπάρχει <strong>ημερομηνία λήξης</strong> της διαδικασίας προς το παρόν — η διαδικασία παραμένει ανοιχτή.', en: 'There is currently <strong>no expiry date</strong> for the process — the window remains open.' };
    T['ta.elig4']       = { el: 'Δεν μπορούν να εκδόσουν άδεια <strong>ρυμουλκούμενα χωρίς προηγούμενη άδεια κυκλοφορίας</strong> (ιδιοκατασκευές).', en: 'Trailers <strong>without a prior registration licence</strong> (home-built) are not eligible.' };
    T['ta.col2.head']   = { el: 'Κόστος & απαιτήσεις', en: 'Cost & requirements' };
    T['ta.proc1']       = { el: 'Παράβολα συνολικά <strong>230 €</strong>, εκδιδόμενα ηλεκτρονικά μέσω <strong>e-paravolo</strong>.', en: 'Total fees of <strong>€230</strong>, issued electronically via <strong>e-paravolo</strong>.' };
    T['ta.proc2']       = { el: 'Για οχήματα με ΕΣΡ πριν το <strong>1999</strong>: <strong>πρακτικό επιθεώρησης</strong> από αρμόδια Υπηρεσία Μεταφορών ή <strong>επιτυχής έλεγχος ΚΤΕΟ</strong>.', en: 'For vehicles with ESR before <strong>1999</strong>: an <strong>inspection report</strong> from the Regional Transport Authority or a <strong>successful KTEO technical check</strong>.' };
    T['ta.proc3']       = { el: 'Υποβολή πλήρους φακέλου <strong>δικαιολογητικών</strong> στην αρμόδια υπηρεσία, με σωστή καταγραφή χαρακτηριστικών οχήματος.', en: 'Submission of a complete <strong>documentation file</strong> to the competent authority, with accurate recording of vehicle characteristics.' };
    T['ta.expand.hint']      = { el: 'ΔΕΣ ΑΝΑΛΥΤΙΚΑ ΤΑ 5 ΣΤΑΔΙΑ ΤΗΣ ΔΙΑΔΙΚΑΣΙΑΣ', en: 'SEE ALL 5 STEPS OF THE PROCESS' };
    T['ta.stat.docs']        = { el: '10–15', en: '10–15' };
    T['ta.stat.docs.lbl']    = { el: 'Δικαιολογητικά', en: 'Documents' };
    T['ta.stat.fee.lbl']     = { el: 'Παράβολα', en: 'Fees' };
    T['ta.stat.days']        = { el: '3–10', en: '3–10' };
    T['ta.stat.days.lbl']    = { el: 'Ημέρες', en: 'Days' };
    T['ta.stat.process']     = { el: 'Βήμα-βήμα', en: 'Step-by-step' };
    T['ta.stat.process.lbl'] = { el: 'Διαδικασία', en: 'Process' };
    T['trc.badge.cat']       = { el: 'ΚΑΤΗΓΟΡΙΑ', en: 'CATEGORY' };
    T['ta.docs.head']   = { el: 'Απαιτούμενα δικαιολογητικά', en: 'Required documents' };
    T['ta.docs.a.head'] = { el: 'Α. Στοιχεία Ιδιοκτήτη', en: 'A. Owner details' };
    T['ta.docs.a1']     = { el: 'Φωτοαντίγραφο Αστυνομικής Ταυτότητας ή Διαβατηρίου', en: 'Copy of National ID or Passport' };
    T['ta.docs.a2']     = { el: 'Αριθμός Φορολογικού Μητρώου (ΑΦΜ)', en: 'Tax Registration Number (VAT/AFM)' };
    T['ta.docs.a3']     = { el: 'Στοιχεία επικοινωνίας (τηλέφωνο, e-mail)', en: 'Contact details (phone, e-mail)' };
    T['ta.docs.b.head'] = { el: 'Β. Στοιχεία Οχήματος', en: 'B. Vehicle details' };
    T['ta.docs.b4']     = { el: '<strong>Πρωτότυπο Σημείωμα Ρυμούλκησης / ΥΔ Μηχανολόγου</strong>', en: '<strong>Original Towing Note / Engineer\'s Declaration</strong>' };
    T['ta.docs.b5']     = { el: 'Τιμολόγιο αγοράς ή αποδεικτικό ιδιοκτησίας του τρέιλερ (αν υπάρχει)', en: 'Purchase invoice or proof of ownership (if available)' };
    T['ta.docs.b6']     = { el: 'Παλαιός αριθμός πλαισίου — φωτογραφία (αν υπάρχει) <strong>και αποτύπωμα αν είναι δυνατό</strong>', en: 'Old chassis number — photo (if available) <strong>and imprint if possible</strong>' };
    T['ta.docs.b7']     = { el: 'Φωτογραφία παλαιού ταμπελακιού (αν υπάρχει)', en: 'Photo of old manufacturer plate (if available)' };
    T['ta.docs.b8']     = { el: 'Φωτογραφίες όλων των πλευρών του ρυμουλκούμενου (ολόκληρο, κεντραρισμένο)', en: 'Photos of all sides of the trailer (full view, centred)' };
    T['ta.docs.b9']     = { el: 'Φωτογραφία σημείου ζεύξης', en: 'Photo of the coupling point' };
    T['ta.docs.b10']    = { el: 'Ζυγολόγιο (αν υπάρχει)', en: 'Weighbridge certificate (if available)' };
    T['ta.docs.b11']    = { el: 'Φωτογραφία άδειας κυκλοφορίας έλκοντος οχήματος', en: 'Photo of the towing vehicle\'s registration certificate' };
    T['ta.docs.c.head'] = { el: 'Γ. Έγγραφα', en: 'C. Documents' };
    T['ta.docs.c1']     = { el: 'Αίτηση με γνήσιο υπογραφής (ΚΕΠ ή gov)', en: 'Application with certified signature (KEP or gov.gr)' };
    T['ta.docs.c2']     = { el: 'Εξουσιοδότηση με γνήσιο υπογραφής (ΚΕΠ ή gov)', en: 'Power of attorney with certified signature (KEP or gov.gr)' };
    T['ta.docs.c3']     = { el: 'ΥΔ ιδιοκτησίας', en: 'Statutory declaration of ownership' };
    T['ta.docs.c4']     = { el: 'Παράβολο <strong>200 €</strong> μέσω e-paravolo, κωδ. <strong>15</strong> — στο ΑΦΜ του ιδιοκτήτη <em>(μπορεί να πληρωθεί αργότερα)</em>', en: '<strong>€200</strong> fee via e-paravolo, code <strong>15</strong> — under the owner\'s AFM <em>(can be paid later)</em>' };
    T['ta.docs.c5']     = { el: 'Παράβολο <strong>30 €</strong> μέσω e-paravolo, κωδ. <strong>2992</strong> — στο ΑΦΜ του ιδιοκτήτη <em>(μπορεί να πληρωθεί αργότερα)</em>', en: '<strong>€30</strong> fee via e-paravolo, code <strong>2992</strong> — under the owner\'s AFM <em>(can be paid later)</em>' };
    T['ta.warn.title']  = { el: 'Προσοχή — Απαγόρευση κυκλοφορίας', en: 'Caution — Circulation Prohibited' };
    T['ta.warn.text']   = { el: 'Έως την έκδοση της άδειας κυκλοφορίας και των πινακίδων, <strong>απαγορεύεται ρητά η κυκλοφορία</strong> των παραπάνω οχημάτων. Σε ενδεχόμενο ελέγχου, αντιμετωπίζονται ως οχήματα <strong>χωρίς στοιχεία κυκλοφορίας και ανασφάλιστα</strong>, με ό,τι αυτό συνεπάγεται νομικά και οικονομικά.', en: 'Until the registration and plates are issued, <strong>circulation of these vehicles is strictly prohibited</strong>. If stopped during a check, they are treated as <strong>unregistered and uninsured</strong>, with all the legal and financial consequences that entails.' };
    T['ta.svc.head']    = { el: 'Τι αναλαμβάνει το γραφείο μας', en: 'What our office handles' };
    T['ta.svc1']        = { el: '<strong>Επιθεώρηση & καταγραφή</strong> — Ελέγχουμε το ρυμουλκούμενο και καταγράφουμε με ακρίβεια όλα τα χαρακτηριστικά του, ώστε η νέα άδεια κυκλοφορίας να εκδοθεί σωστά.', en: '<strong>Inspection & recording</strong> — We inspect the trailer and accurately record all its characteristics, ensuring the new registration is issued correctly.' };
    T['ta.svc2']        = { el: '<strong>Αποτύπωση & πινακίδιο</strong> — Αποτυπώνουμε τον νέο <strong>17ψήφιο αριθμό πλαισίου (VIN)</strong> και τοποθετούμε το πινακίδιο χαρακτηριστικών.', en: '<strong>VIN & plate</strong> — We stamp the new <strong>17-digit chassis number (VIN)</strong> and fit the characteristic plate.' };
    T['ta.svc3']        = { el: '<strong>Πλήρης μελέτη</strong> — Συντάσσουμε την τεχνική περιγραφή που περιλαμβάνει φωτογραφίες, αποτύπωμα αριθμού πλαισίου και όλα τα απαραίτητα έγγραφα.', en: '<strong>Full technical study</strong> — We prepare the technical description including photographs, chassis number imprint, and all required documents.' };
    T['ta.svc4']        = { el: '<strong>Υποβολή φακέλου</strong> — Ετοιμάζουμε και υποβάλλουμε τον πλήρη φάκελο στην αρμόδια υπηρεσία. Το μόνο που χρειάζεται να κάνετε είναι να μας <strong>τηλεφωνήσετε</strong>.', en: '<strong>File submission</strong> — We prepare and submit the complete file to the competent authority. All you need to do is <strong>call us</strong>.' };
    T['ta.cta.text']    = { el: 'Επικοινωνήστε μαζί μας σήμερα για δωρεάν ενημέρωση σχετικά με τη νομιμοποίηση του τρέιλερ ή της μπαγκαζιέρας σας.', en: 'Contact us today for a free consultation on legalizing your trailer or cargo box.' };
    T['ta.cta.btn']     = { el: 'Επικοινωνία', en: 'Get in Touch' };
    (C.services || []).forEach(function (s, i) {
        var n = i + 1;
        T['s' + n + '.title'] = { el: s.titleEl, en: s.titleEn };
        T['s' + n + '.text']  = { el: s.textEl,  en: s.textEn };
    });

    // PROJECTS
    T['projects.eyebrow'] = { el: 'Το χαρτοφυλάκιό μας', en: 'Our Portfolio' };
    T['projects.heading'] = { el: 'Επιλεγμένα <em>Έργα</em>', en: 'Selected <em>Projects</em>' };
    (C.projects || []).forEach(function (p, i) {
        var n = i + 1;
        T['p' + n + '.cat']   = { el: p.catEl,   en: p.catEn };
        T['p' + n + '.title'] = { el: p.titleEl,  en: p.titleEn };
        T['p' + n + '.desc']  = { el: p.descEl,   en: p.descEn };
    });

    // CONTACT
    T['contact.eyebrow'] = { el: 'Επικοινωνία', en: 'Contact' };
    T['contact.heading'] = { el: 'Μιλήστε <em>μαζί μας</em>', en: 'Let\'s <em>talk</em>' };
    T['contact.lead']    = {
        el: 'Είμαστε εδώ για κάθε ερώτηση ή ανάγκη. Επικοινωνήστε μαζί μας σήμερα για δωρεάν αρχική ενημέρωση.',
        en: 'We\'re here for any question or need. Get in touch today for a free initial consultation.',
    };
    T['contact.role'] = { el: P.fullTitleEl, en: P.fullTitleEn };
    T['contact.area']    = { el: P.areaEl,               en: P.areaEn };
    T['contact.fax']     = { el: C.contact.fax || '',    en: C.contact.fax || '' };
    T['contact.address'] = { el: C.contact.address || '', en: C.contact.addressEn || '' };

    // FORM
    T['form.title']          = { el: 'Στείλτε μήνυμα',                      en: 'Send a Message' };
    T['form.label.name']     = { el: 'Ονοματεπώνυμο',                       en: 'Full Name' };
    T['form.ph.name']        = { el: '',                                    en: '' };
    T['form.label.phone']    = { el: 'Τηλέφωνο',                            en: 'Phone' };
    T['form.label.email']    = { el: 'Email',                                en: 'Email' };
    T['form.ph.email']       = { el: '',                                    en: '' };
    T['form.label.subject']  = { el: 'Αντικείμενο',                         en: 'Subject' };
    T['form.select.default'] = { el: 'Επιλέξτε υπηρεσία',                   en: 'Select a service' };
    T['form.label.message']  = { el: 'Μήνυμα',                              en: 'Message' };
    T['form.ph.message']     = { el: '',                                    en: '' };
    T['form.submit']         = { el: 'Αποστολή Μηνύματος',                  en: 'Send Message' };
    (C.formOptions || []).forEach(function (o, i) {
        T['form.opt.' + (i + 1)] = { el: o.el, en: o.en };
    });

    // TRUST
    var TR = C.trust || {};
    T['trust.eyebrow'] = { el: TR.eyebrowEl || '', en: TR.eyebrowEn || '' };
    T['trust.heading'] = { el: TR.headingEl || '', en: TR.headingEn || '' };
    (TR.stats || []).forEach(function (s, i) {
        var n = i + 1;
        T['trust.stat' + n + '.num']   = { el: injectYears(s.numEl),   en: injectYears(s.numEn) };
        T['trust.stat' + n + '.label'] = { el: s.labelEl, en: s.labelEn };
    });
    (TR.pillars || []).forEach(function (p, i) {
        var n = i + 1;
        T['trust.p' + n + '.title'] = { el: p.titleEl, en: p.titleEn };
        T['trust.p' + n + '.text']  = { el: p.textEl,  en: p.textEn };
    });

    // ARTICLES
    (C.articles || []).forEach(function (a, i) {
        var n = i + 1;
        T['art' + n + '.cat']   = { el: a.catEl,   en: a.catEn };
        T['art' + n + '.title'] = { el: a.titleEl, en: a.titleEn };
        T['art' + n + '.text']  = { el: a.textEl,  en: a.textEn };
    });

    // REVIEWS
    T['reviews.eyebrow'] = { el: 'Κριτικές Πελατών', en: 'Client Reviews' };
    T['reviews.heading'] = { el: 'Τι λένε <em>οι πελάτες</em> μας', en: 'What <em>our clients</em> say' };
    T['reviews.source']  = { el: 'Αξιολόγηση από Google', en: 'Review from Google' };
    (C.reviews || []).forEach(function (r, i) {
        var n = i + 1;
        T['review' + n + '.text'] = { el: r.textEl, en: r.textEn };
    });

    // FOOTER
    T['footer.title'] = { el: P.fullTitleEl, en: P.fullTitleEn };

    // ARIA LABELS
    T['aria.menu']      = { el: 'Μενού πλοήγησης',       en: 'Navigation menu' };
    T['aria.backToTop'] = { el: 'Επιστροφή στην κορυφή', en: 'Back to top' };

    // TRC WIDGET BADGE
    T['trc.badge'] = { el: 'Έλεγχος Κ.Ο.Κ.', en: 'Road Code Check' };

    // HERO BOTTOM CONTACT STRIP
    T['hbc.phone']        = { el: 'Σταθερό',      en: 'Landline' };
    T['hbc.mobile']       = { el: 'Κινητό',       en: 'Mobile' };
    T['hbc.service']      = { el: 'Εξυπηρέτηση', en: 'Service area' };
    T['contact.phone.val']  = { el: C.contact.phone,   en: C.contact.phoneEn  || C.contact.phone };
    T['contact.mobile.val'] = { el: C.contact.mobile,  en: C.contact.mobileEn || C.contact.mobile };

    // MEASURE LABELS
    T['services.meas'] = { el: 'ΥΠΗΡΕΣΙΕΣ', en: 'SERVICES' };
    T['projects.meas'] = { el: 'ΕΡΓΑ',       en: 'PROJECTS' };

    // SERVICE BADGE (featured card)
    T['service.badge.new'] = { el: 'ΝΕΑ', en: 'NEW' };

    // SERVICE INLINE EXPAND (cards 0 & 1)
    T['svc.expand.0.p1'] = {
        el: 'Κάθε τρέιλερ υποχρεούται από τον ΚΟΚ να διαθέτει <strong>άδεια κυκλοφορίας</strong> και πινακίδες. <strong>Ο1</strong>: έως 750 kg (μπαγκαζιέρα, σκάφη, camping, μοτοσυκλέτα) — <strong>Ο2</strong>: έως 3.500 kg (caravan, αυτοκινήτου, βαριά βιομηχανικά). Αναλαμβάνουμε πλήρως: <strong>έγκριση τύπου ρυμουλκούμενου</strong>, τεχνική μελέτη, υποβολή ΥΜΕΔ/ΚΤΕΟ, έκδοση άδειας.',
        en: 'Every trailer is required by Road Code to have a <strong>registration licence</strong> and plates. <strong>O1</strong>: up to 750 kg (cargo trailer, boats, camping, motorcycle) — <strong>O2</strong>: up to 3,500 kg (caravan, car, heavy industrial). We handle everything: <strong>trailer type approval</strong>, technical study, submission to YMED/KTEO, licence issuance.',
    };
    T['svc.expand.0.meta'] = {
        el: 'Αθήνα &amp; Θεσσαλονίκη &nbsp;·&nbsp; ΑΠΘ, MSc &nbsp;·&nbsp; Κατηγορίες Ο1 &amp; Ο2',
        en: 'Athens &amp; Thessaloniki &nbsp;·&nbsp; AUTH, MSc &nbsp;·&nbsp; Categories O1 &amp; O2',
    };
    T['svc.expand.1.p1'] = {
        el: 'Τα οχήματα ειδικής χρήσης — γερανοφόρα, πλατφόρμες, ψεκαστικά — χρειάζονται ειδική <strong>ταξινόμηση</strong> και <strong>έγκριση τύπου οχήματος</strong>. Αναλαμβάνουμε επίσης <strong>έγκριση τύπου ρυμουλκούμενου</strong> για τρέιλερ εκτός σειράς παραγωγής. Εκπονούμε τεχνικές μελέτες (στατική ανάλυση, CE, EN 1570) και αναλαμβάνουμε τη διαδικασία από την αρχή έως το τέλος.',
        en: 'Special use vehicles — crane trucks, platforms, sprayers — require special <strong>registration</strong> and <strong>vehicle type approval</strong>. We also handle <strong>trailer type approval</strong> for custom-built trailers. We prepare technical studies (static analysis, CE, EN 1570) and handle the entire process from start to finish.',
    };
    T['svc.expand.1.meta'] = {
        el: 'Γερανοφόρα &nbsp;·&nbsp; Πλατφόρμες &nbsp;·&nbsp; Ψεκαστικά &nbsp;·&nbsp; Αθήνα &amp; Θεσσαλονίκη',
        en: 'Crane trucks &nbsp;·&nbsp; Platforms &nbsp;·&nbsp; Sprayers &nbsp;·&nbsp; Athens &amp; Thessaloniki',
    };

    // NAV BRAND (for language switch)
    if (P.navBrandEl) {
        T['nav.brand'] = { el: P.navBrandEl, en: P.navBrandEn || P.navBrandEl };
    }

    // FOOTER BRAND (for language switch)
    T['footer.brand']   = { el: P.displayNameEl, en: P.displayNameEn || P.displayNameEl };
    T['contact.person'] = { el: P.displayNameEl, en: P.displayNameEn || P.displayNameEl };

    C.translations = T;


    // ── 2. CSS THEME VARIABLES ───────────────────────────────────────────────
    if (C.theme && C.theme.accent) {
        var themeStyle = document.createElement('style');
        themeStyle.textContent =
            ':root { --gold: ' + C.theme.accent + '; --gold2: ' + (C.theme.accentLight || C.theme.accent) + '; }';
        document.head.appendChild(themeStyle);
    }


    // ── 3. META TAGS ─────────────────────────────────────────────────────────
    var savedLang = C.meta.lang || 'el';
    var langKey   = savedLang === 'en' ? 'En' : 'El';

    document.title = C.meta['title' + langKey] || C.meta.titleEl || '';
    var descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) descMeta.content = C.meta['description' + langKey] || C.meta.descriptionEl || '';

    document.documentElement.lang = savedLang;


    // ── 4. ASSETS ─────────────────────────────────────────────────────────────
    var accentColor = (C.theme && C.theme.accent) ? C.theme.accent : '#c9a86c';
    var fallbackInitials =
        '<div style="width:100%;height:100%;background:linear-gradient(135deg,#1a1410,#2d2010);' +
        'display:flex;align-items:center;justify-content:center;font-family:serif;' +
        'font-size:18px;font-weight:700;color:' + accentColor + '">' + P.initials + '</div>';

    document.querySelectorAll('.logo-img').forEach(function (img) {
        img.src = C.assets.logo;
        img.alt = P.displayNameEl + ' Logo';
        img.onerror = function () { this.parentElement.innerHTML = fallbackInitials; };
    });

    var heroPhoto = document.getElementById('heroPhoto');
    if (heroPhoto) {
        heroPhoto.src = C.assets.photo;
        heroPhoto.alt = P.displayNameEl;
        heroPhoto.onerror = function () {
            this.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600&h=800';
        };
    }

    var slides = document.querySelectorAll('.hero-slide');
    (C.assets.heroSlides || []).forEach(function (src, i) {
        if (slides[i]) slides[i].style.backgroundImage = "url('" + src + "')";
    });

    var personPhoto = document.getElementById('personPhoto');
    if (personPhoto) {
        personPhoto.src = C.assets.contactPhoto || C.assets.photo;
        personPhoto.alt = P.displayNameEl;
        personPhoto.onerror = function () {
            this.src = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
        };
    }


    // ── 4b. HERO BOTTOM CONTACT STRIP ────────────────────────────────────────
    var heroBottomContact = document.getElementById('heroBottomContact');
    if (heroBottomContact) {
        heroBottomContact.innerHTML =
            '<a href="' + C.contact.phoneTel + '" class="hbc-item">' +
                '<span class="hbc-icon"><i class="fa-solid fa-phone"></i></span>' +
                '<span class="hbc-text"><span class="hbc-label" data-i18n="hbc.phone">' + T['hbc.phone'].el + '</span><span class="hbc-val" data-i18n="contact.phone.val">' + C.contact.phone + '</span></span>' +
            '</a>' +
            '<a href="' + C.contact.mobileTel + '" class="hbc-item">' +
                '<span class="hbc-icon"><i class="fa-solid fa-mobile-screen-button"></i></span>' +
                '<span class="hbc-text"><span class="hbc-label" data-i18n="hbc.mobile">' + T['hbc.mobile'].el + '</span><span class="hbc-val" data-i18n="contact.mobile.val">' + C.contact.mobile + '</span></span>' +
            '</a>' +
            '<span class="hbc-item hbc-address">' +
                '<span class="hbc-icon"><i class="fa-solid fa-location-dot"></i></span>' +
                '<span class="hbc-text"><span class="hbc-label" data-i18n="hbc.service">' + T['hbc.service'].el + '</span><span class="hbc-val" data-i18n="contact.address">' + (C.contact.address || '') + '</span></span>' +
            '</span>' +
            '<a href="mailto:' + C.contact.email + '" class="hbc-item">' +
                '<span class="hbc-icon"><i class="fa-solid fa-envelope"></i></span>' +
                '<span class="hbc-text"><span class="hbc-label">Email</span><span class="hbc-val">' + C.contact.email + '</span></span>' +
            '</a>';
    }

    // ── 5. NAMES ──────────────────────────────────────────────────────────────
    // navBrandName and footerBrandName are handled by data-i18n via applyLang

    // personName is handled by data-i18n="contact.person" via applyLang

    // footerBrandName is handled by data-i18n="footer.brand" via applyLang

    // Hero crosshair university label — hide if not set
    var chLabel = document.querySelector('.ch-label');
    if (chLabel) {
        chLabel.textContent = P.universityEl || '';
        if (!P.universityEl) chLabel.style.display = 'none';
    }


    // ── 6. CONTACT LINKS ──────────────────────────────────────────────────────
    document.querySelectorAll('.contact-phone').forEach(function (el) {
        el.href = C.contact.phoneTel;
        var val = el.querySelector('.cd-value') || el.querySelector('span');
        if (val) val.textContent = C.contact.phone;
    });

    document.querySelectorAll('.contact-mobile').forEach(function (el) {
        el.href = C.contact.mobileTel;
        var val = el.querySelector('.cd-value') || el.querySelector('span');
        if (val) val.textContent = C.contact.mobile;
    });

    document.querySelectorAll('.contact-email').forEach(function (el) {
        el.href = 'mailto:' + C.contact.email;
        var val = el.querySelector('.cd-value') || el.querySelector('span');
        if (val) val.textContent = C.contact.email;
    });

    var footerEmail = document.getElementById('footerEmail');
    if (footerEmail) footerEmail.href = 'mailto:' + C.contact.email;

    var footerPhone = document.getElementById('footerPhone');
    if (footerPhone) footerPhone.href = C.contact.phoneTel;

    var footerFacebook = document.getElementById('footerFacebook');
    if (footerFacebook && C.contact.facebook) footerFacebook.href = C.contact.facebook;

    var contactFacebook = document.getElementById('contactFacebook');
    if (contactFacebook && C.contact.facebook) contactFacebook.href = C.contact.facebook;


    // ── 7. MEASUREMENT LABELS (auto-generated from array lengths) ─────────────

    var servicesMeas = document.getElementById('servicesMeasLabel');
    if (servicesMeas) {
        var sCount = (C.services || []).length;
        servicesMeas.innerHTML =
            sCount + ' <span data-i18n="services.meas">' + T['services.meas'].el + '</span>' +
            ' \u2014 ' + (sCount * 40).toFixed(2) + ' m\u00B2';
    }

    var projectsMeas = document.getElementById('projectsMeasLabel');
    if (projectsMeas) {
        var pCount = (C.projects || []).length;
        projectsMeas.innerHTML =
            pCount + ' <span data-i18n="projects.meas">' + T['projects.meas'].el + '</span>' +
            ' \u2014 ' + (pCount * 208).toFixed(2) + ' m\u00B2';
    }


    // ── 8. RENDER MARQUEE ─────────────────────────────────────────────────────
    var marqueeTrack = document.getElementById('marqueeTrack');
    if (marqueeTrack) {
        var mHtml = '';
        // Render twice for seamless CSS infinite loop
        [0, 1].forEach(function () {
            (C.marquee || []).forEach(function (m, i) {
                mHtml +=
                    '<div class="marquee-item">' +
                    '<span class="marquee-dot"></span>' +
                    '<span data-i18n="marquee.m' + (i + 1) + '">' + m.el + '</span>' +
                    '</div>';
            });
        });
        marqueeTrack.innerHTML = mHtml;
    }


    // ── 9. RENDER ABOUT FEATURES ──────────────────────────────────────────────
    var aboutFeatures = document.getElementById('aboutFeatures');
    if (aboutFeatures) {
        var fHtml = '';
        (A.features || []).forEach(function (f, i) {
            var n = i + 1;
            fHtml +=
                '<div class="feature-row" data-reveal>' +
                '<div class="feature-row-header">' +
                '<i class="fa-solid ' + f.icon + '"></i>' +
                '<strong data-i18n-html="feature.' + n + '.label">' + f.labelEl + '</strong>' +
                '</div>' +
                '<span data-i18n-html="feature.' + n + '.text">' + f.textEl + '</span>' +
                '</div>';
        });
        aboutFeatures.innerHTML = fHtml;
    }


    // ── 10. RENDER SERVICES GRID ──────────────────────────────────────────────
    var servicesGrid = document.getElementById('servicesGrid');
    if (servicesGrid) {
        var sHtml = '';
        (C.services || []).forEach(function (s, i) {
            var n   = i + 1;
            var pad = n < 10 ? '0' + n : '' + n;
            // First card (O1/O2) gets featured class for attention animation
            var featuredClass = (i === 0) ? ' service-card--featured' : '';
            var featuredBadge = (i === 0) ?
                '<span class="service-badge" data-i18n="service.badge.new">' + T['service.badge.new'].el + '</span>' : '';
            // Odd-index (0,2,4,6) = left column, even-index (1,3,5,7) = right column
            var colClass = (i % 2 === 0) ? ' service-card--odd' : ' service-card--even';
            // Cards with a url become anchor elements
            var tag    = s.url ? 'a' : 'div';
            var urlAttr = s.url
                ? ' href="' + s.url + '" target="_blank" rel="noopener noreferrer"'
                : '';
            var kwMeta = s.seoKeywords
                ? '<meta itemprop="keywords" content="' + s.seoKeywords + '">'
                : '';
            // Extra expand content for cards 0 and 1 (goes inside their expand panel)
            var extraExpand = '';
            if (i === 0) {
                extraExpand =
                    '<p data-i18n-html="svc.expand.0.p1">' + T['svc.expand.0.p1'].el + '</p>' +
                    '<p class="svc-inline-meta" data-i18n-html="svc.expand.0.meta">' + T['svc.expand.0.meta'].el + '</p>';
            } else if (i === 1) {
                extraExpand =
                    '<p data-i18n-html="svc.expand.1.p1">' + T['svc.expand.1.p1'].el + '</p>' +
                    '<p class="svc-inline-meta" data-i18n-html="svc.expand.1.meta">' + T['svc.expand.1.meta'].el + '</p>';
            }
            // All cards are expandable; description moves into the expand panel
            var expandContent =
                '<div class="svc-inline-expand">' +
                '<div class="svc-inline-expand-inner">' +
                '<p itemprop="description" data-i18n-html="s' + n + '.text">' + s.textEl + '</p>' +
                extraExpand +
                '</div>' +
                '</div>';
            sHtml +=
                '<' + tag + urlAttr + ' class="service-card' + featuredClass + colClass + ' service-card--expandable" data-reveal' +
                ' itemscope itemtype="https://schema.org/Service" itemprop="itemListElement">' +
                '<meta itemprop="position" content="' + n + '">' +
                kwMeta +
                '<div class="service-num" aria-hidden="true">' + pad + '</div>' +
                '<i class="fa-solid ' + s.icon + ' service-icon" aria-hidden="true"></i>' +
                '<div class="service-card-body">' +
                '<h3 itemprop="name" data-i18n-html="s' + n + '.title">' + s.titleEl + '</h3>' +
                featuredBadge +
                '</div>' +
                expandContent +
                '</' + tag + '>';
        });
        servicesGrid.innerHTML = sHtml;

        // Wire expand panels — collapsed by default on all screen sizes
        servicesGrid.querySelectorAll('.service-card--expandable').forEach(function (card) {
            card.setAttribute('aria-expanded', 'false');
            card.addEventListener('click', function () {
                var panel = card.querySelector('.svc-inline-expand');
                if (!panel) return;
                var open = panel.classList.toggle('is-open');
                card.setAttribute('aria-expanded', String(open));
            });
        });

        // Start featured-card animation when it scrolls into view
        var fc = servicesGrid.querySelector('.service-card--featured');
        if (fc) {
            var fcObs = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        fcObs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0 });
            fcObs.observe(fc);
        }
    }


    // ── 11. RENDER PROJECTS GRID ──────────────────────────────────────────────
    var projectsGrid = document.getElementById('projectsGrid');
    if (projectsGrid) {
        var pHtml = '';
        (C.projects || []).forEach(function (p, i) {
            var n = i + 1;
            pHtml +=
                '<div class="project-card" data-reveal>' +
                '<img src="' + p.image + '" alt="" ' +
                'onerror="this.src=\'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&q=80&w=800\'">' +
                '<div class="project-card-overlay"></div>' +
                '<div class="project-card-info">' +
                '<div class="project-cat" data-i18n="p' + n + '.cat">'  + p.catEl   + '</div>' +
                '<h3 data-i18n="p' + n + '.title">'                     + p.titleEl + '</h3>' +
                '<p data-i18n="p' + n + '.desc">'                       + p.descEl  + '</p>' +
                '</div>' +
                '</div>';
        });
        projectsGrid.innerHTML = pHtml;
    }


    // ── 12. RENDER TRUST STATS ────────────────────────────────────────────────
    var trustStats = document.getElementById('trustStats');
    if (trustStats && TR.stats) {
        var tsHtml = '';
        (TR.stats || []).forEach(function (s, i) {
            var n = i + 1;
            tsHtml +=
                '<div class="trust-stat" data-reveal itemscope itemtype="https://schema.org/QuantitativeValue">' +
                '<span class="trust-stat-num" data-i18n="trust.stat' + n + '.num" itemprop="value">' + s.numEl + '</span>' +
                '<span class="trust-stat-label" data-i18n="trust.stat' + n + '.label" itemprop="unitText">' + s.labelEl + '</span>' +
                '</div>';
        });
        trustStats.innerHTML = tsHtml;
    }

    // ── 13. RENDER TRUST PILLARS ──────────────────────────────────────────────
    var trustPillars = document.getElementById('trustPillars');
    if (trustPillars && TR.pillars) {
        var tpHtml = '';
        (TR.pillars || []).forEach(function (p, i) {
            var n = i + 1;
            tpHtml +=
                '<div class="trust-pillar" data-reveal itemscope itemtype="https://schema.org/Thing">' +
                '<div class="trust-pillar-icon" aria-hidden="true"><i class="fa-solid ' + p.icon + '"></i></div>' +
                '<h3 itemprop="name" data-i18n-html="trust.p' + n + '.title">' + p.titleEl + '</h3>' +
                '<p itemprop="description" data-i18n-html="trust.p' + n + '.text">'   + p.textEl  + '</p>' +
                '</div>';
        });
        trustPillars.innerHTML = tpHtml;
    }

    // ── 14. RENDER ARTICLES TICKER ────────────────────────────────────────────
    var articlesTrack = document.getElementById('articlesTrack');
    if (articlesTrack && C.articles) {
        var aHtml = '';
        // Render twice for seamless infinite loop
        [0, 1].forEach(function () {
            (C.articles || []).forEach(function (a, i) {
                var n = i + 1;
                aHtml +=
                    '<a class="article-card" href="' + (a.url || '#') + '" target="_blank" rel="noopener noreferrer"' +
                    ' onclick="window.ccEvent&&ccEvent(\'article_click\',{article_title:\'' + a.titleEn.replace(/'/g, '') + '\',article_category:\'' + a.catEn.replace(/'/g, '') + '\'})"' +
                    '<span class="article-cat" data-i18n="art' + n + '.cat">' + a.catEl + '</span>' +
                    '<h4 data-i18n-html="art' + n + '.title">' + a.titleEl + '</h4>' +
                    '<p data-i18n-html="art' + n + '.text">'   + a.textEl  + '</p>' +
                    '</a>';
            });
        });
        articlesTrack.innerHTML = aHtml;
    }

    // ── 14b. RENDER GOOGLE REVIEWS CAROUSEL ──────────────────────────────────
    var reviewsTrack = document.getElementById('reviewsTrack');
    if (reviewsTrack && C.reviews) {
        var starsHtml = '<span class="review-stars" aria-hidden="true">' +
            '<i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>' +
            '<i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>' +
            '<i class="fa-solid fa-star"></i></span>';
        var googleIconHtml =
            '<svg class="review-google-icon" viewBox="0 0 48 48" width="18" height="18" aria-hidden="true">' +
            '<path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>' +
            '<path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>' +
            '<path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"/>' +
            '<path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/>' +
            '</svg>';
        var rHtml = '';
        // Render twice for seamless infinite loop
        [0, 1].forEach(function () {
            (C.reviews || []).forEach(function (r, i) {
                var n = i + 1;
                var initial = (r.name || '?').trim().charAt(0).toUpperCase();
                rHtml +=
                    '<div class="review-card">' +
                    '<div class="review-head">' +
                    '<div class="review-avatar" aria-hidden="true">' + initial + '</div>' +
                    '<div class="review-head-text">' +
                    '<h4>' + r.name + '</h4>' +
                    '<span class="review-source" data-i18n="reviews.source"></span>' +
                    '</div>' +
                    googleIconHtml +
                    '</div>' +
                    starsHtml +
                    '<p data-i18n="review' + n + '.text">' + r.textEl + '</p>' +
                    '</div>';
            });
        });
        reviewsTrack.innerHTML = rHtml;
    }

    // ── 15. RENDER FORM DROPDOWN ──────────────────────────────────────────────
    var serviceSelect = document.getElementById('serviceSelect');
    if (serviceSelect) {
        var optHtml = '<option value="" disabled selected data-i18n="form.select.default">Επιλέξτε υπηρεσία</option>';
        (C.formOptions || []).forEach(function (o, i) {
            optHtml += '<option value="' + (i + 1) + '" data-i18n="form.opt.' + (i + 1) + '">' + o.el + '</option>';
        });
        serviceSelect.innerHTML = optHtml;
    }

    // ── ADD phone placeholder translation ─────────────────────────────────────
    T['form.ph.phone'] = { el: '', en: '' };

    // No re-apply needed: i18n.js runs after this script and sees the fully-rendered DOM.

})();
