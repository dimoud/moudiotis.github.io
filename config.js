/**
 * config.js — Site Configuration
 * ════════════════════════════════════════════════════════════════════════════
 * THIS IS THE ONLY FILE YOU NEED TO EDIT FOR EACH CLIENT.
 *
 * EDITING RULES:
 *   1. Use &amp;  instead of  &   in any HTML strings
 *   2. Use &mdash; instead of  —   in any HTML strings
 *   3. Use {years} in about.leadEl/En for auto-calculated years of experience
 *   4. Keep commas after every item in arrays and objects
 *   5. Icons: find at fontawesome.com/icons (use the class name, e.g. 'fa-car')
 * ════════════════════════════════════════════════════════════════════════════
 */

/* LOAD ORDER CRITICAL — no defer, no async. Must load before site-init.js */

window.SITE_CONFIG = {

    // ── META ──────────────────────────────────────────────────────────────
    meta: {
        titleEl:       'Τεχνικό Γραφείο Γκούβελης | Μηχανολόγος Μηχανικός Θεσσαλονίκη',
        titleEn:       'Gkouvelis Technical Office | Mechanical Engineer Thessaloniki',
        descriptionEl: 'Τεχνικό γραφείο Δημήτριος Γκούβελης & Συνεργάτες — Μελέτες οχημάτων, εγκρίσεις τύπου, άδειες τρέιλερ, οχήματα ειδικής χρήσης, Πολίχνη Θεσσαλονίκης.',
        descriptionEn: 'Gkouvelis Technical Office & Associates — Vehicle studies, type approvals, trailer permits, special use vehicles, Polichni Thessaloniki.',
        lang:          'el',
    },

    // ── PROFILE ───────────────────────────────────────────────────────────
    profile: {
        firstNameEl:   'ΤΕΧΝΙΚΟ ΓΡΑΦΕΙΟ',
        firstNameEn:   'TECHNICAL OFFICE',
        lastNameEl:    'ΔΗΜΗΤΡΙΟΣ ΓΚΟΥΒΕΛΗΣ',
        lastNameEn:    'DIMITRIOS GKOUVELIS',
        suffixEl:      '& ΣΥΝΕΡΓΑΤΕΣ',
        suffixEn:      '& Associates',
        initials:      'ΔΓ',
        navBrandEl:    'ΤΕΧΝΙΚΟ ΓΡΑΦΕΙΟ ΓΚΟΥΒΕΛΗΣ',
        navBrandEn:    'GKOUVELIS TECHNICAL OFFICE',
        displayNameEl: 'Δημήτριος Γκούβελης & Συνεργάτες',
        displayNameEn: 'Dimitrios Gkouvelis & Associates',
        professionEl:  'Μηχανολόγος Μηχανικός',
        professionEn:  'Mechanical Engineer',
        fullTitleEl:   'Μηχανολόγος Μηχανικός — Πολίχνη Θεσσαλονίκης',
        fullTitleEn:   'Mechanical Engineer — Polichni Thessaloniki',
        universityEl:  '',
        universityEn:  '',
        locationEl:    'Πολίχνη — Θεσσαλονίκη',
        locationEn:    'Polichni — Thessaloniki',
        areaEl:        'Λεωφ. Στρατού 1, Πολίχνη 564 29, Θεσσαλονίκη',
        areaEn:        'Stratou Ave. 1, Polichni 564 29, Thessaloniki',
        expStartYear:  1985,
    },

    // ── ASSETS ────────────────────────────────────────────────────────────
    assets: {
        logo:       'logo.png',
        photo:      'photo.jpeg',
        heroSlides: [],   /* no background slides — clean typographic hero */
    },

    // ── CONTACT ───────────────────────────────────────────────────────────
    contact: {
        phone:     '2310 603 372',                  // landline
        phoneTel:  'tel:2310603372',
        mobile:    '694 523 2612',
        mobileTel: 'tel:6945232612',
        fax:       '2310 608 017',
        email:     'sasma1977@gmail.com',
        address:   'Λεωφ. Στρατού 1, Πολίχνη 564 29, Θεσσαλονίκη',
        addressEn: 'Stratou Ave. 1, Polichni 564 29, Thessaloniki',
        facebook:  'https://www.facebook.com/people/%CE%A4%CE%B5%CF%87%CE%BD%CE%B9%CE%BA%CF%8C-%CE%93%CF%81%CE%B1%CF%86%CE%B5%CE%AF%CE%BF-%CE%9F%CF%87%CE%B7%CE%BC%CE%AC%CF%84%CF%89%CE%BD-%CE%94%CE%B7%CE%BC%CE%AE%CF%84%CF%81%CE%B9%CE%BF%CF%82-%CE%93%CE%BA%CE%BF%CF%85%CE%B2%CE%AD%CE%BB%CE%B7%CF%82/100057023967259/',
        mapsUrl:   'https://maps.google.com/maps?q=40.671426233509,22.93926462035&hl=el&z=16&output=embed',
    },

    // ── THEME ─────────────────────────────────────────────────────────────
    theme: {
        accent:      '#1d3a5c',
        accentLight: '#2e5f8a',
    },

    // ── MARQUEE ───────────────────────────────────────────────────────────
    marquee: [
        { el: 'Μελέτες Οχημάτων',              en: 'Vehicle Studies' },
        { el: 'Εγκρίσεις Τύπου',               en: 'Type Approvals' },
        { el: 'Άδειες Τρέιλερ',                en: 'Trailer Permits' },
        { el: 'Οχήματα Ειδικής Χρήσης',        en: 'Special Use Vehicles' },
        { el: 'Μελέτη Τοποθέτησης Γερανού',    en: 'Crane Installation Study' },
        { el: 'Υδραυλική Πλατφόρμα',           en: 'Hydraulic Platform' },
    ],

    // ── ABOUT ─────────────────────────────────────────────────────────────
    about: {
        headingEl: 'Εμπειρία &amp; <em>Εξειδίκευση</em>',
        headingEn: 'Experience &amp; <em>Expertise</em>',
        leadEl:    'Με {years}+ χρόνια εμπειρίας, το τεχνικό γραφείο μας αποτελεί σημείο αναφοράς στον τομέα των μελετών οχημάτων, εγκρίσεων τύπου και αδειοδότησης ειδικών οχημάτων &amp; μηχανημάτων. Εξυπηρετούμε ιδιώτες και επαγγελματίες σε Θεσσαλονίκη και Βόρεια Ελλάδα.',
        leadEn:    'With {years}+ years of experience, our technical office is a point of reference in vehicle studies, type approvals and licensing of special vehicles &amp; machinery. Serving individuals and professionals across Thessaloniki and Northern Greece.',
        features: [
            {
                icon:    'fa-bolt-lightning',
                labelEl: 'Άμεση Εξυπηρέτηση',
                labelEn: 'Fast Service',
                textEl:  'Γρήγορη ανταπόκριση &amp; <strong class="kw">έκδοση αδειών</strong> χωρίς καθυστερήσεις',
                textEn:  'Rapid response &amp; <strong class="kw">permit issuance</strong> without delays',
            },
            {
                icon:    'fa-gears',
                labelEl: 'Εξειδίκευση',
                labelEn: 'Specialization',
                textEl:  'Πλήρης κάλυψη <strong class="kw">μελετών</strong> για κάθε τύπο οχήματος &amp; μηχανήματος',
                textEn:  'Full coverage of <strong class="kw">studies</strong> for every type of vehicle &amp; machinery',
            },
            {
                icon:    'fa-handshake',
                labelEl: 'Συνεργασία',
                labelEn: 'Partnership',
                textEl:  'Στενή <strong class="kw">συνεργασία</strong> με αρχές &amp; φορείς για άμεσα αποτελέσματα',
                textEn:  'Close <strong class="kw">cooperation</strong> with authorities &amp; bodies for immediate results',
            },
        ],
    },

    // ── SERVICES ──────────────────────────────────────────────────────────
    services: [
        {
            icon:    'fa-car',
            titleEl: 'Μελέτες Οχημάτων',
            titleEn: 'Vehicle Studies',
            textEl:  'Εκπόνηση <strong class="kw">τεχνικών μελετών</strong> για κάθε κατηγορία οχήματος, σύμφωνα με την ισχύουσα νομοθεσία και τις προδιαγραφές του <strong class="kw">Υπουργείου Υποδομών</strong>.',
            textEn:  'Technical studies for all vehicle categories, in compliance with current legislation and <strong class="kw">Ministry of Infrastructure</strong> specifications.',
        },
        {
            icon:    'fa-certificate',
            titleEl: 'Εγκρίσεις Τύπου Οχημάτων &amp; Μηχανημάτων',
            titleEn: 'Vehicle &amp; Machinery Type Approvals',
            textEl:  'Διαδικασίες <strong class="kw">έγκρισης τύπου</strong> για οχήματα και μηχανήματα έργου, εξασφαλίζοντας <strong class="kw">νόμιμη κυκλοφορία</strong> και λειτουργία.',
            textEn:  '<strong class="kw">Type approval</strong> procedures for vehicles and work machinery, ensuring <strong class="kw">legal circulation</strong> and operation.',
        },
        {
            icon:    'fa-truck-ramp-box',
            titleEl: 'Άδειες &amp; Σημείωμα Ρυμούλκησης',
            titleEn: 'Towing Permits &amp; Towing Notes',
            textEl:  'Έκδοση <strong class="kw">αδειών κυκλοφορίας</strong> και <strong class="kw">σημειωμάτων ρυμούλκησης</strong> για ρυμουλκούμενα οχήματα κάθε τύπου — απαραίτητα έγγραφα για τη νόμιμη σύνδεση &amp; κυκλοφορία.',
            textEn:  'Issuance of <strong class="kw">circulation permits</strong> and <strong class="kw">towing notes</strong> for towed vehicles of all types — essential documents for legal coupling &amp; circulation.',
        },
        {
            icon:    'fa-gears',
            titleEl: 'Οχήματα &amp; Μηχανήματα Ειδικής Χρήσης &ndash; Ειδικού Σκοπού',
            titleEn: 'Special Use &amp; Special Purpose Vehicles &amp; Machinery',
            textEl:  '<strong class="kw">Αδειοδότηση</strong>, τεχνική κάλυψη και μελέτες για οχήματα &amp; μηχανήματα <strong class="kw">ειδικής χρήσης ή ειδικού σκοπού</strong>, προσαρμοσμένες στις ιδιαίτερες απαιτήσεις κάθε εφαρμογής.',
            textEn:  '<strong class="kw">Licensing</strong>, technical coverage and studies for <strong class="kw">special use &amp; special purpose</strong> vehicles and machinery, tailored to the specific requirements of each application.',
        },
        {
            icon:    'fa-helmet-safety',
            titleEl: 'Μελέτη Τοποθέτησης Γερανού',
            titleEn: 'Crane Installation Study',
            textEl:  'Εκπόνηση πλήρους μελέτης για την τοποθέτηση γερανών σε οχήματα, με τήρηση όλων των προδιαγραφών ασφαλείας, <strong class="kw">πιστοποίηση CE</strong> και <strong class="kw">έγκριση τύπου</strong>.',
            textEn:  'Full study for crane installation on vehicles, meeting all safety specifications, <strong class="kw">CE certification</strong> and <strong class="kw">type approval</strong>.',
        },
        {
            icon:    'fa-screwdriver-wrench',
            titleEl: 'Μελέτη Τοποθέτησης Υδραυλικής Πλατφόρμας',
            titleEn: 'Hydraulic Platform Installation Study',
            textEl:  'Τεχνική μελέτη για την εγκατάσταση <strong class="kw">υδραυλικών πλατφορμών</strong> σε οχήματα &amp; σταθερές εγκαταστάσεις, σύμφωνα με τα ευρωπαϊκά πρότυπα <strong class="kw">EN 1570</strong>.',
            textEn:  'Technical study for <strong class="kw">hydraulic platform</strong> installation on vehicles &amp; fixed installations, in accordance with European standard <strong class="kw">EN 1570</strong>.',
        },
    ],

    // ── PROJECTS ──────────────────────────────────────────────────────────
    projects: [
        {
            image:   'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800',
            catEl:   'Μελέτη Οχήματος',
            catEn:   'Vehicle Study',
            titleEl: 'Φορτηγό Ειδικής Χρήσης',
            titleEn: 'Special Use Truck',
            descEl:  'Πλήρης μελέτη &amp; έγκριση τύπου για μετατροπή',
            descEn:  'Full study &amp; type approval for conversion',
        },
        {
            image:   'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&q=80&w=800',
            catEl:   'Τρέιλερ',
            catEn:   'Trailer',
            titleEl: 'Ρυμουλκούμενο Βαρέως Τύπου',
            titleEn: 'Heavy-Duty Trailer',
            descEl:  'Άδεια τρέιλερ &amp; σημείωμα ρυμούλκησης',
            descEn:  'Trailer permit &amp; towing note',
        },
        {
            image:   'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800',
            catEl:   'Γερανός',
            catEn:   'Crane',
            titleEl: 'Τοποθέτηση Γερανού σε Όχημα',
            titleEn: 'Crane Mounting on Vehicle',
            descEl:  'Μελέτη τοποθέτησης &amp; πιστοποίηση ασφαλείας',
            descEn:  'Mounting study &amp; safety certification',
        },
        {
            image:   'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800',
            catEl:   'Υδραυλική Πλατφόρμα',
            catEn:   'Hydraulic Platform',
            titleEl: 'Ανυψωτική Πλατφόρμα σε Φορτηγό',
            titleEn: 'Lifting Platform on Truck',
            descEl:  'Μελέτη εγκατάστασης κατά EN 1570',
            descEn:  'Installation study per EN 1570',
        },
    ],

    // ── TRUST / HOW WE WORK SECTION ──────────────────────────────────────
    trust: {
        eyebrowEl: 'Γιατί να μας εμπιστευτείτε',
        eyebrowEn: 'Why trust us',
        headingEl: 'Εμπειρία που <em>μιλάει</em>',
        headingEn: 'Experience that <em>speaks</em>',
        // Large stats displayed prominently
        stats: [
            { numEl: '40+',  numEn: '40+',  labelEl: 'Χρόνια Εμπειρίας',   labelEn: 'Years of Experience' },
            { numEl: '20.000+', numEn: '20,000+', labelEl: 'Ολοκληρωμένα Έργα',  labelEn: 'Completed Projects' },
            { numEl: '100%', numEn: '100%', labelEl: 'Επιτυχείς Εγκρίσεις', labelEn: 'Successful Approvals' },
        ],
        // Three trust pillars
        pillars: [
            {
                icon:    'fa-medal',
                titleEl: 'Τεχνική Επάρκεια',
                titleEn: 'Technical Competence',
                textEl:  'Εξειδικευμένες γνώσεις σε κάθε τύπο οχήματος και μηχανήματος — από απλές βεβαιώσεις έως σύνθετες μελέτες ειδικού εξοπλισμού.',
                textEn:  'Specialized knowledge across every type of vehicle and machinery — from simple certifications to complex special equipment studies.',
            },
            {
                icon:    'fa-scale-balanced',
                titleEl: 'Νομική Ασφάλεια',
                titleEn: 'Legal Certainty',
                textEl:  'Πλήρης συμμόρφωση με την ισχύουσα νομοθεσία. Κάθε μελέτη και έγκριση εκδίδεται με ακρίβεια και νομική κάλυψη.',
                textEn:  'Full compliance with current legislation. Every study and approval is issued with precision and legal coverage.',
            },
            {
                icon:    'fa-handshake',
                titleEl: 'Αξιοπιστία & Συνέπεια',
                titleEn: 'Reliability & Consistency',
                textEl:  'Τηρούμε προθεσμίες, ενημερώνουμε συνεχώς και παρακολουθούμε κάθε υπόθεση από την αρχή έως την έκδοση της τελικής άδειας.',
                textEn:  'We meet deadlines, keep you informed and follow every case from start to final permit issuance.',
            },
        ],
    },

    // ── ARTICLES TICKER (horizontal auto-scroll strip) ────────────────────
    // url: set to real link when articles are published. '#' = placeholder.
    articles: [
        {
            url:    'https://www.gov.gr/ipiresies/periousia-kai-phorologia/okhemata',
            catEl:  'Μελέτες Οχημάτων',
            catEn:  'Vehicle Studies',
            titleEl: 'Τι περιλαμβάνει μια τεχνική μελέτη οχήματος',
            titleEn: 'What a vehicle technical study includes',
            textEl:  'Η τεχνική μελέτη οχήματος αφορά την αξιολόγηση κατασκευαστικών χαρακτηριστικών, αξόνων φόρτωσης και συστημάτων ασφαλείας σύμφωνα με τις ευρωπαϊκές οδηγίες.',
            textEn:  'A vehicle technical study covers the evaluation of structural characteristics, load axles and safety systems in accordance with European directives.',
        },
        {
            url:    'https://eur-lex.europa.eu/legal-content/EL/TXT/?uri=CELEX:32018R0858',
            catEl:  'Εγκρίσεις Τύπου',
            catEn:  'Type Approvals',
            titleEl: 'Έγκριση τύπου ΕΕ: Κανονισμός 2018/858 — βήμα-βήμα',
            titleEn: 'EU Type Approval: Regulation 2018/858 — step by step',
            textEl:  'Ο Κανονισμός (ΕΕ) 2018/858 ορίζει τη διαδικασία έγκρισης τύπου για μηχανοκίνητα οχήματα και ρυμουλκούμενα. Από την κατάθεση φακέλου έως την τελική χορήγηση.',
            textEn:  'Regulation (EU) 2018/858 establishes the type approval process for motor vehicles and trailers. From filing the dossier to final grant.',
        },
        {
            url:    'https://www.gov.gr/ipiresies/periousia-kai-phorologia/okhemata/adeia-kuklophorias-khoregese-pinakidon-epikathemenou-e-rumoulkoumenou-e-phdkh-se-antikatastase-apokharakteristhentos',
            catEl:  'Ρυμουλκούμενα',
            catEn:  'Trailers & Towing',
            titleEl: 'Άδεια κυκλοφορίας ρυμουλκούμενου: υποχρεώσεις & προϋποθέσεις',
            titleEn: 'Trailer circulation permit: obligations & requirements',
            textEl:  'Ποιες κατηγορίες ρυμουλκούμενων (Ο1–Ο4) απαιτούν ειδική άδεια, τι ισχύει για βαρέα φορτηγά και πώς εκδίδεται νόμιμα το σημείωμα ρυμούλκησης.',
            textEn:  'Which trailer categories (O1–O4) require a special permit, what applies to heavy trucks, and how the towing note is legally issued.',
        },
        {
            url:    'https://mitos.gov.gr/index.php/%CE%94%CE%94:%CE%88%CE%B3%CE%BA%CF%81%CE%B9%CF%83%CE%B7_%CF%84%CE%B1%CE%BE%CE%B9%CE%BD%CF%8C%CE%BC%CE%B7%CF%83%CE%B7%CF%82_%CE%BC%CE%B5%CF%84%CE%B1%CE%B2%CE%B9%CE%B2%CE%B1%CE%B6%CF%8C%CE%BC%CE%B5%CE%BD%CF%89%CE%BD_%CE%BF%CF%87%CE%B7%CE%BC%CE%AC%CF%84%CF%89%CE%BD_%CE%95%CE%B9%CE%B4%CE%B9%CE%BA%CE%AE%CF%82_%CE%A7%CF%81%CE%AE%CF%83%CE%B7%CF%82-%CE%95%CE%B9%CE%B4%CE%B9%CE%BA%CE%BF%CF%8D_%CE%A3%CE%BA%CE%BF%CF%80%CE%BF%CF%8D_%CF%80%CE%BF%CF%85_%CE%B4%CE%B5%CE%BD_%CE%B5%CE%BA%CF%84%CE%B5%CE%BB%CE%BF%CF%8D%CE%BD_%CE%BC%CE%B5%CF%84%CE%B1%CF%86%CE%BF%CF%81%CE%B9%CE%BA%CF%8C_%CE%AD%CF%81%CE%B3%CE%BF',
            catEl:  'Οχήματα Ειδικής Χρήσης',
            catEn:  'Special Use Vehicles',
            titleEl: 'Αδειοδότηση οχημάτων ειδικής χρήσης — ειδικού σκοπού',
            titleEn: 'Licensing special-use & special-purpose vehicles in Greece',
            textEl:  'Έγκριση ταξινόμησης οχημάτων Ειδικής Χρήσης–Ειδικού Σκοπού που δεν εκτελούν μεταφορικό έργο: δικαιολογητικά, αρμόδιες υπηρεσίες, διαδικασία.',
            textEn:  'Classification approval for Special Use–Special Purpose vehicles not performing transport work: required documents, competent authorities, procedure.',
        },
        {
            url:    'https://politis.pde.gov.gr/%CF%84%CE%BF%CF%80%CE%BF%CE%B8%CE%AD%CF%84%CE%B7%CF%83%CE%B7-%CE%B3%CE%B5%CF%81%CE%B1%CE%BD%CE%BF%CF%8D-%CE%BA%CE%B1%CE%B9-%CE%AD%CE%BA%CE%B4%CE%BF%CF%83%CE%B7-%CE%BD%CE%AD%CE%B1%CF%82-%CE%AC%CE%B4-2/',
            catEl:  'Γερανοί & Ανυψωτικά',
            catEn:  'Cranes & Lifting',
            titleEl: 'Τοποθέτηση γερανού σε φορτηγό: νέα άδεια κυκλοφορίας',
            titleEn: 'Crane installation on a truck: new circulation permit',
            textEl:  'Η τοποθέτηση γερανού σε φορτηγό απαιτεί πλήρη μελέτη στατικής επάρκειας, πιστοποιητικό ανύψωσης και έκδοση νέας άδειας κυκλοφορίας.',
            textEn:  'Mounting a crane on a truck requires a structural adequacy study, lifting certificate and issuance of a new vehicle circulation permit.',
        },
        {
            url:    'https://eur-lex.europa.eu/EL/legal-content/summary/eu-approval-and-market-surveillance-measures-for-motor-vehicles-and-their-trailers.html',
            catEl:  'Εποπτεία Αγοράς ΕΕ',
            catEn:  'EU Market Surveillance',
            titleEl: 'Εποπτεία αγοράς & έγκριση ΕΕ για οχήματα και ρυμουλκούμενα',
            titleEn: 'EU approval & market surveillance for vehicles and trailers',
            textEl:  'Η ΕΕ ορίζει ενιαίο σύστημα εποπτείας αγοράς για οχήματα και ρυμουλκούμενα, διασφαλίζοντας ότι τα εγκεκριμένα οχήματα πληρούν όλες τις τεχνικές απαιτήσεις.',
            textEn:  'The EU establishes a unified market surveillance system for vehicles and trailers, ensuring approved vehicles meet all technical requirements.',
        },
        {
            url:    'https://www.gov.gr/ipiresies/polites-kai-kathemerinoteta/metakineseis/khoregese-semeiomatos-prosarteses-rumoulkoumenou-okhematos-se-epibatika-autokineta-idiotikes-khreses',
            catEl:  'Σημείωμα Ρυμούλκησης',
            catEn:  'Towing Note',
            titleEl: 'Σημείωμα ρυμούλκησης σε Ι.Χ.: πότε χρειάζεται και πώς εκδίδεται',
            titleEn: 'Towing note for private cars: when it is required and how to obtain it',
            textEl:  'Κάθε επιβατικό αυτοκίνητο που ρυμουλκεί τροχόσπιτο, μπαγκαζιέρα ή λέμβο χρειάζεται ειδικό σημείωμα προσάρτησης. Δείτε τα δικαιολογητικά και τη διαδικασία.',
            textEn:  'Every passenger car towing a caravan, luggage trailer or boat needs a special attachment note. See the required documents and the procedure.',
        },
        {
            url:    'https://politis.pde.gov.gr/%CE%AD%CE%BA%CE%B4%CE%BF%CF%83%CE%B7-%CE%B1%CE%B4%CE%B5%CE%AF%CE%B1%CF%82-%CE%BA%CF%85%CE%BA%CE%BB%CE%BF%CF%86%CE%BF%CF%81%CE%AF%CE%B1%CF%82-%CF%81%CF%85%CE%BC%CE%BF%CF%85%CE%BB%CE%BA%CE%BF%CF%8D-2/',
            catEl:  'Άδεια Κυκλοφορίας',
            catEn:  'Circulation Permit',
            titleEl: 'Έκδοση άδειας κυκλοφορίας ρυμουλκούμενου Ι.Χ. — κατηγορίες Ο1 & Ο2',
            titleEn: 'Issuing a circulation permit for a private trailer — categories O1 & O2',
            textEl:  'Βήμα-βήμα οδηγός για νέα ταξινόμηση ή μεταβίβαση ρυμουλκούμενου κατηγορίας Ο1 ή Ο2. Απαιτούμενα έγγραφα, παράβολα και αρμόδιες υπηρεσίες.',
            textEn:  'Step-by-step guide for new registration or transfer of an O1 or O2 category trailer. Required documents, fees and competent authorities.',
        },
        {
            url:    'https://mitos.gov.gr/index.php/%CE%94%CE%94:%CE%86%CE%B4%CE%B5%CE%B9%CE%B1_%CE%BA%CF%85%CE%BA%CE%BB%CE%BF%CF%86%CE%BF%CF%81%CE%AF%CE%B1%CF%82_%CE%BF%CF%87%CE%AE%CE%BC%CE%B1%CF%84%CE%BF%CF%82_%CE%BC%CE%B5%CF%84%CE%B1%CF%86%CE%BF%CF%81%CE%AC%CF%82_%CE%B5%CF%80%CE%B9%CE%BA%CE%AF%CE%BD%CE%B4%CF%85%CE%BD%CF%89%CE%BD_%CE%B5%CE%BC%CF%80%CE%BF%CF%81%CE%B5%CF%85%CE%BC%CE%AC%CF%84%CF%89%CE%BD_ADR',
            catEl:  'Επικίνδυνα Φορτία ADR',
            catEn:  'ADR Dangerous Goods',
            titleEl: 'Άδεια κυκλοφορίας οχήματος ADR: απαιτήσεις & πιστοποίηση',
            titleEn: 'ADR vehicle circulation permit: requirements & certification',
            textEl:  'Οχήματα μεταφοράς επικίνδυνων εμπορευμάτων (EX/II, EX/III, FL, AT, MEMU) απαιτούν ειδική άδεια κυκλοφορίας ADR και τακτικούς ελέγχους συμμόρφωσης.',
            textEn:  'Vehicles carrying dangerous goods (EX/II, EX/III, FL, AT, MEMU) require a special ADR circulation permit and regular compliance inspections.',
        },
        {
            url:    'https://www.eurocert.gr/pistopoiisi/pistopoiisi-michanon',
            catEl:  'Πιστοποίηση CE',
            catEn:  'CE Certification',
            titleEl: 'Πιστοποίηση CE μηχανών — Οδηγία 2006/42/ΕΚ & ΠΔ 57/2010',
            titleEn: 'CE certification of machinery — Directive 2006/42/EC & PD 57/2010',
            textEl:  'Κάθε ανυψωτικό μηχάνημα που κυκλοφορεί στην ΕΕ πρέπει να φέρει σήμανση CE. Η οδηγία 2006/42/ΕΚ ορίζει τις ουσιώδεις απαιτήσεις υγείας και ασφάλειας.',
            textEn:  'Every lifting machine placed on the EU market must bear CE marking. Directive 2006/42/EC defines the essential health and safety requirements.',
        },
        {
            url:    'https://eur-lex.europa.eu/EL/legal-content/summary/type-approval-requirements-to-ensure-the-general-safety-of-vehicles-and-the-protection-of-vulnerable-road-users.html',
            catEl:  'Ασφάλεια Οχημάτων ΕΕ',
            catEn:  'EU Vehicle Safety',
            titleEl: 'Κανονισμός ΕΕ 2019/2144: ασφάλεια & προστασία ευάλωτων χρηστών',
            titleEn: 'EU Regulation 2019/2144: safety & protection of vulnerable road users',
            textEl:  'Ο κανονισμός 2019/2144 εισάγει νέες τεχνικές απαιτήσεις έγκρισης τύπου για οχήματα, ενισχύοντας την προστασία πεζών, ποδηλατών και επιβατών.',
            textEn:  'Regulation 2019/2144 introduces new type-approval requirements for vehicles, strengthening protection of pedestrians, cyclists and occupants.',
        },
        {
            url:    'https://drivers-vehicles.services.gov.gr/',
            catEl:  'Ψηφιακές Υπηρεσίες',
            catEn:  'Digital Services',
            titleEl: 'Ψηφιακές υπηρεσίες αδειών οδήγησης & κυκλοφορίας — gov.gr',
            titleEn: 'Digital services for driving licences & vehicle permits — gov.gr',
            textEl:  'Η πύλη drivers-vehicles.services.gov.gr συγκεντρώνει όλες τις ψηφιακές υπηρεσίες για άδειες οδήγησης, κυκλοφορίας και τεχνικό έλεγχο στη μία πλατφόρμα.',
            textEn:  'The drivers-vehicles.services.gov.gr portal gathers all digital services for driving licences, vehicle permits and technical inspections in one platform.',
        },
    ],  // end articles

    // ── CONTACT FORM DROPDOWN ─────────────────────────────────────────────
    formOptions: [
        { el: 'Μελέτη Οχήματος',                       en: 'Vehicle Study' },
        { el: 'Έγκριση Τύπου',                         en: 'Type Approval' },
        { el: 'Άδεια Τρέιλερ / Σημείωμα Ρυμούλκησης', en: 'Trailer Permit / Towing Note' },
        { el: 'Μελέτη Γερανού / Υδραυλικής Πλατφόρμας', en: 'Crane / Hydraulic Platform Study' },
        { el: 'Άλλο',                                  en: 'Other' },
    ],
};
