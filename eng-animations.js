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

    /* ─── 6b. MOBILE HORIZONTAL CALIPER ────────────────────────────────── */
    var calMobileWrap    = $('caliperMobileWrap');
    var calMobileJaw     = $('calMobileJawGroup');
    var calMobileDimLine = $('calMobileDimLine');
    var calMobileDimTickR= $('calMobileDimTickR');
    var calMobileVal     = $('caliperMobileVal');

    function applyMobileCaliperOffset(offset) {
        if (!calMobileJaw) return;
        var mVal = (offset / CAL_PX_PER_M).toFixed(3);
        calMobileJaw.style.transform = 'translateX(' + (-CAL_MAX_OFFSET + offset) + 'px)';
        var jawX = 350 - (CAL_MAX_OFFSET - offset);
        var midX = (88 + jawX) / 2;
        if (calMobileDimLine) {
            calMobileDimLine.setAttribute('x1', 88);
            calMobileDimLine.setAttribute('x2', jawX);
            calMobileDimLine.setAttribute('y1', 14);
            calMobileDimLine.setAttribute('y2', 14);
        }
        if (calMobileDimTickR) {
            calMobileDimTickR.setAttribute('x1', jawX - 4);
            calMobileDimTickR.setAttribute('x2', jawX + 4);
            calMobileDimTickR.setAttribute('y1', 10);
            calMobileDimTickR.setAttribute('y2', 18);
        }
        if (calMobileVal) {
            calMobileVal.setAttribute('x', midX);
            calMobileVal.textContent = mVal + ' m';
        }
    }

    function updateMobileCaliper() {
        if (!calMobileWrap || !calMobileJaw) return;
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

    /* ─── 9. REVEAL ON SCROLL ────────────────────────────────────────────── */
    var revealEls    = document.querySelectorAll('[data-reveal]:not(.service-card), [data-reveal-r]');
    var serviceCards = document.querySelectorAll('.service-card[data-reveal]');

    function makeRevealHandler(isServiceCard) {
        return function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var siblings = Array.prototype.filter.call(
                        entry.target.parentElement.children,
                        function (el) {
                            return el.hasAttribute('data-reveal') || el.hasAttribute('data-reveal-r');
                        }
                    );
                    var idx = siblings.indexOf(entry.target);
                    var delay;
                    if (isServiceCard) {
                        /* Stagger by row (pairs of 2), 180ms per row */
                        var row = Math.floor(idx / 2);
                        delay = row * 180;
                    } else {
                        delay = idx * 120;
                    }
                    setTimeout(function () {
                        entry.target.classList.add('visible');
                    }, delay);
                    this.unobserve(entry.target);
                }
            }.bind(this));
        };
    }

    if ('IntersectionObserver' in window) {
        /* General reveal — fires early (8% visible) */
        if (revealEls.length) {
            var revealObs = new IntersectionObserver(makeRevealHandler(false), { threshold: 0.08 });
            revealEls.forEach(function (el) { revealObs.observe(el); });
        }

        /* Service cards — fire only after user has scrolled well into the section:
           rootMargin "-20% 0px -10% 0px" means the trigger zone is the middle 70%
           of the viewport, so cards won't animate until they're clearly on screen. */
        if (serviceCards.length) {
            var serviceObs = new IntersectionObserver(makeRevealHandler(true), {
                threshold: 0.18,
                rootMargin: '-15% 0px -15% 0px'
            });
            serviceCards.forEach(function (el) { serviceObs.observe(el); });
        }
    } else {
        document.querySelectorAll('[data-reveal], [data-reveal-r]').forEach(function (el) {
            el.classList.add('visible');
        });
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
        updateMobileCaliper();
        updateBackToTop();
        updateScrollSpy();
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); /* init */

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
        function startAutoScroll() {
            function tick() {
                if (!paused && !isDown) {
                    band.scrollLeft += SPEED;
                    /* Seamless loop: when we've scrolled one full copy, jump back */
                    if (band.scrollLeft >= track.scrollWidth / 2) {
                        band.scrollLeft -= track.scrollWidth / 2;
                    }
                }
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

    /* ─── 12. CRANE ANIMATIONS ───────────────────────────────────────────────── */
    var CRANE_DRAW_MS  = 3600;  /* draw duration (matches CSS 3.6s) */
    var CRANE_HOLD_MS  = 4000;  /* pause after fully drawn */
    var CRANE_ERASE_MS = 1800;  /* erase duration */
    var CRANE_GAP_MS   = 600;   /* pause before redrawing */

    function startCraneLoop(col) {
        var paths = col.querySelectorAll('.crane-path');
        var stamp = col.querySelector('#craneStamp');

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
            stamp.setAttribute('transform', 'rotate(-15,220,170) scale(0.55) translate(176,80)');
            void stamp.getBoundingClientRect();
            stamp.style.transition = 'opacity 0.45s ease, transform 0.45s cubic-bezier(0.34,1.56,0.64,1)';
            stamp.style.opacity = '1';
            stamp.setAttribute('transform', 'rotate(-15,220,170)');
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
            applyStagger(false);
            col.classList.remove('crane-draw');
            /* after erase + gap, draw again */
            setTimeout(drawIn, CRANE_ERASE_MS + CRANE_GAP_MS);
        }

        drawIn();
    }

    /* Trust section — start loop on scroll entry */
    var trustCraneCol = $('trustCraneCol');
    if (trustCraneCol && 'IntersectionObserver' in window) {
        var craneObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    startCraneLoop(trustCraneCol);
                    craneObs.unobserve(trustCraneCol);
                }
            });
        }, { threshold: 0.15 });
        craneObs.observe(trustCraneCol);
    }

    /* Hero mobile — start loop after page load */
    var heroCraneMobile = $('heroCraneMobile');
    if (heroCraneMobile) {
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
