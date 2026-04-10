/* ══════════════════════════════════════════════════════════════
   app.js — Δημήτριος Μουδιώτης Personal Landing Page
   Handles: i18n · nav · animations · countup · form
══════════════════════════════════════════════════════════════ */

/* ── i18n STRINGS ── */
const STRINGS = {
  el: {
    'nav.role':     'Μηχανολόγος Μηχανικός',
    'nav.about':    'Σχετικά',
    'nav.trailer':  'Άδειες Ο1/Ο2',
    'nav.services': 'Υπηρεσίες',
    'nav.cred':     'Σπουδές',
    'nav.team':     'Συνεργάτες',
    'nav.contact':  'Επικοινωνία',
    'hero.badge':   'Μηχανολόγος Μηχανικός',
    'hero.exp':     '9+ χρόνια εμπειρία',
    'hero.n1':      'ΔΗΜΗΤΡΙΟΣ',
    'hero.n2':      'ΜΟΥΔΙΩΤΗΣ',
    'hero.tagline': 'Μηχανολόγος Μηχανικός — 5 πτυχία, 3 χώρες.<br>Από <strong>άδειες Ο1/Ο2 ρυμουλκούμενων</strong> και <strong>ενεργειακά πιστοποιητικά</strong><br>ώς <strong>τεχνικό ασφαλείας</strong> και <strong>3D printing</strong>.',
    'hero.cta.trailer': 'Άδειες Ο1/Ο2 →',
    'hero.cta.contact': 'Επικοινωνία',
    'stat.projects':'Έργα',
    'stat.degrees': 'Πτυχία',
    'stat.years':   'Χρόνια',
    'stat.schol':   'Υποτροφίες',
    'mq.1': 'Άδειες Ρυμουλκούμενων Ο1 / Ο2',
    'mq.2': 'Μελέτες Οχημάτων',
    'mq.3': 'Ενεργειακά Πιστοποιητικά ΠΕΑ',
    'mq.4': 'Τεχνικός Ασφαλείας — ΓΕΕΚ',
    'mq.5': '3D Printing & CAD',
    'mq.6': 'Web Design',
    'mq.7': 'Laser Cut & Sheet Metal',
    'mq.8': 'Εγκρίσεις Τύπου',
    'about.eyebrow': 'Σχετικά με εμένα',
    'about.h':   'Μηχανικός με <em>πάθος</em> για το αποτέλεσμα',
    'about.p1':  'Είμαι Μηχανολόγος Μηχανικός με 5 πανεπιστημιακούς τίτλους από 3 χώρες — BEng ΑΠΘ, MSc École Centrale Paris, MSc IFP School (Παρίσι), MSc ΔΠΘ και MBA Washington University of Science & Technology. Με 9+ χρόνια στον τομέα, συνδυάζω βαθιά τεχνική γνώση με πρακτική εμπειρία σε ένα ευρύ φάσμα έργων.',
    'about.p2':  'Διευθύνω την <strong>Expertease Designs</strong> στην Αθήνα, παρέχοντας ολοκληρωμένες μηχανολογικές υπηρεσίες — από άδειες ρυμουλκούμενων Ο1/Ο2 και ενεργειακά πιστοποιητικά, έως τεχνικό ασφαλείας, 3D printing και web design.',
    'af.1t': '5 Πανεπιστημιακοί Τίτλοι', 'af.1s': ' — 3 χώρες, πολλαπλές ειδικεύσεις',
    'af.2t': '9 Υποτροφίες Αριστείας',  'af.2s': ' — Ελλάδα, Γαλλία, ΗΠΑ',
    'af.3t': '50+ Ολοκληρωμένα Έργα',   'af.3s': ' — robotics, οχήματα, web',
    'af.4t': 'Τεχνικός Ασφαλείας',      'af.4s': ' — Ν.3850/2010, ΓΕΕΚ, ΣΕΠΕ',
    'ec.h': 'Τομείς Εξειδίκευσης',
    'ec.1': 'Μελέτες Οχημάτων / Ο1–Ο2',
    'ec.2': 'Μηχανολογικός Σχεδιασμός (CAD/FEA)',
    'ec.3': 'Ενεργειακά Πιστοποιητικά (ΠΕΑ)',
    'ec.4': 'Τεχνικός Ασφαλείας (Υ&Α)',
    'ec.5': '3D Printing & Rapid Prototyping',
    'ec.6': 'Web Design & Software',
    'tr.badge':    'ΥΠΟΧΡΕΩΤΙΚΟ — ΕΝΑΡΞΗ ΔΙΑΔΙΚΑΣΙΩΝ 2024',
    'tr.heading':  'Άδειες Ρυμουλκούμενων',
    'tr.lead':     'Ξανάνοιξαν οι διαδικασίες για την έκδοση αδειών κυκλοφορίας ρυμουλκούμενων οχημάτων κατηγορίας <strong>Ο1</strong> και <strong>Ο2</strong>. Η αδειοδότηση είναι <strong>πλέον υποχρεωτική για όλα τα ρυμουλκούμενα</strong> — τρέιλερ, ρυμούλκες, φορτηγίδες — ανεξαρτήτως παλαιότητας ή χρήσης.',
    'tr.o1.h': 'Κατηγορία Ο1',
    'tr.o1.d': 'Ρυμουλκούμενα με μέγιστη μάζα <strong>έως 750 kg</strong>. Τρέιλερ σκαφών, camping, μικρές φορτηγίδες.',
    'tr.o1.l1': 'Άδεια κυκλοφορίας',
    'tr.o1.l2': 'Τεχνική έκθεση',
    'tr.o1.l3': 'Υποβολή σε ΥΜΕΔ / ΚΤΕΟ',
    'tr.o2.h': 'Κατηγορία Ο2',
    'tr.o2.d': 'Ρυμουλκούμενα με μέγιστη μάζα <strong>750 kg έως 3,5 τόνους</strong>. Επαγγελματικές ρυμούλκες, φορτηγίδες, εξειδικευμένα.',
    'tr.o2.l1': 'Πλήρης μελέτη οχήματος',
    'tr.o2.l2': 'Έλεγχος τεχνικών χαρακτηριστικών',
    'tr.o2.l3': 'Εκπροσώπηση σε αρχές',
    'tr.proc.h': 'Διαδικασία',
    'tr.proc.d': 'Αναλαμβάνω το <strong>σύνολο της διαδικασίας</strong> — από τη συλλογή δικαιολογητικών ώς την έκδοση αδείας.',
    'tr.s1': 'Αρχική εκτίμηση & κατηγοριοποίηση',
    'tr.s2': 'Σύνταξη τεχνικής μελέτης',
    'tr.s3': 'Υποβολή στις αρμόδιες αρχές',
    'tr.s4': 'Παρακολούθηση & έκδοση άδειας',
    'tr.cta.warn': 'Μην καθυστερείτε — οι θέσεις εξυπηρέτησης συμπληρώνονται γρήγορα.',
    'tr.cta.btn':  'Ζητήστε Ενημέρωση για Ο1/Ο2 →',
    'srv.eyebrow': 'Τι κάνω',
    'srv.h':  'Πλήρες φάσμα <em>υπηρεσιών</em>',
    'srv.lead': 'Από τεχνικές μελέτες και νομική συμμόρφωση ώς digital design — μία στέρεη συνεργασία, πολλαπλές λύσεις.',
    's1.t': 'Μελέτες Οχημάτων & Άδειες Ο1/Ο2',
    's1.d': 'Μελέτες ειδικών & ρυμουλκούμενων οχημάτων, εγκρίσεις τύπου. Πλήρης αδειοδότηση Ο1/Ο2.',
    's2.t': 'Ενεργειακά Πιστοποιητικά (ΠΕΑ)',
    's2.d': 'Έκδοση ΠΕΑ για κατοικίες και επαγγελματικούς χώρους — υποχρεωτικό για αγοροπωλησία & μίσθωση.',
    's3.t': 'Τεχνικός Ασφαλείας',
    's3.d': 'Κάλυψη Τεχνικού Ασφαλείας (Ν.3850/2010), σύνταξη ΓΕΕΚ, εκπαιδεύσεις και προετοιμασία για ΣΕΠΕ.',
    's4.t': 'Μηχανολογικός Σχεδιασμός & 3D Printing',
    's4.d': 'CAD 3D (SolidWorks), FEA αντοχών, rapid prototyping — FDM, SLA, SLS για ακριβή εξαρτήματα.',
    's5.t': 'Web Design & Ανάπτυξη Λογισμικού',
    's5.d': '100% custom websites χωρίς templates. Ειδικό λογισμικό για τεχνικές εφαρμογές.',
    's6.t': 'Laser Cut & Κατεργασία Μετάλλου',
    's6.d': 'Κοπή και εγχάραξη laser, κατεργασία φύλλων μετάλλου, εξαρτήματα ακριβείας.',
    'sb.title': 'Γνωρίζατε;',
    'sb.text':  'Σύμφωνα με τον <strong>Ν.3850/2010</strong>, ακόμα και επιχειρήσεις με <strong>έναν μόνο εργαζόμενο</strong> υποχρεούνται να έχουν Τεχνικό Ασφαλείας και γραπτή εκτίμηση επαγγελματικού κινδύνου (ΓΕΕΚ).',
    'sb.cta':   'Πλήρης Κάλυψη →',
    'cred.eyebrow': 'Σπουδές & Τίτλοι',
    'cred.h':    '5 Πτυχία — <em>3 Χώρες</em>',
    'cred.lead': 'Πολυεπίπεδη εκπαίδευση που συνδυάζει μηχανολογία, ενέργεια, τεχνολογία και επιχειρηματικότητα.',
    'd1.t': 'Μηχανολόγος Μηχανικός',
    'd2.t': 'Μηχανολογία — Ingénieur',
    'd3.t': 'Ενέργεια & Πετρελαϊκή Μηχανική',
    'd4.t': 'Τεχνολογία & Επιχειρηματικότητα',
    'd5.t': 'Business Administration',
    'schol': 'Υποτροφίες Αριστείας — Ελλάδα · Γαλλία · ΗΠΑ',
    'team.eyebrow': 'Δίκτυο Συνεργατών',
    'team.h':   'Εξειδικευμένοι <em>Συνεργάτες</em>',
    'team.lead':'Κάθε έργο υποστηρίζεται από ένα αξιόπιστο δίκτυο εξειδικευμένων μηχανικών και συμβούλων.',
    't1.n': 'Δημήτριος Γκούβελης', 't1.r': 'Μηχανολόγος Μηχανικός',
    't1.d': 'Τεχνικό Γραφείο Γκούβελης & Συνεργάτες — Θεσσαλονίκη. Εξειδίκευση σε μελέτες οχημάτων, εγκρίσεις τύπου και αδειοδότηση ρυμουλκούμενων.',
    't2.n': 'Σταύρος Μάλλιαρης', 't2.r': 'Τεχνικός Ασφαλείας — MEng, ASP®',
    't2.d': 'Πιστοποιημένος Μηχανικός Υγείας & Ασφάλειας ΑΠΘ. 7+ χρόνια διεθνούς εμπειρίας σε ΓΕΕΚ, εκπαιδεύσεις εργαζομένων & επιθεωρήσεις ΣΕΠΕ.',
    't3.n': 'Βάϊος Λιάπης', 't3.r': 'Πολιτικός Μηχανικός',
    't3.d': 'Εξειδίκευση σε κατασκευαστικές μελέτες, στατικές αναλύσεις και αδειοδοτήσεις κτηριακών έργων — Αθήνα.',
    'val.eyebrow': 'Αρχές Εργασίας',
    'val.h': 'Γιατί να <em>επιλέξετε</em> συνεργασία',
    'v1e':'Precision','v1g':'Ακρίβεια','v1t':'Κάθε μελέτη εκπονείται με μεθοδολογική ακρίβεια, πλήρη τεκμηρίωση και τήρηση νομικών προδιαγραφών.',
    'v2e':'Reliability','v2g':'Αξιοπιστία','v2t':'Τηρώ κάθε δέσμευση — ημερομηνίες, ποιότητα, διαφάνεια σε κάθε στάδιο της συνεργασίας μας.',
    'v3e':'Versatility','v3g':'Πολυδυναμία','v3t':'Ένας αξιόπιστος συνεργάτης — πολλαπλές δυνατότητες. Από την τεχνική μελέτη ώς τον ψηφιακό σχεδιασμό.',
    'ct.eyebrow': 'Επικοινωνία',
    'ct.h': 'Ας <em>μιλήσουμε</em>',
    'ct.intro': 'Είτε χρειάζεστε άδεια ρυμουλκούμενου Ο1/Ο2, ενεργειακό πιστοποιητικό, κάλυψη τεχνικού ασφαλείας ή οποιαδήποτε άλλη τεχνική υπηρεσία — επικοινωνήστε για μία δωρεάν αρχική συζήτηση.',
    'ci.phone': 'Σταθερό', 'ci.mobile': 'Κινητό',
    'ci.loc': 'Βάση', 'ci.locval': 'Αθήνα, Ελλάδα',
    'f.name':'Ονοματεπώνυμο *','f.phone':'Τηλέφωνο',
    'f.subject':'Θέμα','f.msg':'Μήνυμα','f.send':'Αποστολή',
    'f.sel':'— Επιλέξτε υπηρεσία —',
    'f.o1':'Άδεια Ρυμουλκούμενου Ο1','f.o2':'Άδεια Ρυμουλκούμενου Ο2',
    'f.pea':'Ενεργειακό Πιστοποιητικό (ΠΕΑ)',
    'f.safe':'Τεχνικός Ασφαλείας / ΓΕΕΚ',
    'f.mech':'Μηχανολογικός Σχεδιασμός / 3D Print',
    'f.web':'Web Design / Λογισμικό','f.laser':'Laser Cut / Κατεργασία Μετάλλου',
    'f.other':'Άλλο',
    'f.note':'Απαντώ συνήθως εντός 24 ωρών.',
    'ft.role':'Μηχανολόγος Μηχανικός — Αθήνα',
    'ft.by':'Σχεδίαση & ανάπτυξη:',
  },
  en: {
    'nav.role':     'Mechanical Engineer',
    'nav.about':    'About',
    'nav.trailer':  'O1/O2 Licences',
    'nav.services': 'Services',
    'nav.cred':     'Education',
    'nav.team':     'Team',
    'nav.contact':  'Contact',
    'hero.badge':   'Mechanical Engineer',
    'hero.exp':     '9+ years experience',
    'hero.n1':      'DIMITRIOS',
    'hero.n2':      'MOUDIOTIS',
    'hero.tagline': 'Mechanical Engineer — 5 degrees, 3 countries.<br>From <strong>O1/O2 trailer licences</strong> and <strong>energy certificates</strong><br>to <strong>safety engineer</strong> and <strong>3D printing</strong>.',
    'hero.cta.trailer': 'O1/O2 Licences →',
    'hero.cta.contact': 'Contact',
    'stat.projects':'Projects',
    'stat.degrees': 'Degrees',
    'stat.years':   'Years',
    'stat.schol':   'Scholarships',
    'mq.1': 'O1 / O2 Trailer Licences',
    'mq.2': 'Vehicle Studies',
    'mq.3': 'Energy Performance Certificates',
    'mq.4': 'Safety Engineer — Risk Assessment',
    'mq.5': '3D Printing & CAD',
    'mq.6': 'Web Design',
    'mq.7': 'Laser Cut & Sheet Metal',
    'mq.8': 'Type Approvals',
    'about.eyebrow': 'About me',
    'about.h': 'Engineer with <em>passion</em> for results',
    'about.p1': 'I am a Mechanical Engineer with 5 university degrees from 3 countries — BEng AUTH, MSc École Centrale Paris, MSc IFP School (Paris), MSc IHU and MBA Washington University of Science & Technology. With 9+ years in the field, I combine deep technical knowledge with hands-on experience across a wide range of projects.',
    'about.p2': 'I run <strong>Expertease Designs</strong> in Athens, providing comprehensive mechanical engineering services — from O1/O2 trailer licences and energy certificates, to safety engineer coverage, 3D printing and web design.',
    'af.1t': '5 University Degrees', 'af.1s': ' — 3 countries, multiple specialisations',
    'af.2t': '9 Excellence Scholarships', 'af.2s': ' — Greece, France, USA',
    'af.3t': '50+ Completed Projects', 'af.3s': ' — robotics, vehicles, web',
    'af.4t': 'Certified Safety Engineer', 'af.4s': ' — Law 3850/2010, GEEK, SEPE',
    'ec.h': 'Areas of Expertise',
    'ec.1': 'Vehicle Studies / O1–O2 Licences',
    'ec.2': 'Mechanical Design (CAD/FEA)',
    'ec.3': 'Energy Performance Certificates',
    'ec.4': 'Safety Engineer (H&S)',
    'ec.5': '3D Printing & Rapid Prototyping',
    'ec.6': 'Web Design & Software',
    'tr.badge':    'MANDATORY — PROCEDURES REOPENED 2024',
    'tr.heading':  'Trailer Licences',
    'tr.lead':     'Procedures for the registration of trailers category <strong>O1</strong> and <strong>O2</strong> have reopened. Registration is now <strong>mandatory for all trailers</strong> — boat trailers, flatbeds, freight trailers — regardless of age or use.',
    'tr.o1.h': 'Category O1',
    'tr.o1.d': 'Trailers with maximum mass <strong>up to 750 kg</strong>. Boat trailers, camping trailers, small flatbeds.',
    'tr.o1.l1': 'Registration licence',
    'tr.o1.l2': 'Technical report',
    'tr.o1.l3': 'Submission to YMED / KTEO',
    'tr.o2.h': 'Category O2',
    'tr.o2.d': 'Trailers with maximum mass <strong>750 kg to 3.5 tonnes</strong>. Professional trailers, freight, specialised.',
    'tr.o2.l1': 'Full vehicle study',
    'tr.o2.l2': 'Technical characteristics check',
    'tr.o2.l3': 'Representation with authorities',
    'tr.proc.h': 'Process',
    'tr.proc.d': 'I handle the <strong>entire process</strong> — from document collection to licence issuance.',
    'tr.s1': 'Initial assessment & categorisation',
    'tr.s2': 'Technical study preparation',
    'tr.s3': 'Submission to competent authorities',
    'tr.s4': 'Follow-up & licence issuance',
    'tr.cta.warn': "Don't delay — service slots fill quickly.",
    'tr.cta.btn':  'Request O1/O2 Information →',
    'srv.eyebrow': 'What I do',
    'srv.h': 'Full range of <em>services</em>',
    'srv.lead': 'From technical studies and legal compliance to digital design — one solid partnership, multiple solutions.',
    's1.t': 'Vehicle Studies & O1/O2 Licences',
    's1.d': 'Special & trailer vehicle studies, type approvals. Full O1/O2 licensing.',
    's2.t': 'Energy Performance Certificates (EPC)',
    's2.d': 'EPC issuing for residences and commercial spaces — mandatory for sale & lease.',
    's3.t': 'Safety Engineer',
    's3.d': 'Safety Engineer coverage (Law 3850/2010), risk assessment (GEEK), employee training & SEPE preparation.',
    's4.t': 'Mechanical Design & 3D Printing',
    's4.d': '3D CAD (SolidWorks), FEA analysis, rapid prototyping — FDM, SLA, SLS for precision parts.',
    's5.t': 'Web Design & Software Development',
    's5.d': '100% custom websites, no templates. Specialised software for technical applications.',
    's6.t': 'Laser Cutting & Sheet Metal',
    's6.d': 'Laser cutting & engraving, sheet metal work, precision parts manufacturing.',
    'sb.title': 'Did you know?',
    'sb.text':  'According to <strong>Law 3850/2010</strong>, even businesses with <strong>a single employee</strong> are required to have a Safety Engineer and written occupational risk assessment (GEEK).',
    'sb.cta':   'Full Coverage →',
    'cred.eyebrow': 'Education & Degrees',
    'cred.h': '5 Degrees — <em>3 Countries</em>',
    'cred.lead': 'Multi-level education combining mechanical engineering, energy, technology and business administration.',
    'd1.t': 'Mechanical Engineer',
    'd2.t': 'Mechanical Engineering — Ingénieur',
    'd3.t': 'Energy & Petroleum Engineering',
    'd4.t': 'Technology & Entrepreneurship',
    'd5.t': 'Business Administration',
    'schol': 'Excellence Scholarships — Greece · France · USA',
    'team.eyebrow': 'Collaborator Network',
    'team.h': 'Specialised <em>Collaborators</em>',
    'team.lead': 'Every project is backed by a trusted network of specialised engineers and consultants.',
    't1.n': 'Dimitrios Gkouvelis', 't1.r': 'Mechanical Engineer',
    't1.d': 'Gkouvelis Technical Office & Associates — Thessaloniki. Specialisation in vehicle studies, type approvals and trailer licensing.',
    't2.n': 'Stavros Malliaris', 't2.r': 'Safety Engineer — MEng, ASP®',
    't2.d': 'Certified Health & Safety Engineer, AUTH. 7+ years of international experience in risk assessments, employee training & SEPE inspections.',
    't3.n': 'Vaios Liapis', 't3.r': 'Civil Engineer',
    't3.d': 'Specialisation in structural studies, static analysis and building permit authorisations — Athens.',
    'val.eyebrow': 'Work Principles',
    'val.h': 'Why <em>choose</em> to work together',
    'v1e':'Precision','v1g':'Ακρίβεια','v1t':'Every study is prepared with methodological precision, full documentation and compliance with legal specifications.',
    'v2e':'Reliability','v2g':'Αξιοπιστία','v2t':'I honour every commitment — deadlines, quality, transparency at every stage of our collaboration.',
    'v3e':'Versatility','v3g':'Πολυδυναμία','v3t':'One reliable partner — multiple capabilities. From technical studies to digital design.',
    'ct.eyebrow': 'Contact',
    'ct.h': 'Let\'s <em>talk</em>',
    'ct.intro': 'Whether you need an O1/O2 trailer licence, energy certificate, safety engineer coverage or any other technical service — get in touch for a free initial consultation.',
    'ci.phone': 'Landline', 'ci.mobile': 'Mobile',
    'ci.loc': 'Base', 'ci.locval': 'Athens, Greece',
    'f.name':'Full Name *','f.phone':'Phone',
    'f.subject':'Subject','f.msg':'Message','f.send':'Send',
    'f.sel':'— Select a service —',
    'f.o1':'O1 Trailer Licence','f.o2':'O2 Trailer Licence',
    'f.pea':'Energy Performance Certificate',
    'f.safe':'Safety Engineer / Risk Assessment',
    'f.mech':'Mechanical Design / 3D Print',
    'f.web':'Web Design / Software','f.laser':'Laser Cut / Sheet Metal',
    'f.other':'Other',
    'f.note':'I usually reply within 24 hours.',
    'ft.role':'Mechanical Engineer — Athens',
    'ft.by':'Design & development:',
  }
};

/* ── STATE ── */
let currentLang = localStorage.getItem('lang') || 'el';

/* ── APPLY LANGUAGE ── */
function applyLang(lang) {
  const dict = STRINGS[lang];
  if (!dict) return;

  // Simple text nodes
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.getAttribute('data-i18n');
    if (dict[k] !== undefined) el.textContent = dict[k];
  });

  // HTML content
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const k = el.getAttribute('data-i18n-html');
    if (dict[k] !== undefined) el.innerHTML = dict[k];
  });

  // Lang buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });

  // Marquee items (duplicate loop — update all)
  document.querySelectorAll('.mq-item [data-i18n]').forEach(el => {
    const k = el.getAttribute('data-i18n');
    if (dict[k] !== undefined) el.textContent = dict[k];
  });

  document.documentElement.lang = lang === 'el' ? 'el' : 'en';
  currentLang = lang;
  localStorage.setItem('lang', lang);
}

function setLang(lang) {
  applyLang(lang);
}

/* ── NAVIGATION ── */
const nav = document.getElementById('nav');
function onScroll() {
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 60);

  // Progress bar
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docH > 0 ? (y / docH) * 100 : 0;
  const prog = document.getElementById('progress');
  if (prog) prog.style.width = pct + '%';

  // Scroll elevation
  const elev = document.getElementById('scrollElev');
  const fill = document.getElementById('elevFill');
  const dot  = document.getElementById('elevDot');
  if (elev && fill && dot) {
    elev.classList.toggle('show', y > 120);
    const h = Math.min(100, pct);
    fill.style.height = h + '%';
    dot.style.bottom = h + '%';
  }
}
window.addEventListener('scroll', onScroll, { passive: true });

/* ── HAMBURGER ── */
function toggleMenu() {
  const links = document.getElementById('navLinks');
  const burger = document.getElementById('hamburger');
  links.classList.toggle('open');
  burger.classList.toggle('open');
}
// Close menu on link click
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
    document.getElementById('hamburger').classList.remove('open');
  });
});
// Close menu on scroll
window.addEventListener('scroll', () => {
  document.getElementById('navLinks').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
}, { passive: true });

/* ── SCROLL REVEAL ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

/* ── FEATURED CARD ANIMATION (start on scroll) ── */
const featuredObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      featuredObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0 });
const featuredCard = document.querySelector('.service-card--featured');
if (featuredCard) featuredObserver.observe(featuredCard);

/* ── EXPERTISE BARS ── */
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.ec-bar').forEach((bar, i) => {
        setTimeout(() => bar.classList.add('animated'), i * 120);
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.expertise-card').forEach(el => barObserver.observe(el));

/* ── COUNTUP ── */
function animateCountup(el) {
  const target = parseInt(el.getAttribute('data-countup'), 10);
  const suffix = el.getAttribute('data-suffix') || '';
  const duration = 1600;
  const start = performance.now();
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 4);
    const value = Math.round(ease * target);
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCountup(entry.target);
      countObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-countup]').forEach(el => countObserver.observe(el));

/* ── CONTACT FORM ── */
function submitForm(e) {
  e.preventDefault();
  const form = e.target;
  const btn  = form.querySelector('.form-btn');
  const note = form.querySelector('.form-note');

  // Basic validation
  const name  = form.querySelector('#fname').value.trim();
  const email = form.querySelector('#femail').value.trim();
  if (!name || !email) return;

  // Compose mailto
  const subject = form.querySelector('#fsubject').value || 'Γενική Επικοινωνία';
  const phone   = form.querySelector('#fphone').value.trim();
  const msg     = form.querySelector('#fmsg').value.trim();
  const body    = `Ονοματεπώνυμο: ${name}\nΤηλέφωνο: ${phone}\nEmail: ${email}\nΘέμα: ${subject}\n\n${msg}`;

  const mailto = `mailto:info@expertease.eu?subject=${encodeURIComponent('Νέο αίτημα: ' + subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;

  // Feedback
  btn.innerHTML = '<i class="fa-solid fa-check"></i> Ευχαριστώ!';
  btn.style.background = 'var(--green-lt)';
  if (note) note.textContent = 'Θα σας απαντήσουμε σύντομα.';
  setTimeout(() => {
    btn.innerHTML = '<span>Αποστολή</span><i class="fa-solid fa-paper-plane"></i>';
    btn.style.background = '';
  }, 4000);
}

/* ── SMOOTH ANCHOR OFFSET ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── INIT ── */
(function init() {
  applyLang(currentLang);
  onScroll();
})();
