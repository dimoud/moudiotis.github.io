/**
 * type-approval-animation.js
 * SVG sketch animation of a vehicle TYPE APPROVAL dossier.
 *
 * Same technique as trailer-animation.js: every stroke is drawn from zero with a
 * progressive stroke-dashoffset sweep, the document text then fades in, and finally
 * an official round "ΕΓΚΡΙΘΗΚΕ / APPROVED" stamp drops in with a rotate + scale.
 *
 * All text is bilingual: the current language is baked in at inject time and the
 * data-i18n attributes let i18n.js re-translate on every language toggle.
 *
 * Usage: put an empty #typeApprovalAnimWrap in the DOM and load this script after
 * site-init.js and i18n.js, or call TypeApprovalAnim.init() manually.
 */
(function () {
  'use strict';

  /* ── CONFIG ── */
  var DRAW_DURATION = 3400;  // ms total for the sketch sweep
  var TEXT_DELAY    = 220;   // ms after draw completes before text fades in
  var STAMP_DELAY   = 780;   // ms after draw completes before the stamp lands
  var RESTART_DELAY = 9000;  // ms after the stamp is shown before restarting
  var AUTO_RESTART  = true;

  var GOLD  = '#c9a86c';
  var GREEN = '#38a169';

  /* ── TRANSLATION HELPER ──
   * Reads the live translation table built by site-init.js. Falls back to the
   * Greek literal so the sketch is never blank if the table is missing. */
  var FALLBACK = {
    'tap.doc.title':  'ΕΓΚΡΙΣΗ ΤΥΠΟΥ',
    'tap.doc.sub':    'ΤΕΧΝΙΚΟΣ ΦΑΚΕΛΟΣ ΟΧΗΜΑΤΟΣ',
    'tap.doc.field':  'ΑΡ. ΕΓΚΡΙΣΗΣ',
    'tap.doc.chk1':   'ΚΑΤΑΧΩΡΗΣΗ ΣΤΟ ΤΑΟ',
    'tap.doc.chk2':   'ΔΕΛΤΙΟ ΚΟΙΝΟΠΟΙΗΣΗΣ',
    'tap.dim.label':  'ΚΑΤΗΓΟΡΙΕΣ  M1 · N1 · N2 · O1 · O2',
    'tap.stamp.main': 'ΕΓΚΡΙΘΗΚΕ',
    'tap.stamp.sub':  'ΕΓΚΡΙΣΗ ΤΥΠΟΥ',
    'tap.stamp.top':  'e13 · 2018/858',
    'tap.stamp.foot': 'ΥΠ. ΥΠΟΔΟΜΩΝ · ΤΑΟ',
    'tap.graphic.alt':'Σκίτσο φακέλου έγκρισης τύπου οχήματος με σφραγίδα έγκρισης'
  };

  function lang() {
    if (window.I18n && window.I18n.getLang) return window.I18n.getLang();
    return document.documentElement.lang === 'en' ? 'en' : 'el';
  }

  function tr(key) {
    var tbl = (window.SITE_CONFIG && window.SITE_CONFIG.translations) || {};
    var e   = tbl[key];
    if (e && e[lang()] !== undefined) return e[lang()];
    return FALLBACK[key] || '';
  }

  /* Escape for use inside an SVG attribute / text node. */
  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ── INJECT SVG ──
   * viewBox 0 0 820 340 — matches the trailer sketch so both graphics share the
   * same optical weight on the page.
   *
   *   Left  (x  70..430) : the approval document — sheet with a folded corner,
   *                        title block, approval-number field, body text rules
   *                        and two ticked checkboxes (TAO / Notification).
   *   Right (x 465..800) : truck + trailer silhouette over a ground line, with a
   *                        dimension line and the approved vehicle categories.
   *   Stamp              : round official stamp, centred on the right column.
   */
  function buildSVG() {
    var svg = [
      '<svg id="tapSvg" viewBox="0 0 820 340" fill="none"',
      '     xmlns="http://www.w3.org/2000/svg" role="img"',
      '     aria-label="' + esc(tr('tap.graphic.alt')) + '"',
      '     style="width:100%;max-width:820px;overflow:visible;display:block;margin:0 auto">',

      /* ─── GROUP: all sketch strokes ─── */
      '<g id="tapSketch" stroke="' + GOLD + '" stroke-linecap="round" stroke-linejoin="round" fill="none">',

      /* 1. DOCUMENT SHEET — outline with a folded top-right corner */
      '<path class="tap-p" d="M70 30 L370 30 L430 90 L430 310 L70 310 Z" stroke-width="4"/>',
      '<path class="tap-p" d="M370 30 L370 90 L430 90" stroke-width="2.5"/>',

      /* 2. TITLE BLOCK RULE */
      '<path class="tap-p" d="M100 106 L400 106" stroke-width="2.5"/>',

      /* 3. APPROVAL NUMBER FIELD */
      '<path class="tap-p" d="M100 132 L400 132 L400 172 L100 172 Z" stroke-width="2"/>',

      /* 4. BODY TEXT RULES */
      '<path class="tap-p" d="M100 194 L400 194" stroke-width="1.8"/>',
      '<path class="tap-p" d="M100 212 L342 212" stroke-width="1.8"/>',
      '<path class="tap-p" d="M100 230 L400 230" stroke-width="1.8"/>',

      /* 5. CHECKBOXES + THEIR TICKS */
      '<path class="tap-p" d="M100 246 L114 246 L114 260 L100 260 Z" stroke-width="2"/>',
      '<path class="tap-p" d="M103 253 L106.5 257 L111.5 249" stroke-width="2.4" stroke="' + GREEN + '"/>',
      '<path class="tap-p" d="M100 272 L114 272 L114 286 L100 286 Z" stroke-width="2"/>',
      '<path class="tap-p" d="M103 279 L106.5 283 L111.5 275" stroke-width="2.4" stroke="' + GREEN + '"/>',

      /* 6. TRUCK — cab, box body, wheels */
      '<path class="tap-p" d="M500 122 L500 74 L530 74 L548 98 L548 122" stroke-width="3.5"/>',
      '<path class="tap-p" d="M553 122 L553 56 L648 56 L648 122" stroke-width="3.5"/>',
      '<path class="tap-p" d="M563 70 L638 70" stroke-width="1.6"/>',
      '<path class="tap-p" d="M563 92 L638 92" stroke-width="1.6"/>',
      '<circle class="tap-p" cx="518" cy="124" r="11" stroke-width="3"/>',
      '<circle class="tap-p" cx="628" cy="124" r="11" stroke-width="3"/>',

      /* 7. TRAILER — drawbar, box, wheel */
      '<path class="tap-p" d="M652 112 L672 112" stroke-width="2.4"/>',
      '<path class="tap-p" d="M676 122 L676 72 L768 72 L768 122" stroke-width="3"/>',
      '<path class="tap-p" d="M686 86 L758 86" stroke-width="1.6"/>',
      '<circle class="tap-p" cx="722" cy="124" r="11" stroke-width="3"/>',

      /* 8. GROUND LINE */
      '<path class="tap-p" d="M465 136 L800 136" stroke-width="2.2"/>',

      /* 9. DIMENSION LINE + END TICKS */
      '<path class="tap-p" d="M500 166 L765 166" stroke-width="1.6" stroke-dasharray="4 3"/>',
      '<path class="tap-p" d="M500 160 L500 172" stroke-width="2.2"/>',
      '<path class="tap-p" d="M765 160 L765 172" stroke-width="2.2"/>',

      '</g>',

      /* ─── DOCUMENT TEXT (fades in after the sketch) ─── */
      '<g id="tapTexts" fill="' + GOLD + '">',
      '<text class="tap-t" data-i18n="tap.doc.title" x="100" y="80"',
      '  font-family="\'Oswald\',sans-serif" font-size="27" font-weight="700"',
      '  letter-spacing="1.5" opacity="0">' + esc(tr('tap.doc.title')) + '</text>',
      '<text class="tap-t" data-i18n="tap.doc.sub" x="100" y="98"',
      '  font-family="\'IBM Plex Mono\',monospace" font-size="9.5" letter-spacing="2"',
      '  opacity="0">' + esc(tr('tap.doc.sub')) + '</text>',
      '<text class="tap-t" data-i18n="tap.doc.field" x="100" y="126"',
      '  font-family="\'IBM Plex Mono\',monospace" font-size="8.5" letter-spacing="1.8"',
      '  opacity="0">' + esc(tr('tap.doc.field')) + '</text>',
      '<text class="tap-t" x="250" y="159" text-anchor="middle"',
      '  font-family="\'IBM Plex Mono\',monospace" font-size="19" letter-spacing="1.5"',
      '  opacity="0">e13*2018/858*00123</text>',
      '<text class="tap-t" data-i18n="tap.doc.chk1" x="126" y="257"',
      '  font-family="\'IBM Plex Mono\',monospace" font-size="9.5" letter-spacing="1.4"',
      '  opacity="0">' + esc(tr('tap.doc.chk1')) + '</text>',
      '<text class="tap-t" data-i18n="tap.doc.chk2" x="126" y="283"',
      '  font-family="\'IBM Plex Mono\',monospace" font-size="9.5" letter-spacing="1.4"',
      '  opacity="0">' + esc(tr('tap.doc.chk2')) + '</text>',
      '<text class="tap-t" data-i18n="tap.dim.label" x="632" y="156" text-anchor="middle"',
      '  font-family="\'IBM Plex Mono\',monospace" font-size="10" letter-spacing="1.8"',
      '  opacity="0">' + esc(tr('tap.dim.label')) + '</text>',
      '</g>',

      /* ─── ROUND APPROVAL STAMP ─── */
      '<g id="tapStamp" opacity="0" transform="rotate(-13,632,252)">',
      '  <circle cx="632" cy="252" r="82" stroke="' + GREEN + '" stroke-width="5" fill="none"/>',
      '  <circle cx="632" cy="252" r="71" stroke="' + GREEN + '" stroke-width="1.6"',
      '    fill="rgba(56,161,105,0.10)" stroke-dasharray="5 5"/>',
      '  <path d="M572 222 L692 222" stroke="' + GREEN + '" stroke-width="1.4"/>',
      '  <path d="M572 266 L692 266" stroke="' + GREEN + '" stroke-width="1.4"/>',
      '  <text data-i18n="tap.stamp.top" x="632" y="210" text-anchor="middle"',
      '    font-family="\'IBM Plex Mono\',monospace" font-size="8" letter-spacing="1.4"',
      '    fill="' + GREEN + '" opacity="0.85">' + esc(tr('tap.stamp.top')) + '</text>',
      '  <text data-i18n="tap.stamp.main" x="632" y="252" text-anchor="middle"',
      /* 18px / 0.6 tracking keeps the longest label (ΕΓΚΡΙΘΗΚΕ) inside r=71 */
      '    font-family="\'Oswald\',sans-serif" font-size="18" font-weight="700"',
      '    letter-spacing="0.6" fill="' + GREEN + '">' + esc(tr('tap.stamp.main')) + '</text>',
      '  <text data-i18n="tap.stamp.sub" x="632" y="284" text-anchor="middle"',
      '    font-family="\'IBM Plex Mono\',monospace" font-size="9" letter-spacing="1.8"',
      '    fill="' + GREEN + '">' + esc(tr('tap.stamp.sub')) + '</text>',
      '  <text data-i18n="tap.stamp.foot" x="632" y="303" text-anchor="middle"',
      '    font-family="\'IBM Plex Mono\',monospace" font-size="7.5" letter-spacing="1.1"',
      '    fill="' + GREEN + '" opacity="0.75">' + esc(tr('tap.stamp.foot')) + '</text>',
      '</g>',

      '</svg>'
    ].join('\n');

    return svg;
  }

  /* ── MEASURE ALL STROKE LENGTHS ── */
  function measurePaths(container) {
    var els  = container.querySelectorAll('.tap-p');
    var data = [];
    els.forEach(function (el) {
      var len = 0;
      try { len = el.getTotalLength(); } catch (e) { len = 0; }
      if (!len) return;
      data.push({ el: el, len: len });
    });
    return data;
  }

  /* ── EASING ── */
  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  /* ── PROGRESSIVE DRAW ──
   * Treats every stroke as one continuous ribbon so the sketch is drawn in
   * document order at a steady apparent speed. */
  function animateDraw(pathData, duration, onComplete) {
    if (!pathData.length) { if (onComplete) onComplete(); return; }

    var totalLen = pathData.reduce(function (s, d) { return s + d.len; }, 0);
    var start    = null;

    /* offset of each stroke along the combined ribbon */
    var acc = 0;
    pathData.forEach(function (d) {
      d.start = acc;
      acc += d.len;
      d.el.style.strokeDasharray  = d.len + ' ' + d.len;
      d.el.style.strokeDashoffset = d.len;
    });

    function frame(ts) {
      if (start === null) start = ts;
      var t    = Math.min((ts - start) / duration, 1);
      var done = easeInOut(t) * totalLen;

      pathData.forEach(function (d) {
        var local = done - d.start;
        var shown = Math.max(0, Math.min(local, d.len));
        d.el.style.strokeDashoffset = (d.len - shown);
      });

      if (t < 1) {
        requestAnimationFrame(frame);
      } else if (onComplete) {
        onComplete();
      }
    }

    requestAnimationFrame(frame);
  }

  /* ── SHOW DOCUMENT TEXT (staggered fade) ── */
  function showTexts(container) {
    var texts = container.querySelectorAll('.tap-t');
    texts.forEach(function (el, i) {
      el.style.transition = 'opacity 0.4s ease';
      setTimeout(function () { el.style.opacity = '1'; }, i * 90);
    });
  }

  /* ── DROP THE STAMP ── */
  function showStamp(stamp) {
    if (!stamp) return;
    stamp.style.transition = 'none';
    stamp.style.opacity    = '0';
    /* scale about the stamp centre: translate(cx*(1-s), cy*(1-s)) then scale(s) */
    stamp.setAttribute('transform', 'rotate(-13,632,252) translate(284.4,113.4) scale(0.55)');
    /* force a reflow so the transition starts from the scaled-down state */
    void stamp.getBoundingClientRect();
    stamp.style.transition = 'opacity 0.45s ease, transform 0.45s cubic-bezier(0.34,1.56,0.64,1)';
    stamp.style.opacity    = '1';
    stamp.setAttribute('transform', 'rotate(-13,632,252)');
  }

  /* ── RESET TO THE BLANK SHEET ── */
  function resetAnimation(pathData, stamp, container) {
    pathData.forEach(function (d) {
      d.el.style.strokeDasharray  = d.len + ' ' + d.len;
      d.el.style.strokeDashoffset = d.len;
    });
    container.querySelectorAll('.tap-t').forEach(function (el) {
      el.style.transition = 'none';
      el.style.opacity    = '0';
    });
    if (stamp) {
      stamp.style.transition = 'none';
      stamp.style.opacity    = '0';
    }
  }

  /* ── SHOW THE FINISHED STATE WITH NO MOTION ── */
  function showStatic(container) {
    container.querySelectorAll('.tap-p').forEach(function (el) {
      el.style.strokeDasharray  = 'none';
      el.style.strokeDashoffset = '0';
    });
    container.querySelectorAll('.tap-t').forEach(function (el) { el.style.opacity = '1'; });
    var stamp = container.querySelector('#tapStamp');
    if (stamp) stamp.style.opacity = '1';
  }

  /* ── RUN SEQUENCE ── */
  function runSequence(container) {
    var pathData = measurePaths(container);
    var stamp    = container.querySelector('#tapStamp');
    var svg      = container.querySelector('#tapSvg') || container;

    function start() {
      resetAnimation(pathData, stamp, svg);
      setTimeout(function () {
        animateDraw(pathData, DRAW_DURATION, function () {
          setTimeout(function () { showTexts(svg); }, TEXT_DELAY);
          setTimeout(function () {
            showStamp(stamp);
            if (AUTO_RESTART) {
              setTimeout(start, RESTART_DELAY);
            }
          }, STAMP_DELAY);
        });
      }, 60);
    }

    start();
  }

  /* ── INTERSECTION OBSERVER: start only when in view ── */
  function observe(wrapper) {
    if ('IntersectionObserver' in window) {
      var started = false;
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && !started) {
            started = true;
            runSequence(wrapper);
          }
        });
      }, { threshold: 0.25 });
      obs.observe(wrapper);
    } else {
      runSequence(wrapper);
    }
  }

  /* ── INIT ── */
  function init() {
    var wrapper = document.getElementById('typeApprovalAnimWrap');
    if (!wrapper) return;
    wrapper.innerHTML = buildSVG();

    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { showStatic(wrapper); return; }

    observe(wrapper);
  }

  /* Run after DOM is ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* Expose for manual calls */
  window.TypeApprovalAnim = { init: init };

}());
