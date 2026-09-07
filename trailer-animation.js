/**
 * trailer-animation.js
 * SVG sketch animation of a car trailer (O1/O2 category).
 * The trailer is drawn from zero with a progressive stroke-dashoffset technique,
 * then an "APPROVED" green stamp fades + rotates in when the sketch completes.
 *
 * Usage: inject #trailerAnimWrap into the DOM, then call TrailerAnim.init()
 * or simply include this script after the target element exists.
 */
(function () {
  'use strict';

  /* ── ΓΛΩΣΣΑ ──
   * Οι σελίδες υπηρεσιών αλλάζουν γλώσσα με σύνδεσμο, οπότε αρκεί να
   * διαβαστεί το <html lang> τη στιγμή που χτίζεται το σκίτσο. */
  function isEn() {
    return (document.documentElement.getAttribute('lang') || 'el')
      .toLowerCase().indexOf('en') === 0;
  }
  function tr(el, en) { return isEn() ? en : el; }


  /* ── CONFIG ── */
  var DRAW_DURATION   = 3200;  // ms total for sketch draw
  var STAMP_DELAY     = 400;   // ms after draw completes before stamp appears
  var RESTART_DELAY   = 9000;  // ms after stamp fully shown before restarting
  var AUTO_RESTART    = true;

  /* ── INJECT SVG ── */
  function buildSVG() {
    /*
      Trailer anatomy (all in SVG coords, viewBox 0 0 520 220):

      Tow bar / drawbar  : long diagonal strut from front
      Frame / chassis    : main rectangular frame
      Bed (box body)     : side walls, front wall (U-shape open at top)
      Rear gate          : horizontal bar at back
      Side ribs          : 4 vertical lines on the box side
      Wheel arch         : semi-circle cut-out on frame side
      Wheel              : circle + hub
      Jockey wheel       : small circle + vertical bar near hitch
      Ball hitch         : the coupling ball at the front
      Overrun coupling   : bracket between drawbar and hitch
      Front leg          : vertical support strut under coupling
      Tie-down hooks     : small ticks on frame rail
    */

    /*
      Redesigned at viewBox 0 0 820 340 — ~1.58× bigger than original 520×220.
      All coordinates scaled ×1.575 and re-centred for extra visual weight.
      stroke-widths also scaled for proportional line weight.
    */
    var svg = [
      '<svg id="trailerSvg" viewBox="0 0 820 340" fill="none"',
      '     xmlns="http://www.w3.org/2000/svg"',
      '     aria-label=' + JSON.stringify(tr("Σκίτσο ρυμουλκούμενου κατηγορίας Ο1/Ο2","Sketch of an O1/O2 category trailer")) + '',
      '     style="width:100%;max-width:820px;overflow:visible;display:block;margin:0 auto">',

      /* ─── GROUP: all sketch paths ─── */
      '<g id="trailerSketch" stroke="#c9a86c" stroke-linecap="round" stroke-linejoin="round" fill="none">',

      /* 1. CHASSIS / MAIN FRAME */
      /* top rail */
      '<path id="tp-frame-top"   class="tp" d="M162 202 L716 202" stroke-width="4.5"/>',
      /* bottom rail */
      '<path id="tp-frame-bot"   class="tp" d="M162 230 L716 230" stroke-width="4.5"/>',
      /* front cross */
      '<path id="tp-cross-front" class="tp" d="M162 183 L162 249" stroke-width="3.5"/>',
      /* rear cross */
      '<path id="tp-cross-rear"  class="tp" d="M716 183 L716 249" stroke-width="3.5"/>',
      /* mid cross member 1 */
      '<path id="tp-cross-m1"    class="tp" d="M390 202 L390 230" stroke-width="2.5"/>',
      /* mid cross member 2 */
      '<path id="tp-cross-m2"    class="tp" d="M565 202 L565 230" stroke-width="2.5"/>',

      /* 2. BOX BODY */
      /* front wall */
      '<path id="tp-wall-front"  class="tp" d="M170 202 L170 110" stroke-width="3"/>',
      /* rear wall */
      '<path id="tp-wall-rear"   class="tp" d="M708 202 L708 110" stroke-width="3"/>',
      /* floor of box */
      '<path id="tp-floor"       class="tp" d="M170 110 L708 110" stroke-width="3"/>',
      /* top lip */
      '<path id="tp-lip-top"     class="tp" d="M170 100 L708 100" stroke-width="2"/>',
      '<path id="tp-lip-l"       class="tp" d="M170 100 L170 118" stroke-width="2"/>',
      '<path id="tp-lip-r"       class="tp" d="M708 100 L708 118" stroke-width="2"/>',

      /* 3. BOX RIBS (5 ribs for the wider box) */
      '<path id="tp-rib1"        class="tp" d="M278 110 L278 202" stroke-width="1.6" stroke-opacity="0.65"/>',
      '<path id="tp-rib2"        class="tp" d="M386 110 L386 202" stroke-width="1.6" stroke-opacity="0.65"/>',
      '<path id="tp-rib3"        class="tp" d="M494 110 L494 202" stroke-width="1.6" stroke-opacity="0.65"/>',
      '<path id="tp-rib4"        class="tp" d="M602 110 L602 202" stroke-width="1.6" stroke-opacity="0.65"/>',

      /* subtle horizontal panel lines inside box */
      '<path id="tp-panel-h"     class="tp" d="M170 156 L708 156" stroke-width="0.9" stroke-opacity="0.3"/>',

      /* 4. REAR GATE */
      '<path id="tp-gate"        class="tp" d="M708 110 L728 110 L728 202 L708 202" stroke-width="2.5"/>',
      '<path id="tp-hinge-t"     class="tp" d="M708 124 L728 124" stroke-width="1.5" stroke-opacity="0.55"/>',
      '<path id="tp-hinge-b"     class="tp" d="M708 190 L728 190" stroke-width="1.5" stroke-opacity="0.55"/>',
      /* gate latch suggestion */
      '<path id="tp-latch"       class="tp" d="M718 153 L718 163" stroke-width="2" stroke-opacity="0.6"/>',

      /* 5. WHEEL ARCH */
      '<path id="tp-arch"        class="tp" d="M548 230 Q595 268 642 230" stroke-width="3"/>',

      /* 6. WHEEL */
      '<circle id="tp-tyre"      class="tp" cx="595" cy="264" r="35" stroke-width="3.5"/>',
      '<circle id="tp-rim"       class="tp" cx="595" cy="264" r="24" stroke-width="2" stroke-opacity="0.65"/>',
      '<circle id="tp-hub"       class="tp" cx="595" cy="264" r="8"  stroke-width="2.5"/>',
      /* 5 spokes */
      '<path id="tp-sp1"         class="tp" d="M595 240 L595 256" stroke-width="1.6" stroke-opacity="0.55"/>',
      '<path id="tp-sp2"         class="tp" d="M571 264 L585 264" stroke-width="1.6" stroke-opacity="0.55"/>',
      '<path id="tp-sp3"         class="tp" d="M595 272 L595 288" stroke-width="1.6" stroke-opacity="0.55"/>',
      '<path id="tp-sp4"         class="tp" d="M605 264 L619 264" stroke-width="1.6" stroke-opacity="0.55"/>',
      '<path id="tp-sp5"         class="tp" d="M578 247 L587 256" stroke-width="1.6" stroke-opacity="0.55"/>',

      /* 7. DRAWBAR */
      '<path id="tp-draw-top"    class="tp" d="M162 205 L56 225" stroke-width="3.5"/>',
      '<path id="tp-draw-bot"    class="tp" d="M162 225 L56 240" stroke-width="3.5"/>',
      /* cross brace */
      '<path id="tp-draw-brace"  class="tp" d="M104 214 L104 252" stroke-width="2" stroke-opacity="0.65"/>',

      /* 8. OVERRUN COUPLING */
      '<path id="tp-coupl"       class="tp" d="M56 216 L28 216 L28 249 L56 249 Z" stroke-width="2.5"/>',
      '<path id="tp-spring"      class="tp" d="M36 230 L50 230 M36 237 L50 237" stroke-width="1.5" stroke-opacity="0.45"/>',

      /* 9. BALL HITCH */
      '<path id="tp-hitch-stem"  class="tp" d="M28 232 L8 232 L8 246" stroke-width="2.5"/>',
      '<circle id="tp-ball"      class="tp" cx="8" cy="250" r="7" stroke-width="2.5"/>',

      /* 10. FRONT LEG & JOCKEY WHEEL */
      '<path id="tp-leg"         class="tp" d="M42 249 L42 290" stroke-width="2.5"/>',
      '<path id="tp-leg-foot"    class="tp" d="M34 290 L50 290" stroke-width="2.5"/>',
      '<circle id="tp-jwheel"    class="tp" cx="42" cy="298" r="9" stroke-width="2.2"/>',

      /* 11. SAFETY CHAIN */
      '<path id="tp-chain"       class="tp" d="M56 244 Q80 260 108 244 Q136 228 162 244" stroke-width="1.2" stroke-dasharray="5 4" stroke-opacity="0.45"/>',

      /* 12. WIRING LOOM */
      '<path id="tp-wire"        class="tp" d="M28 223 Q90 212 162 218" stroke-width="1" stroke-opacity="0.35"/>',

      /* 13. TIE-DOWN HOOKS */
      '<path id="tp-hook1"       class="tp" d="M248 202 L248 185 L265 185" stroke-width="1.6" stroke-opacity="0.55"/>',
      '<path id="tp-hook2"       class="tp" d="M444 202 L444 185 L461 185" stroke-width="1.6" stroke-opacity="0.55"/>',
      '<path id="tp-hook3"       class="tp" d="M648 202 L648 185 L665 185" stroke-width="1.6" stroke-opacity="0.55"/>',

      /* 14. DIMENSION LINE */
      '<path id="tp-dim-line"    class="tp" d="M170 316 L708 316" stroke-width="1" stroke-opacity="0.4"/>',
      '<path id="tp-dim-l"       class="tp" d="M170 308 L170 324" stroke-width="1" stroke-opacity="0.4"/>',
      '<path id="tp-dim-r"       class="tp" d="M708 308 L708 324" stroke-width="1" stroke-opacity="0.4"/>',
      /* full width incl. drawbar */
      '<path id="tp-dim2-line"   class="tp" d="M8 302 L716 302" stroke-width="0.7" stroke-opacity="0.3"/>',
      '<path id="tp-dim2-l"      class="tp" d="M8 297 L8 307" stroke-width="0.7" stroke-opacity="0.3"/>',
      '<path id="tp-dim2-r"      class="tp" d="M716 297 L716 307" stroke-width="0.7" stroke-opacity="0.3"/>',

      '</g>',

      /* ─── DIMENSION LABELS ─── */
      '<text id="trailerDimLabel" x="439" y="332"',
      '  font-family="\'IBM Plex Mono\',monospace" font-size="12" letter-spacing="2.5"',
      '  fill="#c9a86c" text-anchor="middle" opacity="0"',
      '>— 3.500 m (body) —</text>',
      '<text id="trailerDimLabel2" x="362" y="296"',
      '  font-family="\'IBM Plex Mono\',monospace" font-size="10" letter-spacing="2"',
      '  fill="#c9a86c" text-anchor="middle" opacity="0"',
      '>— 5.200 m overall —</text>',

      /* ─── APPROVED STAMP ─── */
      '<g id="trailerStamp" opacity="0" transform="rotate(-15,440,170)">',
      '  <rect x="270" y="118" width="340" height="104" rx="8"',
      '    stroke="#38a169" stroke-width="5" fill="none"',
      '    stroke-dasharray="8 4"/>',
      '  <rect x="278" y="126" width="324" height="88" rx="6"',
      '    stroke="#38a169" stroke-width="1.5" fill="rgba(56,161,105,0.09)"',
      '    stroke-dasharray="5 5"/>',
      '  <text x="440" y="175" text-anchor="middle"',
      '    font-family="\'Oswald\',sans-serif" font-size="44" font-weight="700"',
      '    letter-spacing="8" fill="#38a169">' + tr('ΑΔΕΙΟΔΟΤΗΘΗΚΕ','LICENSED') + '</text>',
      '  <text x="440" y="202" text-anchor="middle"',
      '    font-family="\'IBM Plex Mono\',monospace" font-size="12" letter-spacing="4"',
      '    fill="#38a169" opacity="0.7">' + tr('ΑΔΕΙΑ Ο1 / Ο2','O1 / O2 LICENCE') + '</text>',
      '</g>',

      '</svg>'
    ].join('\n');

    return svg;
  }

  /* ── MEASURE ALL PATH LENGTHS ── */
  function measurePaths(container) {
    var paths = container.querySelectorAll('path.tp, circle.tp');
    var data = [];
    paths.forEach(function (el) {
      var len = 0;
      try {
        if (el.tagName === 'circle') {
          var r = parseFloat(el.getAttribute('r') || 0);
          len = 2 * Math.PI * r;
        } else {
          len = el.getTotalLength ? el.getTotalLength() : 100;
        }
      } catch (e) { len = 100; }
      el.style.strokeDasharray  = len + ' ' + len;
      el.style.strokeDashoffset = len;
      data.push({ el: el, len: len });
    });
    return data;
  }

  /* ── EASING ── */
  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  /* ── ANIMATE SKETCH ── */
  function animateDraw(pathData, duration, onComplete) {
    var start = null;
    var n = pathData.length;

    /* Stagger: each path gets a time slot proportional to its length */
    var totalLen = pathData.reduce(function (s, d) { return s + d.len; }, 0);
    /* assign start/end fractions per path */
    var slots = [];
    var cursor = 0;
    pathData.forEach(function (d) {
      var frac = d.len / totalLen;
      /* give each path a slight overlap window (×1.6) for smoother look */
      slots.push({ from: cursor * 0.85, to: Math.min(1, (cursor + frac) * 1.15) });
      cursor += frac;
    });

    function frame(ts) {
      if (!start) start = ts;
      var elapsed = ts - start;
      var globalT = Math.min(elapsed / duration, 1);

      pathData.forEach(function (d, i) {
        var s = slots[i];
        var localT = s.to > s.from
          ? Math.max(0, Math.min(1, (globalT - s.from) / (s.to - s.from)))
          : 1;
        var easedT = easeInOut(localT);
        d.el.style.strokeDashoffset = d.len * (1 - easedT);
      });

      if (globalT < 1) {
        requestAnimationFrame(frame);
      } else {
        if (onComplete) onComplete();
      }
    }
    requestAnimationFrame(frame);
  }

  /* ── ANIMATE STAMP ── */
  function showStamp(stamp, label) {
    /* label fade — handle both label elements */
    var container = stamp.closest('svg') || stamp.parentElement;
    var labels = container ? container.querySelectorAll('[id^="trailerDimLabel"]') : (label ? [label] : []);
    labels.forEach(function (lbl) {
      lbl.style.transition = 'opacity 0.5s ease';
      lbl.style.opacity = '1';
    });
    if (label && !labels.length) {
      label.style.transition = 'opacity 0.5s ease';
      label.style.opacity = '1';
    }
    /* stamp: first make visible, then animate opacity + rotation */
    stamp.style.transition = 'none';
    stamp.style.opacity = '0';
    stamp.setAttribute('transform', 'rotate(-15,440,170) scale(0.55) translate(198,77)');
    /* force reflow */
    void stamp.getBoundingClientRect();
    stamp.style.transition = 'opacity 0.45s ease, transform 0.45s cubic-bezier(0.34,1.56,0.64,1)';
    stamp.style.opacity = '1';
    stamp.setAttribute('transform', 'rotate(-15,440,170)');
  }

  /* ── RESET ── */
  function resetAnimation(pathData, stamp, container) {
    pathData.forEach(function (d) {
      d.el.style.transition = 'none';
      d.el.style.strokeDashoffset = d.len;
    });
    if (stamp) {
      stamp.style.transition = 'none';
      stamp.style.opacity = '0';
    }
    if (container) {
      container.querySelectorAll('[id^="trailerDimLabel"]').forEach(function (lbl) {
        lbl.style.transition = 'none';
        lbl.style.opacity = '0';
      });
    }
  }

  /* ── RUN SEQUENCE ── */
  function runSequence(container) {
    var pathData = measurePaths(container);
    var stamp    = container.querySelector('#trailerStamp');
    var svg      = container.querySelector('#trailerSvg');

    function start() {
      resetAnimation(pathData, stamp, svg || container);
      setTimeout(function () {
        animateDraw(pathData, DRAW_DURATION, function () {
          setTimeout(function () {
            showStamp(stamp, null);
            if (AUTO_RESTART) {
              setTimeout(function () { start(); }, RESTART_DELAY);
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
    var wrapper = document.getElementById('trailerAnimWrap');
    if (!wrapper) return;
    wrapper.innerHTML = buildSVG();
    observe(wrapper);
  }

  /* Run after DOM is ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* Expose for manual calls */
  window.TrailerAnim = { build: buildSVG, init: init };

}());
