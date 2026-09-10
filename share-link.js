/**
 * share-link.js — σύνδεσμος ανά ενότητα
 *
 * Βάζει ένα εικονίδιο πάνω δεξιά σε κάθε κουτί που έχει δικό του id, και με
 * ένα πάτημα αντιγράφει τον πλήρη σύνδεσμο προς αυτό. Με το που φορτώσει η
 * σελίδα με #κάτι στη διεύθυνση, ανοίγει ό,τι είναι πτυσσόμενο μέσα και
 * κατεβαίνει στο σωστό σημείο.
 *
 * Δίγλωσσο, καμία εξωτερική εξάρτηση.
 */
(function () {
  'use strict';

  var T = {
    el: { copy: 'Αντιγραφή συνδέσμου', done: 'Αντιγράφηκε' },
    en: { copy: 'Copy link', done: 'Copied' }
  };
  function t() {
    var l = (document.documentElement.lang || 'el').toLowerCase();
    return l.indexOf('en') === 0 ? T.en : T.el;
  }

  function urlFor(id) {
    return location.protocol + '//' + location.host + location.pathname + '#' + id;
  }

  function copy(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.top = '-1000px';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy') ? resolve() : reject(); }
      catch (e) { reject(e); }
      document.body.removeChild(ta);
    });
  }

  function button(id) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'share-link';
    b.setAttribute('aria-label', t().copy);
    b.setAttribute('title', t().copy);
    b.innerHTML = '<i class="fa-solid fa-link" aria-hidden="true"></i><span class="share-link-msg"></span>';
    b.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var msg = b.querySelector('.share-link-msg');
      copy(urlFor(id)).then(function () {
        history.replaceState(null, '', '#' + id);
        b.classList.add('is-done');
        msg.textContent = t().done;
        setTimeout(function () { b.classList.remove('is-done'); msg.textContent = ''; }, 1800);
      }).catch(function () {
        window.prompt(t().copy, urlFor(id));
      });
    });
    return b;
  }

  function attach(bar, id) {
    if (!bar || bar.querySelector('.share-link')) return;
    bar.appendChild(button(id));
  }

  function scan() {
    /* κουτιά .ta-box μέσα σε .ta-wrap με id */
    var wraps = document.querySelectorAll('.ta-wrap[id]');
    for (var i = 0; i < wraps.length; i++) {
      attach(wraps[i].querySelector('.ta-topbar'), wraps[i].id);
    }
    /* ο έλεγχος Κ.Ο.Κ. */
    var secs = document.querySelectorAll('section[id] .trc-widget-topbar');
    for (var j = 0; j < secs.length; j++) {
      var sec = secs[j].closest('section[id]');
      if (sec) attach(secs[j], sec.id);
    }
  }

  function target() {
    var id = (location.hash || '').replace('#', '');
    return id ? document.getElementById(id) : null;
  }

  /* ανοίγει ό,τι είναι πτυσσόμενο μέσα στο κουτί-στόχο */
  function expand() {
    var el = target();
    if (!el) return;
    var panels = el.querySelectorAll('.ta-collapse, .trc-main-collapse');
    for (var i = 0; i < panels.length; i++) panels[i].classList.add('is-open');
    var btns = el.querySelectorAll('.ta-toggle, #trcMainToggle, #ecToggle');
    for (var j = 0; j < btns.length; j++) btns[j].setAttribute('aria-expanded', 'true');
    el.classList.add('vis', 'is-visible');
  }

  function goTo() {
    var el = target();
    if (!el) return;
    expand();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function openTarget() { expand(); setTimeout(goTo, 140); }

  function init() {
    scan();
    openTarget();
    window.addEventListener('hashchange', openTarget);
    /* το κουτί του υπολογιστή χτίζεται από σενάριο — ξανασαρώνουμε και
       ξανανοίγουμε, γιατί το περιεχόμενο δεν υπάρχει ακόμη στο DOM */
    setTimeout(function () { scan(); expand(); }, 400);
    setTimeout(function () { scan(); expand(); goTo(); }, 1200);
  }

  window.ShareLink = { scan: scan, open: openTarget, expand: expand };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
