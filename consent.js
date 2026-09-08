/* consent.js — GDPR Cookie Consent for moudiotis.gr
 * - Fires gtag consent signals (analytics_storage, ad_storage)
 * - Stores choice in localStorage (no cookie needed)
 * - Supports Greek / English via html[lang]
 * - GA4 snippet is loaded only after consent is granted
 * -------------------------------------------------------- */

(function () {
    var STORAGE_KEY = 'moudiotis_consent';
    var GA_ID       = 'G-4QBD0G5862';

    /* ── helpers ── */
    function lang() {
        return (document.documentElement.lang || 'el').substring(0, 2);
    }

    var copy = {
        el: {
            title:  'Χρησιμοποιούμε cookies',
            body:   'Χρησιμοποιούμε cookies ανάλυσης για να κατανοούμε πώς χρησιμοποιείται ο ιστότοπος και να βελτιώνουμε τις υπηρεσίες μας. Δεν μοιραζόμαστε προσωπικά δεδομένα με τρίτους.',
            accept: 'Αποδοχή',
            reject: 'Απόρριψη',
        },
        en: {
            title:  'We use cookies',
            body:   'We use analytics cookies to understand how the site is used and to improve our services. We do not share personal data with third parties.',
            accept: 'Accept',
            reject: 'Decline',
        },
    };

    /* ── inject styles ── */
    var css = [
        '#cc-banner{',
        '  position:fixed;bottom:0;left:0;right:0;z-index:99999;',
        '  background:#1d3a5c;color:#f5f4ef;',
        '  font-family:"Source Sans 3",sans-serif;font-size:14px;line-height:1.5;',
        '  padding:18px 24px;display:flex;gap:16px;align-items:center;flex-wrap:wrap;',
        '  box-shadow:0 -2px 16px rgba(0,0,0,.25);',
        '}',
        '#cc-banner.cc-hidden{display:none}',
        '#cc-text{flex:1;min-width:200px}',
        '#cc-text strong{display:block;font-size:15px;margin-bottom:4px;color:#e8c97a}',
        '#cc-btns{display:flex;gap:10px;flex-shrink:0}',
        '#cc-accept,#cc-reject{',
        '  padding:9px 20px;border:none;border-radius:4px;',
        '  font-family:"Source Sans 3",sans-serif;',
        '  font-size:13px;font-weight:600;cursor:pointer;transition:opacity .2s;',
        '}',
        '#cc-accept{background:#c9a86c;color:#1c1b19}',
        '#cc-reject{background:transparent;color:#f5f4ef;border:1px solid rgba(245,244,239,.4)}',
        '#cc-accept:hover,#cc-reject:hover{opacity:.8}',
        '@media(max-width:480px){',
        '  #cc-banner{flex-direction:column;align-items:flex-start}',
        '  #cc-btns{width:100%}',
        '  #cc-accept,#cc-reject{flex:1;text-align:center}',
        '}',
    ].join('');

    var styleEl = document.createElement('style');
    styleEl.textContent = css;
    document.head.appendChild(styleEl);

    /* ── build banner DOM ── */
    var t = copy[lang()] || copy.el;

    var banner = document.createElement('div');
    banner.id = 'cc-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', t.title);
    banner.innerHTML =
        '<div id="cc-text">' +
            '<strong>' + t.title + '</strong>' +
            t.body +
        '</div>' +
        '<div id="cc-btns">' +
            '<button id="cc-reject">' + t.reject + '</button>' +
            '<button id="cc-accept">' + t.accept + '</button>' +
        '</div>';

    /* ── gtag consent helpers ── */
    function gtagDeny() {
        if (typeof gtag === 'function') {
            gtag('consent', 'update', {
                analytics_storage: 'denied',
                ad_storage:        'denied',
            });
        }
    }

    function gtagGrant() {
        if (typeof gtag === 'function') {
            gtag('consent', 'update', {
                analytics_storage: 'granted',
                ad_storage:        'granted',
            });
        }
        /* load GA4 script now if not already loaded */
        if (GA_ID && !document.getElementById('ga4-script')) {
            var s = document.createElement('script');
            s.id  = 'ga4-script';
            s.async = true;
            s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
            document.head.appendChild(s);
            s.onload = function () {
                window.dataLayer = window.dataLayer || [];
                function gtag() { dataLayer.push(arguments); }
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', GA_ID, { anonymize_ip: true });
                fireQueuedEvents();
            };
        }
    }

    /* ── queued events (fired after consent is granted) ── */
    var _queue = [];
    window._ccQueue = _queue;

    function fireQueuedEvents() {
        if (typeof gtag !== 'function') return;
        _queue.forEach(function (ev) { gtag('event', ev.name, ev.params); });
        _queue = [];
    }

    /* Public helper: call this from other scripts to safely send events.
     * If consent not yet granted the event is queued and fired on grant. */
    window.ccEvent = function (eventName, params) {
        var stored = localStorage.getItem(STORAGE_KEY);
        if (stored === 'granted' && typeof gtag === 'function') {
            gtag('event', eventName, params || {});
        } else if (stored !== 'denied') {
            _queue.push({ name: eventName, params: params || {} });
        }
    };

    /* ── dismiss banner ── */
    function dismiss(choice) {
        localStorage.setItem(STORAGE_KEY, choice);
        banner.classList.add('cc-hidden');
        if (choice === 'granted') {
            gtagGrant();
        } else {
            gtagDeny();
        }
    }

    /* ── check existing choice ── */
    var stored = localStorage.getItem(STORAGE_KEY);

    if (stored === 'granted') {
        gtagGrant();
        return;   /* banner not needed */
    }

    if (stored === 'denied') {
        gtagDeny();
        return;   /* banner not needed */
    }

    /* ── first visit: show banner ── */
    document.body.appendChild(banner);

    document.getElementById('cc-accept').addEventListener('click', function () {
        dismiss('granted');
    });
    document.getElementById('cc-reject').addEventListener('click', function () {
        dismiss('denied');
    });

})();
