/**
 * contact-form.js — Plug-and-play Google Apps Script form handler
 * Supports English & Greek (auto-detects lang="el" on <html>)
 */

(function () {
  var GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx6XHAAeJMIUVUBtHmjNqu6NGSKvFWgkWeUT4x6x_UMsmEaoPXFPMqlhXLKH5dJ0aGlag/exec';

  var isGreek = document.documentElement.lang === 'el';

  var T = {
    sending:       isGreek ? 'Αποστολή…'                                          : 'Sending…',
    success:       isGreek ? 'Το μήνυμά σας στάλθηκε! Θα επικοινωνήσουμε σύντομα.' : 'Message sent! We\'ll be in touch soon.',
    error:         isGreek ? 'Κάτι πήγε στραβά. Δοκιμάστε ξανά.'                  : 'Something went wrong. Please try again.',
    networkError:  isGreek ? 'Σφάλμα δικτύου. Ελέγξτε τη σύνδεσή σας.'            : 'Network error. Check your connection.',
    notConfigured: isGreek ? 'Η φόρμα δεν έχει ρυθμιστεί ακόμα.'                  : 'Form not configured yet.'
  };

  function setStatus(el, msg, type) {
    if (!el) return;
    el.textContent = msg;
    el.className = type === 'success' ? 'status-success' : 'status-error';
    el.style.display = 'block';
  }

  function init() {
    var form   = document.getElementById('clientContactForm');
    var status = document.getElementById('formStatus');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
        setStatus(status, T.notConfigured, 'error');
        return;
      }

      var btn = form.querySelector('[type="submit"]');
      var originalLabel = btn ? btn.textContent : '';
      if (btn) { btn.textContent = T.sending; btn.disabled = true; }
      if (status) { status.textContent = ''; status.style.display = 'none'; }

      fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body:   new FormData(form)
      })
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.json();
        })
        .then(function (json) {
          if (json && json.result === 'success') {
            setStatus(status, T.success, 'success');
            form.reset();
          } else {
            throw new Error(json && json.error ? json.error : 'unexpected response');
          }
          if (btn) { btn.textContent = originalLabel; btn.disabled = false; }
        })
        .catch(function (err) {
          var isNetwork = err instanceof TypeError;
          setStatus(status, isNetwork ? T.networkError : T.error, 'error');
          if (btn) { btn.textContent = originalLabel; btn.disabled = false; }
        });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
