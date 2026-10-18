/**
 * eng-animations.js  v3
 * Civil-engineering themed animations — modular & reusable.
 * Drop into any page with the matching HTML hooks.
 *
 * Features:
 *   0. Scroll Progress Bar      — #progress element filled as user scrolls
 *   1. Scroll Elevation Meter   — vertical rule on the right, scroll progress as elevation
 *   2. Dimension Lines          — [data-dim] elements animate in on scroll entry
 *   3. Hero Crosshair           — floats in hero, fades in on load
 *   4. Hero Measurement Line    — full-width /———— FACADE 24.000 m ————/ in hero
 *   5. Scroll Ruler             — fixed bottom /—value—/ ruler, live scroll-driven
 *   6. Caliper Animation        — SVG caliper opens/closes with live measurement
 *   7. Section Measurement Lines — [data-sec-meas] elements animate on scroll entry
 *   8. Hero Photo Crossfade     — .hero-slide elements crossfade every 10 s
 *   9. Reveal on Scroll         — [data-reveal] / [data-reveal-r] fade+slide in
 *
 * Required HTML hooks (ids / attrs):
 *   #progress
 *   #scrollElev, #elevFill, #elevDot
 *   #crosshairWrap
 *   #heroMeas, #heroMeasLabel
 *   #scrollRuler, #srFill, #srValue, #srTicksRow
 *   #caliperWrap, #calJawGroup, #calDimLine, #calDimTickR, #caliperVal, #caliperSvg
 *   .hero-slide                 — crossfading hero background layers
 *   [data-dim]                  — dimension-line rows
 *   [data-sec-meas]             — section measurement lines
 *   [data-reveal], [data-reveal-r] — scroll-reveal elements
 */

(function () {
    'use strict';
    /* istoselides v2.11 (ΜΗ-01): από εδώ και πέρα επιτρέπεται η κρυφή αρχική κατάσταση των [data-reveal] */
    if (!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) && 'IntersectionObserver' in window)
        document.documentElement.classList.add('anim-ready');

    /* ─── HELPERS ────────────────────────────────────────────────────────── */
    function $(id) { return document.getElementById(id); }
    function raf(fn) { requestAnimationFrame(fn); }
    var root = document.documentElement;
    var reduceMotion = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
    /* istoselides v2.11 (references/15 §Β — ΜΗ-35): στο κινητό και σε οθόνη αφής ΚΑΜΙΑ κίνηση
       δεμένη στη θέση κύλισης — τρέχει στον κύριο νήμα και μένει πίσω από το δάχτυλο. */
    var SCRUB_OK = !(window.matchMedia && matchMedia('(max-width: 768px), (hover: none)').matches);
    /* μετρήσεις διάταξης ΜΙΑ φορά (και σε resize/load/αλλαγή ύψους), όχι σε κάθε καρέ (ΜΗ-36) */
    var _maxScroll = 1;
    function measure() { _maxScroll = Math.max(1, root.scrollHeight - window.innerHeight); }
    measure();
    /* η θέση κύλισης διαβάζεται ΜΙΑ φορά στην αρχή κάθε καρέ (window.scrollY μετά από εγγραφή
       στυλ αναγκάζει νέα διάταξη — ΜΗ-36)· όλες οι συναρτήσεις του καρέ χρησιμοποιούν το Y */
    var Y = window.scrollY;

    /* Παύση κινήσεων εκτός οθόνης (references/15 §Γ5 — ΜΗ-37): οι συνεχείς κινήσεις CSS
       (περιστροφές, πλέγμα, «κόκκος», παλμοί) σταματούν όταν η ενότητά τους δεν φαίνεται —
       αλλιώς ξανασχεδιάζονται σε κάθε καρέ κύλισης. */
    if ('IntersectionObserver' in window) {
        var _zio = new IntersectionObserver(function (es) {
            es.forEach(function (e) { e.target.classList.toggle('anim-off', !e.isIntersecting); });
        }, { rootMargin: '25% 0px 25% 0px' });
        document.querySelectorAll('header.hero, main > section, main > div, footer, .svc-hero').forEach(function (z) { _zio.observe(z); });
    }

    /* ─── 1. SCROLL ELEVATION METER ──────────────────────────────────────── */
    var elevMeter = $('scrollElev');
    var elevFill  = $('elevFill');
    var elevDot   = $('elevDot');
    var _lastPct  = -1;

    function updateElevation() {
        if (!elevMeter) return;
        var pct = Math.min(1, Y / _maxScroll);
        if (Math.abs(pct - _lastPct) < 0.001) return;
        _lastPct = pct;

        elevMeter.classList.toggle('show', Y > 120);
        /* μόνο transform μέσω --p (scaleY / translateY στο CSS) — ΜΗ-04 */
        elevMeter.style.setProperty('--p', pct.toFixed(4));
    }

    /* ─── 2. DIMENSION LINES ─────────────────────────────────────────────── */
    var dimRows = document.querySelectorAll('[data-dim]');

    if (dimRows.length && 'IntersectionObserver' in window) {
        var dimObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) { e.target.classList.add('ready'); dimObs.unobserve(e.target); }
            });
        }, { threshold: 0.25 });
        dimRows.forEach(function (r) { dimObs.observe(r); });
    } else {
        dimRows.forEach(function (r) { r.classList.add('ready'); });
    }

    /* ─── 3. HERO CROSSHAIR ──────────────────────────────────────────────── */
    var crosshair = $('crosshairWrap');
    if (crosshair) setTimeout(function () { crosshair.classList.add('loaded'); }, 600);

    /* ─── 4. HERO MEASUREMENT LINE ───────────────────────────────────────── */
    var heroMeas = $('heroMeas');
    if (heroMeas) setTimeout(function () { heroMeas.classList.add('show'); }, 400);

    /* ─── 5. SCROLL RULER ────────────────────────────────────────────────── */
    var scrollRuler = $('scrollRuler');
    var srFill      = $('srFill');
    var srValue     = $('srValue');
    var srTicksRow  = $('srTicksRow');

    /* Build tick marks once */
    if (srTicksRow) {
        var tickCount = 20;
        for (var i = 0; i <= tickCount; i++) {
            var tick = document.createElement('div');
            tick.className = 'sr-sub' + (i % 5 === 0 ? ' maj' : '');
            srTicksRow.appendChild(tick);
        }
    }

    /* Total "height" represented: 48.000 m (12 floors × 4 m) */
    var RULER_MAX_M = 48.0;

    function updateRuler() {
        if (!scrollRuler) return;
        var pct = Math.min(1, Y / _maxScroll);

        scrollRuler.classList.toggle('show', Y > 120);
        if (srFill)  srFill.style.setProperty('--p', pct.toFixed(4));
        if (srValue) srValue.textContent = (pct * RULER_MAX_M).toFixed(3) + ' m';
    }

    /* ─── 6. CALIPER ANIMATION ───────────────────────────────────────────── */
    var calWrap     = $('caliperWrap');
    var calJaw      = $('calJawGroup');
    var calDimLine  = $('calDimLine');
    var calDimTickR = $('calDimTickR');
    var calVal      = $('caliperVal');
    var calSvg      = $('caliperSvg');

    /* Geometry constants — vertical caliper (SVG viewBox 0 0 72 480)
       Top jaw fixed anchor y = 88
       Bottom jaw group base y = 350 (path starts M18 350 ...)
       When group translateY = -262: bottom jaw tip at y=88 → gap = 0 (closed)
       When group translateY =    0: bottom jaw tip at y=350 → gap = 262px
       Scale: 262px / 4.235m → each metre ≈ 61.9px
       Max measurement displayed: 4.235 m */
    var CAL_JAW_ORIGIN_Y = 350;
    var CAL_TOP_ANCHOR   = 88;
    var CAL_MAX_OFFSET   = 262;
    var CAL_PX_PER_M     = CAL_MAX_OFFSET / 4.235;
    var CAL_MAX_M        = 4.235;
    var CAL_VERTICAL     = !!(calSvg && calSvg.classList.contains('caliper-svg--vertical'));

    function easeInOut(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    function applyCaliperOffset(offset) {
        /* offset: 0 = closed, CAL_MAX_OFFSET = fully open */
        if (!calJaw) return;
        var mVal = (offset / CAL_PX_PER_M).toFixed(3);

        if (CAL_VERTICAL) {
            calJaw.style.transform = 'translateY(' + (-CAL_MAX_OFFSET + offset) + 'px)';
            var jawY = CAL_JAW_ORIGIN_Y - (CAL_MAX_OFFSET - offset);
            var midY = (CAL_TOP_ANCHOR + jawY) / 2;

            if (calDimLine) {
                calDimLine.setAttribute('y1', CAL_TOP_ANCHOR);
                calDimLine.setAttribute('y2', jawY);
                calDimLine.setAttribute('x1', 14);
                calDimLine.setAttribute('x2', 14);
            }
            if (calDimTickR) {
                calDimTickR.setAttribute('y1', jawY - 4);
                calDimTickR.setAttribute('y2', jawY + 4);
                calDimTickR.setAttribute('x1', 10);
                calDimTickR.setAttribute('x2', 18);
            }
            if (calVal) {
                calVal.setAttribute('transform', 'rotate(-90,' + 10 + ',' + midY + ')');
                calVal.setAttribute('y', midY);
                calVal.textContent = mVal + ' m';
            }
        } else {
            calJaw.style.transform = 'translateX(' + (-CAL_MAX_OFFSET + offset) + 'px)';
            var jawX = 350 - (CAL_MAX_OFFSET - offset);
            var midX = (88 + jawX) / 2;
            if (calDimLine) {
                calDimLine.setAttribute('x1', 88);
                calDimLine.setAttribute('x2', jawX);
            }
            if (calDimTickR) {
                calDimTickR.setAttribute('x1', jawX - 2);
                calDimTickR.setAttribute('x2', jawX + 2);
            }
            if (calVal) {
                calVal.setAttribute('x', midX);
                calVal.textContent = mVal + ' m';
            }
        }
    }

    /* Scroll-driven caliper: opens as element scrolls into view */
    function updateCaliper() {
        if (!SCRUB_OK || !calWrap || !calJaw) return;
        var rect  = calWrap.getBoundingClientRect();
        var vh    = window.innerHeight;
        var visible = rect.top < vh && rect.bottom > 0;

        calWrap.classList.toggle('vis', visible);
        if (!visible) return;

        /* pct 0 = just entered bottom, 1 = fully scrolled past */
        var total = vh + rect.height;
        var pct   = Math.max(0, Math.min(1, (vh - rect.top) / total));

        /* open during first 50% of scroll through, hold open after */
        var offset = pct < 0.5
            ? easeInOut(pct / 0.5) * CAL_MAX_OFFSET
            : CAL_MAX_OFFSET;

        applyCaliperOffset(offset);
    }

    /* ─── 6b. MOBILE HORIZONTAL CALIPER ────────────────────────────────── */
    var calMobileWrap    = $('caliperMobileWrap');
    var calMobileJaw     = $('calMobileJawGroup');
    var calMobileDimLine = $('calMobileDimLine');
    var calMobileDimTickR= $('calMobileDimTickR');
    var calMobileVal     = $('caliperMobileVal');

    /* Κινητό: πλάγια όψη τρέιλερ — η διάσταση μήκους «τρέχει» από τον
       κοτσαδόρο (x=40) ως το πίσω άκρο (x=440) και μετρά ως 4.250 m. */
    var TRD_X0 = 40, TRD_SPAN = 400, TRD_MAX_M = 4.25;
    function applyMobileCaliperOffset(offset) {
        if (!calMobileDimLine) return;
        var p = Math.max(0, Math.min(1, offset / CAL_MAX_OFFSET));
        var x = TRD_X0 + TRD_SPAN * p;
        calMobileDimLine.setAttribute('x2', x);
        if (calMobileDimTickR) {
            calMobileDimTickR.setAttribute('x1', x - 4);
            calMobileDimTickR.setAttribute('x2', x + 4);
        }
        if (calMobileVal) {
            calMobileVal.setAttribute('x', (TRD_X0 + x) / 2);
            calMobileVal.textContent = 'L = ' + (TRD_MAX_M * p).toFixed(3) + ' m';
        }
    }

    /* Κινητό / αφή: τα καλίπερ ανοίγουν ΜΙΑ φορά, με χρόνο (1,2 s), όταν μπουν στην οθόνη */
    function openOnce(wrap, apply) {
        if (!wrap) return;
        function go() {
            wrap.classList.add('vis');
            if (reduceMotion) { apply(CAL_MAX_OFFSET); return; }
            var t0 = null;
            requestAnimationFrame(function step(ts) {
                if (t0 === null) t0 = ts;
                var k = Math.min(1, (ts - t0) / 1200);
                apply(easeInOut(k) * CAL_MAX_OFFSET);
                if (k < 1) requestAnimationFrame(step);
            });
        }
        if (!('IntersectionObserver' in window)) { go(); return; }
        var io = new IntersectionObserver(function (es) {
            if (es[0].isIntersecting) { io.disconnect(); go(); }
        }, { rootMargin: '0px 0px -10% 0px' });
        io.observe(wrap);
    }
    if (!SCRUB_OK) {
        if (calJaw) openOnce(calWrap, applyCaliperOffset);
        if (calMobileDimLine) openOnce(calMobileWrap, applyMobileCaliperOffset);
    }

    function updateMobileCaliper() {
        if (!SCRUB_OK || !calMobileWrap || !calMobileDimLine) return;
        var rect    = calMobileWrap.getBoundingClientRect();
        var vh      = window.innerHeight;
        var visible = rect.top < vh && rect.bottom > 0;

        calMobileWrap.classList.toggle('vis', visible);
        if (!visible) return;

        var total  = vh + rect.height;
        var pct    = Math.max(0, Math.min(1, (vh - rect.top) / total));
        var offset = pct < 0.5
            ? easeInOut(pct / 0.5) * CAL_MAX_OFFSET
            : CAL_MAX_OFFSET;

        applyMobileCaliperOffset(offset);
    }

    /* ─── 7. SECTION MEASUREMENT LINES ──────────────────────────────────── */
    var secMeasEls = document.querySelectorAll('[data-sec-meas]');

    /* Animated number count-up for services measurement label */
    function animateServicesMeasLabel(el) {
        var finalText = el.textContent.trim(); /* e.g. "8 ΥΠΗΡΕΣΙΕΣ — 320.00 m²" */
        /* Extract numeric value at end (m²) */
        var m2Match = finalText.match(/([\d.,]+)\s*m²/);
        if (!m2Match) return;
        var finalVal = parseFloat(m2Match[1].replace(',', '.'));
        var prefix   = finalText.split('—')[0].trim(); /* "8 ΥΠΗΡΕΣΙΕΣ" */
        var dur      = 3000; /* ms — slow */
        var start    = null;

        function tick(ts) {
            if (!start) start = ts;
            var pct    = Math.min(1, (ts - start) / dur);
            var eased  = pct < 0.5 ? 2 * pct * pct : -1 + (4 - 2 * pct) * pct;
            var cur    = (eased * finalVal).toFixed(2);
            el.textContent = prefix + ' — ' + cur + ' m²';
            if (pct < 1) requestAnimationFrame(tick);
            else el.textContent = finalText;
        }
        /* Delay to sync with label CSS opacity transition (2.2s) */
        setTimeout(function () { requestAnimationFrame(tick); }, 2200);
    }

    if (secMeasEls.length && 'IntersectionObserver' in window) {
        var secObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    e.target.classList.add('ready');
                    /* Animate the services measurement label count */
                    var lbl = e.target.querySelector('.sec-meas-label') ||
                              document.getElementById('servicesMeasLabel');
                    if (lbl) animateServicesMeasLabel(lbl);
                    secObs.unobserve(e.target);
                }
            });
        }, { threshold: 0.3 });
        secMeasEls.forEach(function (el) { secObs.observe(el); });
    } else {
        secMeasEls.forEach(function (el) { el.classList.add('ready'); });
    }

    /* ─── 8. HERO PHOTO CROSSFADE ────────────────────────────────────────── */
    var heroSlides = document.querySelectorAll('.hero-slide');
    if (heroSlides.length > 1) {
        var _currentSlide = 0;
        setInterval(function () {
            heroSlides[_currentSlide].classList.remove('active');
            _currentSlide = (_currentSlide + 1) % heroSlides.length;
            heroSlides[_currentSlide].classList.add('active');
        }, 10000);
    }

    /* ─── 9. REVEAL ON SCROLL v2 (references/15 §Α — ΜΗ-34) ───────────────
       · ξεκινά ΠΡΙΝ μπει στην οθόνη (rootMargin +12%, κατώφλι 0) — πριν: -15% και 18%
       · CSS animation στην ιδιότητα translate (όχι transition): κανένας άλλος κανόνας
         transition δεν την ακυρώνει (οι κάρτες υπηρεσιών εμφανίζονταν χωρίς σβήσιμο)
       · κλιμάκωση ΜΟΝΟ ανάμεσα σε όσα μπαίνουν μαζί: 60 ms, έως 2 βήματα, καθόλου σε γρήγορη
         κύλιση — πριν: θέση στο DOM × 120 ms και 180 ms ανά σειρά καρτών (έως 0,9 s)
       · ό,τι φαίνεται ήδη στη φόρτωση: χωρίς κίνηση (rv-now) */
    function revealInit(sel) {
        var els = Array.prototype.slice.call(document.querySelectorAll(sel));
        if (!els.length) return;
        if (!root.classList.contains('anim-ready')) {
            els.forEach(function (el) { el.classList.add('visible'); });
            return;
        }
        var lastY = Y, lastT = performance.now();
        var io = new IntersectionObserver(function (entries) {
            var now = performance.now(), y = Y;   /* Y του τελευταίου καρέ — καμία νέα ανάγνωση */
            var fast = Math.abs(y - lastY) / Math.max(1, now - lastT) > 1.2;   /* px/ms */
            lastY = y; lastT = now;
            entries.filter(function (e) { return e.isIntersecting; })
                .sort(function (p, q) { return p.boundingClientRect.top - q.boundingClientRect.top; })
                .forEach(function (e, k) {
                    var el = e.target;
                    el.style.setProperty('--rv-delay', (fast ? 0 : Math.min(k, 2) * 60) + 'ms');
                    el.classList.add('visible');
                    io.unobserve(el);
                });
        }, { rootMargin: '0px 0px 12% 0px', threshold: 0 });   /* ΜΗ-34: ξεκινά πριν μπει στην οθόνη */
        var vh = window.innerHeight;
        els.forEach(function (el) {
            var r = el.getBoundingClientRect();
            if (r.top < vh && r.bottom > 0) el.classList.add('visible', 'rv-now');
            else io.observe(el);
        });
    }

    /* ─── 9b. SERVICE CARD "ZIPPER" SCROLL-SCRUB ─────────────────────────────
       Ties the odd/even service cards' slide-in directly to scroll position
       (instead of the one-shot reveal above), so left/right cards visibly
       converge toward the middle as the user scrolls down — like a zipper
       closing. Runs on all screen sizes (.services-grid stays two columns
       down to mobile — see styles.css). Skipped only for reduced-motion
       users, in which case the one-shot reveal above still applies normally. */
    (function () {
        if (reduceMotion) return;   /* φερμουάρ και στο κινητό (επιλογή του πελάτη)· γεωμετρία από μνήμης, μόνο scrollY ανά καρέ */

        var zipCards = document.querySelectorAll(
            '.service-card--odd[data-reveal], .service-card--even[data-reveal]'
        );
        if (!zipCards.length) return;

        zipCards.forEach(function (card) { card.classList.add('service-card--zipper-js'); });

        var maxOffset = zipOffset();

        function zipOffset() { return window.innerWidth <= 768 ? window.innerWidth * 0.32 : Math.min(260, Math.max(40, window.innerWidth * 0.18)); }
        function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

        /* Η κατεύθυνση βγαίνει από τη ΘΕΣΗ της κάρτας στο πλέγμα, όχι από τη
           σειρά της: μετά την κάρτα-στόχο που πιάνει όλο το πλάτος, οι μονές/
           ζυγές κλάσεις δεν αντιστοιχούν πια σε αριστερή/δεξιά στήλη και οι
           κάρτες έρχονταν από τη λάθος πλευρά, η μία πάνω στην άλλη.
           Κάρτα σε όλο το πλάτος (υπολογιστής) = μόνο εμφάνιση, χωρίς ολίσθηση·
           μία στήλη (κινητό) = εναλλάξ αριστερά/δεξιά. */
        var dirs = [];
        function computeDirs() {
            var alt = 0;
            /* μέτρηση χωρίς το τρέχον transform — όλες μαζί: ένας υπολογισμός ύφους, όχι 2 ανά κάρτα */
            var tfs = [], rs = [], gs = [];
            zipCards.forEach(function (card, i) { tfs[i] = card.style.transform; card.style.transform = 'none'; });
            zipCards.forEach(function (card, i) { rs[i] = card.getBoundingClientRect(); gs[i] = card.parentElement.getBoundingClientRect(); });
            zipCards.forEach(function (card, i) { card.style.transform = tfs[i]; });
            zipCards.forEach(function (card, i) {
                var grid = gs[i], r = rs[i];
                var full = r.width > grid.width * 0.7;
                var small = window.innerWidth <= 768;
                /* Κάρτα σε όλο το πλάτος: στον υπολογιστή μόνο εμφάνιση, στο
                   κινητό εναλλάξ. Δύο στήλες (και στο κινητό): η αριστερή
                   έρχεται από αριστερά, η δεξιά από δεξιά — κλείνουν στο
                   κέντρο σαν φερμουάρ. */
                if (full) { dirs[i] = small ? ((alt++ % 2 === 0) ? -1 : 1) : 0; return; }
                var cc = r.left + r.width / 2, gc = grid.left + grid.width / 2;
                /* μεσαία στήλη (τρεις στήλες): μόνο εμφάνιση, χωρίς ολίσθηση */
                if (Math.abs(cc - gc) < grid.width * 0.08) { dirs[i] = 0; return; }
                dirs[i] = cc < gc ? -1 : 1;
            });
        }
        computeDirs();
        /* θέσεις των καρτών στη σελίδα: μία μέτρηση (και σε resize/load/αλλαγή μεγέθους) — ανά καρέ μόνο scrollY */
        var tops = [];
        function measureTops() {
            var tfs = [], y = window.scrollY;
            zipCards.forEach(function (card, i) { tfs[i] = card.style.transform; card.style.transform = 'none'; });
            zipCards.forEach(function (card, i) { tops[i] = card.getBoundingClientRect().top + y; });
            zipCards.forEach(function (card, i) { card.style.transform = tfs[i]; });
        }
        measureTops();
        window.addEventListener('resize', function () { maxOffset = zipOffset(); computeDirs(); measureTops(); onScroll(); });
        window.addEventListener('load', function () { measureTops(); onScroll(); });
        if ('ResizeObserver' in window) new ResizeObserver(function () { measureTops(); onScroll(); }).observe(zipCards[0].parentElement);

        function updateZipper() {
            var vh    = window.innerHeight, sy = window.scrollY;
            var start = vh;         /* card top at viewport bottom  → progress 0 */
            var end   = vh * 0.55;  /* card top at 55% up viewport  → progress 1 */
            zipCards.forEach(function (card, i) {
                var top = tops[i] - sy;
                var progress = clamp01((start - top) / (start - end));
                var dir = dirs[i] || 0;
                card.style.opacity   = progress.toFixed(3);
                card.style.transform = 'translateX(' + ((1 - progress) * dir * maxOffset).toFixed(1) + 'px)';
            });
        }

        var ticking = false;
        function onScroll() {
            if (ticking) return;
            ticking = true;
            raf(function () { updateZipper(); ticking = false; });
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        updateZipper();
    })();

    /* εμφάνιση v2: μετά το φερμουάρ, ώστε οι κάρτες του να εξαιρούνται */
    revealInit('[data-reveal]:not(.service-card--zipper-js), [data-reveal-r]');

    /* ─── 0. SCROLL PROGRESS BAR ─────────────────────────────────────────── */
    var progressBar = $('progress');

    function updateProgress() {
        if (!progressBar) return;
        progressBar.style.transform = 'scaleX(' + Math.min(1, Y / _maxScroll).toFixed(4) + ')';
    }

    /* ─── NAV SCROLL CLASS ───────────────────────────────────────────────── */
    var navEl = document.getElementById('nav');

    function updateNav() {
        if (navEl) navEl.classList.toggle('scrolled', Y > 60);
    }

    /* ─── BACK TO TOP ────────────────────────────────────────────────────── */
    var backToTop = document.getElementById('backToTop');
    function updateBackToTop() {
        if (backToTop) backToTop.classList.toggle('visible', Y > 500);
    }

    /* ─── SCROLL SPY — highlight active nav link ─────────────────────────── */
    var spySections = document.querySelectorAll('section[id], header[id]');
    var spyLinks    = document.querySelectorAll('.nav-links a[href^="#"]');
    var spyTops = [];
    function measureSpy() { spyTops = Array.prototype.map.call(spySections, function (s) { return s.offsetTop; }); }
    measureSpy();
    var _spyLast = null;
    function updateScrollSpy() {
        var scrollY  = Y + 140;   /* offset for fixed nav */
        var current  = '';
        spyTops.forEach(function (t, i) {
            if (t <= scrollY) current = spySections[i].id;
        });
        if (current === _spyLast) return;
        _spyLast = current;
        spyLinks.forEach(function (a) {
            var href = a.getAttribute('href');
            a.classList.toggle('nav-spy-active', href === '#' + current);
        });
    }

    /* ─── COMBINED SCROLL HANDLER ────────────────────────────────────────── */
    var _subs = [];
    /* κοινό καρέ κύλισης για τα άλλα σενάρια (hm-steps, nav-dd): ScrollFrame.add(function (y) {…}) */
    window.ScrollFrame = { add: function (fn) { _subs.push(fn); onScroll(); } };
    function update() {
        Y = window.scrollY;       /* ΜΙΑ ανάγνωση, πριν από κάθε εγγραφή */
        updateCaliper();          /* ΠΡΩΤΑ οι αναγνώσεις (getBoundingClientRect) — ΜΗ-36 */
        updateMobileCaliper();
        updateElevation();
        updateRuler();
        updateProgress();
        updateNav();
        updateBackToTop();
        updateScrollSpy();
        for (var i = 0; i < _subs.length; i++) _subs[i](Y);
    }
    /* ένας ακροατής, ένα καρέ (πριν: όλα σε ΚΑΘΕ γεγονός κύλισης, με width/height/bottom) */
    var _ticking = false;
    function onScroll() {
        if (_ticking) return;
        _ticking = true;
        requestAnimationFrame(function () { update(); _ticking = false; });
    }
    function remeasure() { measure(); measureSpy(); onScroll(); }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', remeasure, { passive: true });
    window.addEventListener('load', remeasure);
    if ('ResizeObserver' in window) new ResizeObserver(function () { measure(); measureSpy(); }).observe(document.body);
    update(); /* init */

    /* ─── PUBLIC API ─────────────────────────────────────────────────────── */
    window.EngAnimations = {
        refresh: onScroll,
    };

    /* ─── ARTICLES CAROUSEL — AUTO-SCROLL + DRAG ────────────────────── */
    (function () {
        var band  = document.querySelector('.articles-band');
        var track = document.getElementById('articlesTrack');
        if (!band || !track) return;

        /* Use JS scroll instead of CSS transform animation */
        band.style.overflowX  = 'scroll';
        band.style.cursor     = 'grab';
        track.style.animation = 'none';
        track.style.transform = 'none';

        /* Auto-scroll speed: ~0.5px per frame at 60fps ≈ 30px/s (very slow) */
        var SPEED      = 0.5;
        var isDown     = false;
        var isDragging = false;
        var paused     = false;
        var startX     = 0;
        var scrollLeft = 0;
        var half       = 0;

        /* Initialise: start at first duplicate boundary */
        setTimeout(function () {
            half = track.scrollWidth / 2;
            band.scrollLeft = 0;
            startAutoScroll();
        }, 80);

        /* ── Auto-scroll RAF loop ── */
        /* istoselides v2.11: το μισό πλάτος μετριέται μία φορά (και σε αλλαγή μεγέθους), όχι σε κάθε
           καρέ — η ανάγνωση scrollWidth μετά από εγγραφή scrollLeft επέβαλλε διάταξη 60 φορές/δευτ.
           Η λωρίδα τρέχει μόνο όταν φαίνεται. */
        var visible = true, pos = -1;
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }, { rootMargin: '200px 0px' }).observe(band);
        }
        window.addEventListener('resize', function () { half = track.scrollWidth / 2; });
        if ('ResizeObserver' in window) new ResizeObserver(function () { half = track.scrollWidth / 2; }).observe(track);
        function startAutoScroll() {
            function tick() {
                if (visible && !paused && !isDown && half > 0) {
                    /* θέση σε μεταβλητή: μόνο εγγραφή scrollLeft, καμία ανάγνωση ανά καρέ (ΜΗ-36) */
                    if (pos < 0) pos = band.scrollLeft;
                    pos += SPEED; if (pos >= half) pos -= half;
                    band.scrollLeft = pos;
                } else pos = -1;   /* σύρσιμο ή παύση: ξαναδιαβάζεται όταν συνεχίσει */
                requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
        }

        /* ── Mouse drag ── */
        band.addEventListener('mousedown', function (e) {
            isDown = true; isDragging = false;
            band.style.cursor = 'grabbing';
            startX     = e.pageX - band.offsetLeft;
            scrollLeft = band.scrollLeft;
            e.preventDefault();
        });
        band.addEventListener('mouseleave', function () { isDown = false; band.style.cursor = 'grab'; });
        band.addEventListener('mouseup',    function () { isDown = false; isDragging = false; band.style.cursor = 'grab'; });
        band.addEventListener('mousemove',  function (e) {
            if (!isDown) return;
            isDragging = true;
            e.preventDefault();
            var x    = e.pageX - band.offsetLeft;
            var walk = (x - startX) * 1.6;
            band.scrollLeft = scrollLeft - walk;
            /* Seamless loop while dragging */
            if (band.scrollLeft >= track.scrollWidth / 2)  band.scrollLeft -= track.scrollWidth / 2;
            if (band.scrollLeft < 0) band.scrollLeft += track.scrollWidth / 2;
        });

        /* Pause on hover (desktop) */
        band.addEventListener('mouseenter', function () { paused = true; });
        band.addEventListener('mouseleave', function () { paused = false; });

        /* ── Touch swipe ── */
        var touchStartX     = 0;
        var touchScrollLeft = 0;
        band.addEventListener('touchstart', function (e) {
            touchStartX     = e.touches[0].pageX;
            touchScrollLeft = band.scrollLeft;
            paused = true;
        }, { passive: true });
        band.addEventListener('touchmove', function (e) {
            var diff = touchStartX - e.touches[0].pageX;
            band.scrollLeft = touchScrollLeft + diff;
            if (band.scrollLeft >= track.scrollWidth / 2)  band.scrollLeft -= track.scrollWidth / 2;
            if (band.scrollLeft < 0) band.scrollLeft += track.scrollWidth / 2;
        }, { passive: true });
        band.addEventListener('touchend', function () {
            setTimeout(function () { paused = false; }, 800);
        }, { passive: true });
    })();

    /* ─── REVIEWS CAROUSEL — AUTO-SCROLL + DRAG ─────────────────────── */
    (function () {
        var band  = document.getElementById('reviewsBand');
        var track = document.getElementById('reviewsTrack');
        if (!band || !track) return;

        band.style.overflowX = 'scroll';
        band.style.cursor    = 'grab';

        /* ~1.2px/frame ≈ 72px/s — fast enough to read as a moving carousel */
        var SPEED      = 1.2;
        var isDown     = false;
        var paused     = false;
        var startX     = 0;
        var scrollLeft = 0;

        setTimeout(function () {
            band.scrollLeft = 0;
            startAutoScroll();
        }, 80);

        /* istoselides v2.11: μισό πλάτος σε μνήμη, λωρίδα μόνο όταν φαίνεται (όπως παραπάνω) */
        var half2 = 0, visible2 = true, pos2 = -1, expanded = false;
        /* «ανοιχτή κριτική»: κλάση που αλλάζει σπάνια — παρακολουθείται, όχι querySelector σε κάθε καρέ */
        if ('MutationObserver' in window) new MutationObserver(function () {
            expanded = !!track.querySelector('.review-card.is-expanded');
        }).observe(track, { attributes: true, subtree: true, attributeFilter: ['class'] });
        function measure2() { half2 = track.scrollWidth / 2; }
        if ('ResizeObserver' in window) new ResizeObserver(measure2).observe(track);
        window.addEventListener('resize', measure2);
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (en) { visible2 = en[0].isIntersecting; }, { rootMargin: '200px 0px' }).observe(band);
        }
        function startAutoScroll() {
            measure2();
            function tick() {
                /* όσο μια κριτική είναι ανοιχτή, η ταινία σταματά για να διαβαστεί */
                if (visible2 && half2 > 0 && !paused && !isDown && !expanded) {
                    if (pos2 < 0) pos2 = band.scrollLeft;
                    pos2 += SPEED; if (pos2 >= half2) pos2 -= half2;
                    band.scrollLeft = pos2;
                } else pos2 = -1;
                requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
        }

        band.addEventListener('mousedown', function (e) {
            isDown = true;
            band.style.cursor = 'grabbing';
            startX     = e.pageX - band.offsetLeft;
            scrollLeft = band.scrollLeft;
            e.preventDefault();
        });
        band.addEventListener('mouseleave', function () { isDown = false; band.style.cursor = 'grab'; });
        band.addEventListener('mouseup',    function () { isDown = false; band.style.cursor = 'grab'; });
        band.addEventListener('mouseenter', function () { paused = true; });
        band.addEventListener('mouseleave', function () { paused = false; });
        band.addEventListener('mousemove',  function (e) {
            if (!isDown) return;
            e.preventDefault();
            var x    = e.pageX - band.offsetLeft;
            var walk = (x - startX) * 1.6;
            band.scrollLeft = scrollLeft - walk;
            if (band.scrollLeft >= track.scrollWidth / 2) band.scrollLeft -= track.scrollWidth / 2;
            if (band.scrollLeft < 0) band.scrollLeft += track.scrollWidth / 2;
        });

        var touchStartX     = 0;
        var touchScrollLeft = 0;
        band.addEventListener('touchstart', function (e) {
            touchStartX     = e.touches[0].pageX;
            touchScrollLeft = band.scrollLeft;
            paused = true;
        }, { passive: true });
        band.addEventListener('touchmove', function (e) {
            var diff = touchStartX - e.touches[0].pageX;
            band.scrollLeft = touchScrollLeft + diff;
            if (band.scrollLeft >= track.scrollWidth / 2) band.scrollLeft -= track.scrollWidth / 2;
            if (band.scrollLeft < 0) band.scrollLeft += track.scrollWidth / 2;
        }, { passive: true });
        band.addEventListener('touchend', function () {
            setTimeout(function () { paused = false; }, 800);
        }, { passive: true });
    })();

    /* ─── 12. CRANE ANIMATIONS ───────────────────────────────────────────────── */
    var CRANE_DRAW_MS  = 3600;  /* draw duration (matches CSS 3.6s) */
    var CRANE_HOLD_MS  = 4000;  /* pause after fully drawn */
    var CRANE_ERASE_MS = 1800;  /* erase duration */
    var CRANE_GAP_MS   = 600;   /* pause before redrawing */

    function startCraneLoop(col) {
        var paths = col.querySelectorAll('.crane-path');
        /* v2.15: μειωμένη κίνηση → τελική εικόνα· εκτός κάδρου ή σε κρυφή καρτέλα → παύση (ΜΗ-37) */
        var craneReduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
        /* pick whichever stamp lives inside this column */
        var stamp = col.querySelector('#craneStamp, #craneStampMobile');
        /* pivot and final transform differ per instance */
        var isMobile = !!col.querySelector('#craneStampMobile');
        var pivot    = isMobile ? 'rotate(-15,189,110)' : 'rotate(-15,220,160)';

        function applyStagger(draw) {
            paths.forEach(function (p, i) {
                /* stagger draw forward, stagger erase in reverse */
                var idx   = draw ? i : (paths.length - 1 - i);
                var delay = idx * 0.032;
                p.style.transition      = 'stroke-dashoffset ' + (draw ? 3.6 : 1.4) + 's cubic-bezier(0.4,0,0.2,1)';
                p.style.transitionDelay = delay + 's';
            });
        }

        function showStamp() {
            if (!stamp) return;
            stamp.style.transition = 'none';
            stamp.style.opacity = '0';
            stamp.setAttribute('transform', pivot + ' scale(0.55) translate(176,80)');
            void stamp.getBoundingClientRect();
            stamp.style.transition = 'opacity 0.45s ease, transform 0.45s cubic-bezier(0.34,1.56,0.64,1)';
            stamp.style.opacity = '1';
            stamp.setAttribute('transform', pivot);
        }

        function hideStamp() {
            if (!stamp) return;
            stamp.style.transition = 'opacity 0.3s ease';
            stamp.style.opacity = '0';
        }

        function drawIn() {
            hideStamp();
            applyStagger(true);
            col.classList.add('crane-draw');
            /* show stamp after draw completes */
            setTimeout(showStamp, CRANE_DRAW_MS + 400);
            /* after draw + hold, erase */
            setTimeout(eraseOut, CRANE_DRAW_MS + CRANE_HOLD_MS);
        }

        function eraseOut() {
            if (col.__craneInView === false || document.hidden) { col.__craneResume = eraseOut; return; }
            applyStagger(false);
            col.classList.remove('crane-draw');
            /* after erase + gap, draw again */
            setTimeout(drawIn, CRANE_ERASE_MS + CRANE_GAP_MS);
        }

        if (craneReduced) {
            paths.forEach(function (p) { p.style.transition = 'none'; });
            col.classList.add('crane-draw');
            if (stamp) { stamp.style.transition = 'none'; stamp.style.opacity = '1'; stamp.setAttribute('transform', pivot); }
            return;
        }
        drawIn();
    }

    /* Trust section — start loop on scroll entry */
    var trustCraneCol = $('trustCraneCol');
    if (trustCraneCol && 'IntersectionObserver' in window) {
        var craneObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                trustCraneCol.__craneInView = e.isIntersecting;
                if (e.isIntersecting && !trustCraneCol.__craneStarted) {
                    trustCraneCol.__craneStarted = true;
                    startCraneLoop(trustCraneCol);
                } else if (e.isIntersecting && trustCraneCol.__craneResume) {
                    var r = trustCraneCol.__craneResume; trustCraneCol.__craneResume = null; r();
                }
            });
        }, { threshold: 0.15 });
        craneObs.observe(trustCraneCol);
    }

    /* Hero mobile — start loop after page load */
    var heroCraneMobile = $('heroCraneMobile');
    /* v2.15: μόνο αν φαίνεται — από τη v2.14 είναι display:none σε όλα τα πλάτη */
    if (heroCraneMobile && heroCraneMobile.getClientRects().length) {
        heroCraneMobile.classList.add('crane-ready');
        setTimeout(function () { startCraneLoop(heroCraneMobile); }, 700);
    }

    /* ─── 11. HERO CURSOR SPOTLIGHT ──────────────────────────────────────── */
    var heroEl       = document.querySelector('.hero');
    var spotlightEl  = document.querySelector('.hero-spotlight');
    if (heroEl && spotlightEl) {
        heroEl.addEventListener('mousemove', function (e) {
            var rect = heroEl.getBoundingClientRect();
            heroEl.style.setProperty('--cx', (e.clientX - rect.left) + 'px');
            heroEl.style.setProperty('--cy', (e.clientY - rect.top)  + 'px');
        }, { passive: true });
        heroEl.addEventListener('mouseleave', function () {
            heroEl.style.setProperty('--cx', '-100%');
            heroEl.style.setProperty('--cy', '-100%');
        });
    }

    /* 3D tilt removed */

    /* ─── 13. MAGNETIC BUTTON GLOW ──────────────────────────────────────── */
    var glowBtns = document.querySelectorAll('.nav-cta, .btn-submit');
    glowBtns.forEach(function (btn) {
        btn.addEventListener('mousemove', function (e) {
            var rect = btn.getBoundingClientRect();
            btn.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
            btn.style.setProperty('--my', (e.clientY - rect.top)  + 'px');
        }, { passive: true });
    });

    /* ─── 10. TRUST STAT COUNTER ─────────────────────────────────────────── */
    var statNums = document.querySelectorAll('.trust-stat-num:not([data-count])');
    if (statNums.length && 'IntersectionObserver' in window) {
        var statObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var el      = entry.target;
                var text    = el.textContent.trim();
                /* Βαθμολογία με δεκαδικό (π.χ. «5,0★») δεν μετράει — αλλιώς θα έδειχνε 50 */
                if (/★|^\d[.,]\d\b/.test(text)) { statObs.unobserve(el); return; }
                /* Strip thousands separators (. or ,) before parsing */
                var cleaned = text.replace(/[.,\s]/g, '');
                var num     = parseInt(cleaned, 10);
                if (isNaN(num) || num === 0) { statObs.unobserve(el); return; }
                var suffix  = text.replace(/[\d.,\s]/g, '');
                var dur     = Math.min(1800, 900 + num * 0.04); /* scale to value */
                var start   = performance.now();
                (function tick(now) {
                    var pct    = Math.min(1, (now - start) / dur);
                    var eased  = 1 - Math.pow(1 - pct, 3); /* ease-out cubic */
                    el.textContent = Math.round(eased * num) + suffix;
                    if (pct < 1) {
                        requestAnimationFrame(tick);
                    } else {
                        el.textContent = text; /* restore original formatting */
                    }
                })(start);
                statObs.unobserve(el);
            });
        }, { threshold: 0.4 });
        statNums.forEach(function (el) { statObs.observe(el); });
    }

    /* ─── 10. GRAPHIC PROTECTION ─────────────────────────────────────────────
       Blocks the convenient right-click-save / drag-save on the site's
       original photos and hand-drawn technical sketches (hero photo + the
       rotating logo/sketch stage, the mobile crane stage, the trailer
       diagram photo, the caliper/crane/type-approval illustrations, the
       contact photo). Doesn't stop a screenshot — nothing does — this just
       removes the one-click way to grab a clean copy. Pairs with the
       watermark in styles.css. */
    var PROTECTED_SELECTOR =
        '.hero-photo-wrap, .hero-crane-mobile, .trc-diagram-wrap, ' +
        '.caliper-svg, .crane-svg, #typeApprovalAnimWrap, #personPhoto';

    document.addEventListener('contextmenu', function (e) {
        if (e.target.closest(PROTECTED_SELECTOR)) e.preventDefault();
    });
    document.addEventListener('dragstart', function (e) {
        if (e.target.closest(PROTECTED_SELECTOR)) e.preventDefault();
    });

})();
