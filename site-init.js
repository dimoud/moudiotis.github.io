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
        T['trust.stat' + n + '.num']   = { el: s.numEl,   en: s.numEn };
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

    // FOOTER
    T['footer.title'] = { el: P.fullTitleEl, en: P.fullTitleEn };

    // NAV BRAND (for language switch)
    if (P.navBrandEl) {
        T['nav.brand'] = { el: P.navBrandEl, en: P.navBrandEn || P.navBrandEl };
    }

    C.translations = T;


    // ── 2. CSS THEME VARIABLES ───────────────────────────────────────────────
    if (C.theme && C.theme.accent) {
        var themeStyle = document.createElement('style');
        themeStyle.textContent =
            ':root { --gold: ' + C.theme.accent + '; --gold2: ' + (C.theme.accentLight || C.theme.accent) + '; }';
        document.head.appendChild(themeStyle);
    }


    // ── 3. META TAGS ─────────────────────────────────────────────────────────
    var savedLang = (typeof localStorage !== 'undefined' && localStorage.getItem('lang')) || C.meta.lang || 'el';
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
        personPhoto.src = C.assets.photo;
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
                '<span class="hbc-text"><span class="hbc-label">Σταθερό</span><span class="hbc-val">' + C.contact.phone + '</span></span>' +
            '</a>' +
            '<a href="' + C.contact.mobileTel + '" class="hbc-item">' +
                '<span class="hbc-icon"><i class="fa-solid fa-mobile-screen-button"></i></span>' +
                '<span class="hbc-text"><span class="hbc-label">Κινητό</span><span class="hbc-val">' + C.contact.mobile + '</span></span>' +
            '</a>' +
            '<a href="mailto:' + C.contact.email + '" class="hbc-item">' +
                '<span class="hbc-icon"><i class="fa-solid fa-envelope"></i></span>' +
                '<span class="hbc-text"><span class="hbc-label">Email</span><span class="hbc-val">' + C.contact.email + '</span></span>' +
            '</a>' +
            '<span class="hbc-item hbc-address">' +
                '<span class="hbc-icon"><i class="fa-solid fa-location-dot"></i></span>' +
                '<span class="hbc-text"><span class="hbc-label">Διεύθυνση</span><span class="hbc-val">' + (C.contact.address || '') + '</span></span>' +
            '</span>';
    }

    // ── 5. NAMES ──────────────────────────────────────────────────────────────
    // Nav brand: use navBrandEl if set, otherwise derive "Β. LASTNAME"
    var navBrandName = document.getElementById('navBrandName');
    if (navBrandName) {
        navBrandName.textContent = P.navBrandEl || (P.firstNameEl.charAt(0) + '. ' + P.lastNameEl);
    }

    // Contact + footer: natural case from config (e.g. "Βάϊος Λιάπης")
    var personName = document.getElementById('personName');
    if (personName) personName.textContent = P.displayNameEl;

    var footerBrandName = document.getElementById('footerBrandName');
    if (footerBrandName) footerBrandName.textContent = P.displayNameEl;

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
        servicesMeas.textContent = sCount + ' \u03A5\u03A0\u0397\u03A1\u0395\u03A3\u0399\u0395\u03A3 \u2014 ' + (sCount * 40).toFixed(2) + ' m\u00B2';
    }

    var projectsMeas = document.getElementById('projectsMeasLabel');
    if (projectsMeas) {
        var pCount = (C.projects || []).length;
        projectsMeas.textContent = pCount + ' \u0395\u03A1\u0393\u0391 \u2014 ' + (pCount * 208).toFixed(2) + ' m\u00B2';
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
                '<i class="fa-solid ' + f.icon + '"></i>' +
                '<strong data-i18n-html="feature.' + n + '.label">' + f.labelEl + '</strong>' +
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
            // h3 and p are wrapped in .service-card-body so they stack (title above description)
            // data-i18n-html used (not data-i18n) so HTML entities like &amp; render correctly
            sHtml +=
                '<div class="service-card" data-reveal>' +
                '<div class="service-num">' + pad + '</div>' +
                '<i class="fa-solid ' + s.icon + ' service-icon"></i>' +
                '<div class="service-card-body">' +
                '<h3 data-i18n-html="s' + n + '.title">' + s.titleEl + '</h3>' +
                '<p data-i18n-html="s' + n + '.text">'   + s.textEl  + '</p>' +
                '</div>' +
                '</div>';
        });
        servicesGrid.innerHTML = sHtml;
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
                '<div class="trust-stat" data-reveal>' +
                '<span class="trust-stat-num" data-i18n="trust.stat' + n + '.num">' + s.numEl + '</span>' +
                '<span class="trust-stat-label" data-i18n="trust.stat' + n + '.label">' + s.labelEl + '</span>' +
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
                '<div class="trust-pillar" data-reveal>' +
                '<div class="trust-pillar-icon"><i class="fa-solid ' + p.icon + '"></i></div>' +
                '<h3 data-i18n-html="trust.p' + n + '.title">' + p.titleEl + '</h3>' +
                '<p data-i18n-html="trust.p' + n + '.text">'   + p.textEl  + '</p>' +
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
                    '<a class="article-card" href="' + (a.url || '#') + '" target="_blank" rel="noopener">' +
                    '<span class="article-cat" data-i18n="art' + n + '.cat">' + a.catEl + '</span>' +
                    '<h4 data-i18n-html="art' + n + '.title">' + a.titleEl + '</h4>' +
                    '<p data-i18n-html="art' + n + '.text">'   + a.textEl  + '</p>' +
                    '</a>';
            });
        });
        articlesTrack.innerHTML = aHtml;
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

    // ── 16. JSON-LD STRUCTURED DATA ───────────────────────────────────────────
    // Injects schema.org LocalBusiness for SEO / rich results
    (function () {
        var ct = C.contact || {};
        var ld = {
            '@context': 'https://schema.org',
            '@graph': [
                {
                    '@type':       'LocalBusiness',
                    'name':        P.displayNameEl || '',
                    'description': C.meta.descriptionEl || '',
                    'telephone':   ct.phone || '',
                    'email':       ct.email || '',
                    'url':         window.location.href,
                    'sameAs':      ct.facebook ? [ct.facebook] : [],
                    'address': {
                        '@type':           'PostalAddress',
                        'streetAddress':   'Λεωφ. Στρατού 1',
                        'addressLocality': 'Πολίχνη',
                        'postalCode':      '564 29',
                        'addressRegion':   'Θεσσαλονίκη',
                        'addressCountry':  'GR'
                    },
                    'geo': {
                        '@type':     'GeoCoordinates',
                        'latitude':  40.671426233509,
                        'longitude': 22.93926462035
                    },
                    'founder': {
                        '@type':    'Person',
                        'name':     P.displayNameEl || '',
                        'jobTitle': P.professionEl  || ''
                    }
                }
            ]
        };
        var s = document.createElement('script');
        s.type = 'application/ld+json';
        s.text = JSON.stringify(ld);
        document.head.appendChild(s);
    })();

    // ── ADD phone placeholder translation ─────────────────────────────────────
    T['form.ph.phone'] = { el: '', en: '' };

    // No re-apply needed: i18n.js runs after this script and sees the fully-rendered DOM.

})();
