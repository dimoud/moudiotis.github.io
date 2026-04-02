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

    /* ─── HELPERS ────────────────────────────────────────────────────────── */
    function $(id) { return document.getElementById(id); }
    function raf(fn) { requestAnimationFrame(fn); }

    /* ─── 1. SCROLL ELEVATION METER ──────────────────────────────────────── */
    var elevMeter = $('scrollElev');
    var elevFill  = $('elevFill');
    var elevDot   = $('elevDot');
    var _lastPct  = -1;

    function updateElevation() {
        if (!elevMeter) return;
        var total = document.documentElement.scrollHeight - window.innerHeight;
        var pct   = total > 0 ? (window.scrollY / total) * 100 : 0;
        if (Math.abs(pct - _lastPct) < 0.1) return;
        _lastPct = pct;

        elevMeter.classList.toggle('show', window.scrollY > 120);
        if (elevFill) elevFill.style.height = pct + '%';
        if (elevDot)  elevDot.style.bottom  = pct + '%';
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
        var total = document.documentElement.scrollHeight - window.innerHeight;
        var pct   = total > 0 ? window.scrollY / total : 0;

        scrollRuler.classList.toggle('show', window.scrollY > 120);
        if (srFill)  srFill.style.width = (pct * 100) + '%';
        if (srValue) srValue.textContent = (pct * RULER_MAX_M).toFixed(3) + ' m';
    }

    /* ─── 6. CALIPER ANIMATION ───────────────────────────────────────────── */
    var calWrap     = $('caliperWrap');
    var calJaw      = $('calJawGroup');
    var calDimLine  = $('calDimLine');
    var calDimTickR = $('calDimTickR');
    var calVal      = $('caliperVal');
    var calSvg      = $('caliperSvg');

    /* Geometry constants (match the SVG viewBox in index.html)
       Left jaw fixed anchor x = 88
       Right jaw group base x  = 350 (path starts M350 ...)
       When group translateX = -262: right jaw tip at x=88 → gap = 0 (closed)
       When group translateX =    0: right jaw tip at x=350 → gap = 262px
       Scale: 262px / 4.235m → each metre ≈ 61.9px
       Max measurement displayed: 4.235 m (262 / 61.9) */
    var CAL_JAW_ORIGIN_X = 350;   /* right jaw body x when group is at 0 */
    var CAL_LEFT_ANCHOR  = 88;    /* left jaw tip x */
    var CAL_MAX_OFFSET   = 262;   /* px when fully open */
    var CAL_PX_PER_M     = CAL_MAX_OFFSET / 4.235;
    var CAL_MAX_M        = 4.235;

    function easeInOut(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    function applyCaliperOffset(offset) {
        /* offset: 0 = closed, CAL_MAX_OFFSET = fully open */
        if (!calJaw) return;
        calJaw.style.transform = 'translateX(' + (-CAL_MAX_OFFSET + offset) + 'px)';

        var jawX = CAL_JAW_ORIGIN_X - (CAL_MAX_OFFSET - offset);
        var midX  = (CAL_LEFT_ANCHOR + jawX) / 2;
        var mVal  = (offset / CAL_PX_PER_M).toFixed(3);

        if (calDimLine) {
            calDimLine.setAttribute('x1', CAL_LEFT_ANCHOR);
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

    /* Scroll-driven caliper: opens as element scrolls into view */
    function updateCaliper() {
        if (!calWrap || !calJaw) return;
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

    /* ─── 7. SECTION MEASUREMENT LINES ──────────────────────────────────── */
    var secMeasEls = document.querySelectorAll('[data-sec-meas]');

    if (secMeasEls.length && 'IntersectionObserver' in window) {
        var secObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    e.target.classList.add('ready');
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

    /* ─── 9. REVEAL ON SCROLL ────────────────────────────────────────────── */
    var revealEls = document.querySelectorAll('[data-reveal], [data-reveal-r]');
    if (revealEls.length && 'IntersectionObserver' in window) {
        var revealObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var isServiceCard = entry.target.classList.contains('service-card');
                    var siblings = Array.prototype.filter.call(
                        entry.target.parentElement.children,
                        function (el) {
                            return el.hasAttribute('data-reveal') || el.hasAttribute('data-reveal-r');
                        }
                    );
                    var idx = siblings.indexOf(entry.target);
                    /* Service cards: 90ms stagger — crisp cascade feel.
                       Other elements: 120ms stagger — slower, section-level pacing. */
                    var step = isServiceCard ? 90 : 120;
                    setTimeout(function () {
                        entry.target.classList.add('visible');
                    }, idx * step);
                    revealObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });
        revealEls.forEach(function (el) { revealObs.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add('visible'); });
    }

    /* ─── 0. SCROLL PROGRESS BAR ─────────────────────────────────────────── */
    var progressBar = $('progress');

    function updateProgress() {
        if (!progressBar) return;
        var total = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.width = (total > 0 ? (window.scrollY / total * 100) : 0) + '%';
    }

    /* ─── NAV SCROLL CLASS ───────────────────────────────────────────────── */
    var navEl = document.getElementById('nav');

    function updateNav() {
        if (navEl) navEl.classList.toggle('scrolled', window.scrollY > 60);
    }

    /* ─── BACK TO TOP ────────────────────────────────────────────────────── */
    var backToTop = document.getElementById('backToTop');
    function updateBackToTop() {
        if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 500);
    }

    /* ─── SCROLL SPY — highlight active nav link ─────────────────────────── */
    var spySections = document.querySelectorAll('section[id], header[id]');
    var spyLinks    = document.querySelectorAll('.nav-links a[href^="#"]');
    function updateScrollSpy() {
        var scrollY  = window.scrollY + 140;   /* offset for fixed nav */
        var current  = '';
        spySections.forEach(function (s) {
            if (s.offsetTop <= scrollY) current = s.id;
        });
        spyLinks.forEach(function (a) {
            var href = a.getAttribute('href');
            a.classList.toggle('nav-spy-active', href === '#' + current);
        });
    }

    /* ─── COMBINED SCROLL HANDLER ────────────────────────────────────────── */
    function onScroll() {
        updateElevation();
        updateRuler();
        updateProgress();
        updateNav();
        updateCaliper();
        updateBackToTop();
        updateScrollSpy();
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); /* init */

    /* ─── PUBLIC API ─────────────────────────────────────────────────────── */
    window.EngAnimations = {
        refresh: onScroll,
    };

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

    /* ─── 12. SERVICE CARD 3-D TILT ─────────────────────────────────────── */
    var tiltCards = document.querySelectorAll('.service-card');
    tiltCards.forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
            var rect = card.getBoundingClientRect();
            var cx   = rect.left + rect.width  / 2;
            var cy   = rect.top  + rect.height / 2;
            var dx   = (e.clientX - cx) / (rect.width  / 2);  /* -1 … 1 */
            var dy   = (e.clientY - cy) / (rect.height / 2);
            var rx   = -dy * 6;   /* tilt up/down */
            var ry   =  dx * 6;   /* tilt left/right */
            card.style.transform = 'perspective(900px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateZ(4px)';
        }, { passive: true });
        card.addEventListener('mouseleave', function () {
            card.style.transform = '';
        });
    });

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
    var statNums = document.querySelectorAll('.trust-stat-num');
    if (statNums.length && 'IntersectionObserver' in window) {
        var statObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var el      = entry.target;
                var text    = el.textContent.trim();
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

})();
