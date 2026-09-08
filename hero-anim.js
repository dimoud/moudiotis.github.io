/**
 * hero-anim.js — εναλλαγή γραφικών στο hero
 *
 * Το λογότυπο φεύγει προς τα αριστερά, μπαίνει ένα από τα τεχνικά σκίτσα των
 * σελίδων υπηρεσιών, και η σειρά συνεχίζεται ανά δέκα δευτερόλεπτα.
 *
 * Ο κανόνας που κρατά το πράγμα διακριτικό, όχι κουραστικό:
 *   — κάθε σκίτσο σχεδιάζεται μία μόνο φορά, την πρώτη που εμφανίζεται·
 *     στις επόμενες γυράδες μπαίνει έτοιμο, χωρίς να ξαναγράφεται·
 *   — η εναλλαγή σταματά μόλις το hero βγει από το κάδρο, όταν η καρτέλα
 *     πάει σε δεύτερο πλάνο, και όσο ο κέρσορας στέκεται πάνω του·
 *   — με prefers-reduced-motion δεν εναλλάσσεται τίποτα: μένει το λογότυπο.
 *
 * Στο κινητό το σκίτσο του hero επιλέγεται τυχαία σε κάθε φόρτωση, ώστε ο
 * επισκέπτης που ξαναμπαίνει να μη βλέπει πάντα το ίδιο.
 *
 * Απαιτεί: trailer-animation.js, type-approval-animation.js,
 *          service-animations.js — φορτωμένα πριν από αυτό.
 */
(function () {
  'use strict';

  var INTERVAL   = 10000;  // ms ανά σκηνή
  var SLIDE_MS   = 620;    // διάρκεια της εναλλαγής
  var DRAW_MS    = 2600;   // πρώτη σχεδίαση του σκίτσου

  function reduced() {
    return window.matchMedia &&
           window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* ── ΠΗΓΕΣ ΣΚΙΤΣΩΝ ──
   * Κάθε γραφικό έρχεται από το ίδιο αρχείο που το ζωγραφίζει στη σελίδα του,
   * ώστε να μην υπάρχουν δύο εκδοχές του ίδιου σχεδίου. */
  function sources() {
    var out = [];
    if (window.TrailerAnim && window.TrailerAnim.build) {
      out.push({ key: 'trailer', html: window.TrailerAnim.build() });
    }
    if (window.ServiceAnim && window.ServiceAnim.build) {
      out.push({ key: 'import', html: window.ServiceAnim.build('import') });
      out.push({ key: 'exes',   html: window.ServiceAnim.build('exes') });
    }
    if (window.TypeApprovalAnim && window.TypeApprovalAnim.build) {
      out.push({ key: 'tap', html: window.TypeApprovalAnim.build() });
    }
    return out.filter(function (s) { return s.html; });
  }

  /* Τα αντίγραφα του hero παίρνουν δικά τους id. Χωρίς αυτό, τα σενάρια των
   * ενοτήτων πιο κάτω στη σελίδα θα έβρισκαν πρώτα το αντίγραφο του hero. */
  function namespaceIds(html, prefix) {
    return html
      .replace(/id="([^"]+)"/g,       'id="' + prefix + '$1"')
      .replace(/url\(#([^)]+)\)/g,    'url(#' + prefix + '$1)')
      .replace(/href="#([^"]+)"/g,    'href="#' + prefix + '$1"');
  }

  /* ── ΣΧΕΔΙΑΣΗ ΜΙΑ ΦΟΡΑ ──
   * Ίδια τεχνική με τα υπόλοιπα γραφικά: κάθε γραμμή γράφεται από το μηδέν. */
  function strokes(svg) {
    var els = svg.querySelectorAll('.tp, .tap-p, .sv-p');
    var data = [];
    for (var i = 0; i < els.length; i++) {
      var el = els[i], len = 0;
      try {
        if (el.tagName.toLowerCase() === 'circle') {
          len = 2 * Math.PI * parseFloat(el.getAttribute('r') || 0);
        } else if (el.getTotalLength) {
          len = el.getTotalLength();
        }
      } catch (e) { len = 0; }
      if (len) data.push({ el: el, len: len });
    }
    return data;
  }

  function easeInOut(x) { return x < 0.5 ? 2 * x * x : -1 + (4 - 2 * x) * x; }

  function draw(svg, done) {
    var data = strokes(svg);
    if (!data.length) { if (done) done(); return; }
    var total = 0, acc = 0, start = null;
    data.forEach(function (d) { total += d.len; });
    data.forEach(function (d) {
      d.start = acc; acc += d.len;
      d.el.style.strokeDasharray  = d.len + ' ' + d.len;
      d.el.style.strokeDashoffset = d.len;
    });
    function frame(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / DRAW_MS, 1);
      var got = easeInOut(p) * total;
      data.forEach(function (d) {
        var shown = Math.max(0, Math.min(got - d.start, d.len));
        d.el.style.strokeDashoffset = (d.len - shown);
      });
      if (p < 1) requestAnimationFrame(frame);
      else if (done) done();
    }
    requestAnimationFrame(frame);
  }

  /* Η τελική εικόνα: όλα γραμμένα, κείμενα και σφραγίδες στη θέση τους. */
  function settle(svg) {
    svg.querySelectorAll('.tp, .tap-p, .sv-p').forEach(function (el) {
      el.style.strokeDasharray  = 'none';
      el.style.strokeDashoffset = '0';
    });
    svg.querySelectorAll('.tap-t, .sv-t, .sv-bolt, text').forEach(function (el) {
      el.style.opacity = '1';
    });
    ['Stamp', 'Reveal', 'trailerStamp', 'tapStamp', 'svcReveal'].forEach(function () {});
    var body = svg.querySelector('[id$="exesBody"]');
    if (body) { body.setAttribute('transform', 'translate(0,0)'); body.style.opacity = '1'; }
    var old = svg.querySelector('[id$="impOld"]');
    if (old) old.style.opacity = '0.25';
    ['[id$="svcReveal"]', '[id$="tapStamp"]', '[id$="trailerStamp"]'].forEach(function (sel) {
      var e = svg.querySelector(sel);
      if (e) e.style.opacity = '1';
    });
  }

  /* Μία σκηνή = ένα <div class="hero-slide"> με το SVG μέσα του. */
  function makeSlide(src, i) {
    var d = document.createElement('div');
    d.className = 'hero-slide hero-slide--art';
    d.setAttribute('aria-hidden', 'true');
    d.innerHTML = namespaceIds(src.html, 'hero' + i + '-');
    var svg = d.querySelector('svg');
    if (svg) {
      svg.removeAttribute('style');
      svg.setAttribute('class', 'hero-art-svg');
      /* πριν τη σχεδίαση: κείμενα και σφραγίδες κρυφά */
      svg.querySelectorAll('.tap-t, .sv-t, .sv-bolt').forEach(function (e) { e.style.opacity = '0'; });
      var rev = svg.querySelector('[id$="svcReveal"]');   if (rev) rev.style.opacity = '0';
      var st1 = svg.querySelector('[id$="tapStamp"]');     if (st1) st1.style.opacity = '0';
      var st2 = svg.querySelector('[id$="trailerStamp"]'); if (st2) st2.style.opacity = '0';
      var bd  = svg.querySelector('[id$="exesBody"]');     if (bd)  bd.style.opacity  = '0';
    }
    d.dataset.drawn = '0';
    return d;
  }

  function revealSlide(slide) {
    var svg = slide.querySelector('svg');
    if (!svg) return;
    if (slide.dataset.drawn === '1') { settle(svg); return; }
    slide.dataset.drawn = '1';
    draw(svg, function () {
      svg.querySelectorAll('.tap-t, .sv-t').forEach(function (e, k) {
        e.style.transition = 'opacity .35s ease';
        setTimeout(function () { e.style.opacity = '1'; }, k * 60);
      });
      setTimeout(function () { settle(svg); }, 700);
    });
  }

  /* ── ΕΝΑΛΛΑΚΤΗΣ ── */
  function rotator(stage, slides, startAt) {
    var idx = startAt || 0, timer = null, paused = false, inView = true;

    /* Ο δακτύλιος με τα περιστρεφόμενα γράμματα ανήκει στο λογότυπο. Όταν
     * φεύγει το λογότυπο, φεύγει κι αυτός — αλλιώς τα σκίτσα κάθονται μέσα
     * σε ένα στεφάνι που δεν τους ανήκει. Η αρχική κίνηση εισόδου του
     * μηδενίζεται πρώτα, γιατί με animation-fill-mode: both κρατούσε το
     * opacity στο 1 και δεν άφηνε τη μετάβαση να δουλέψει. */
    var wrap = stage.closest ? stage.closest('.hero-photo-wrap') : null;
    var orbit = wrap ? wrap.querySelector('.hero-orbit-svg') : null;
    if (orbit) {
      setTimeout(function () {
        orbit.style.animation  = 'none';
        orbit.style.transition = 'opacity .55s var(--ease), transform .65s var(--ease)';
      }, 3200);
    }
    function markArt(slide) {
      if (!wrap) return;
      wrap.classList.toggle('art-active', slide.classList.contains('hero-slide--art'));
    }

    slides.forEach(function (s, i) {
      s.classList.toggle('is-active', i === idx);
    });
    markArt(slides[idx]);
    if (slides[idx].classList.contains('hero-slide--art')) revealSlide(slides[idx]);

    function go() {
      var prev = slides[idx];
      idx = (idx + 1) % slides.length;
      var next = slides[idx];
      prev.classList.remove('is-active');
      prev.classList.add('is-leaving');
      next.classList.add('is-entering');
      /* reflow ώστε να ξεκινήσει η μετάβαση από τη σωστή θέση */
      void next.offsetWidth;
      next.classList.remove('is-entering');
      next.classList.add('is-active');
      setTimeout(function () { prev.classList.remove('is-leaving'); }, SLIDE_MS);
      markArt(next);
      if (next.classList.contains('hero-slide--art')) revealSlide(next);
    }

    function tick() {
      if (!paused && inView && !document.hidden) go();
      timer = setTimeout(tick, INTERVAL);
    }
    timer = setTimeout(tick, INTERVAL);

    stage.addEventListener('mouseenter', function () { paused = true;  });
    stage.addEventListener('mouseleave', function () { paused = false; });
    document.addEventListener('visibilitychange', function () { /* ο έλεγχος γίνεται στο tick */ });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { inView = e.isIntersecting; });
      }, { threshold: 0.2 }).observe(stage);
    }
  }

  function isMobileHero() {
    return window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
  }

  function init() {
    var src = sources();
    if (!src.length) return;

    /* ── DESKTOP: εναλλαγή μέσα στον δακτύλιο του λογοτύπου ──
     *  Στο κινητό ΔΕΝ γίνεται: εκεί το λογότυπο μένει σταθερό στο πλαίσιό του
     *  και η εναλλαγή αφορά μόνο το σκίτσο πιο κάτω. */
    var wrap  = document.querySelector('.hero-photo-wrap');
    var photo = document.getElementById('heroPhoto');
    if (wrap && photo && !reduced() && !isMobileHero()) {
      var stage = document.createElement('div');
      stage.className = 'hero-stage';
      var first = document.createElement('div');
      first.className = 'hero-slide hero-slide--logo is-active';
      wrap.insertBefore(stage, photo);
      first.appendChild(photo);
      stage.appendChild(first);
      var slides = [first];
      src.forEach(function (s, i) {
        var sl = makeSlide(s, i);
        stage.appendChild(sl);
        slides.push(sl);
      });
      rotator(stage, slides, 0);
    }

    /* ── ΚΙΝΗΤΟ: εναλλαγή μόνο στο σκίτσο του hero ──
     *  Ο γερανός που υπήρχε μένει μέσα στη σειρά. Η αφετηρία επιλέγεται τυχαία
     *  σε κάθε φόρτωση, ώστε ο επισκέπτης που ξαναμπαίνει να μη βλέπει το ίδιο. */
    var crane = document.getElementById('heroCraneMobile');
    if (!crane) return;

    var mStage = document.createElement('div');
    mStage.className = 'hero-stage hero-stage--mobile';

    var craneSlide = document.createElement('div');
    craneSlide.className = 'hero-slide hero-slide--crane';
    while (crane.firstChild) craneSlide.appendChild(crane.firstChild);
    mStage.appendChild(craneSlide);

    var mSlides = [craneSlide];
    src.forEach(function (s, i) {
      var sl = makeSlide(s, 90 + i);
      mStage.appendChild(sl);
      mSlides.push(sl);
    });
    crane.appendChild(mStage);

    var start = Math.floor(Math.random() * mSlides.length);

    if (reduced()) {
      mSlides.forEach(function (sl, i) { sl.classList.toggle('is-active', i === start); });
      var sv = mSlides[start].querySelector('svg');
      if (sv && mSlides[start].classList.contains('hero-slide--art')) {
        mSlides[start].dataset.drawn = '1';
        settle(sv);
      }
      return;
    }

    if ('IntersectionObserver' in window) {
      var began = false;
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && !began) { began = true; rotator(crane, mSlides, start); }
        });
      }, { threshold: 0.2 }).observe(crane);
    } else {
      rotator(crane, mSlides, start);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.HeroAnim = { init: init };
}());
