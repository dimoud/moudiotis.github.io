/**
 * i18n.js — Greek / English translation toggle
 * ════════════════════════════════════════════════════════════════════════════
 * Modular & reusable. Drop into any page that uses data-i18n attributes.
 * Translations come from window.SITE_CONFIG.translations (built by site-init.js).
 *
 * Attributes recognised:
 *   data-i18n="key"             → replaces element.textContent
 *   data-i18n-html="key"        → replaces element.innerHTML
 *   data-i18n-placeholder="key" → replaces element.placeholder
 *
 * Public API:
 *   window.I18n.setLang('el' | 'en')
 *   window.I18n.getLang()
 *   window.setLang(lang)          ← shorthand for onclick="setLang('el')"
 * ════════════════════════════════════════════════════════════════════════════
 */

(function () {
    'use strict';

    /* ─── TRANSLATIONS ────────────────────────────────────────────────────
     * Built by site-init.js from window.SITE_CONFIG and attached to
     * window.SITE_CONFIG.translations before this script runs.           */
    var t = (window.SITE_CONFIG && window.SITE_CONFIG.translations) || {};

    /* ─── STATE ──────────────────────────────────────────────────────────── */
    var currentLang = localStorage.getItem('lang') ||
                      (window.SITE_CONFIG && window.SITE_CONFIG.meta && window.SITE_CONFIG.meta.lang) ||
                      'el';

    /* ─── APPLY TRANSLATIONS ─────────────────────────────────────────────── */
    function applyLang(lang) {
        currentLang = lang;
        localStorage.setItem('lang', lang);

        /* text content */
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            var key = el.getAttribute('data-i18n');
            if (t[key] && t[key][lang] !== undefined) {
                el.textContent = t[key][lang];
            }
        });

        /* innerHTML (for keys with embedded HTML tags) */
        document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
            var key = el.getAttribute('data-i18n-html');
            if (t[key] && t[key][lang] !== undefined) {
                el.innerHTML = t[key][lang];
            }
        });

        /* placeholder attribute */
        document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
            var key = el.getAttribute('data-i18n-placeholder');
            if (t[key] && t[key][lang] !== undefined) {
                el.placeholder = t[key][lang];
            }
        });

        /* update <html lang> attribute */
        document.documentElement.lang = lang;

        /* update toggle button states */
        document.querySelectorAll('.lang-btn').forEach(function (btn) {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });

        /* update page title and meta description */
        if (window.SITE_CONFIG && window.SITE_CONFIG.meta) {
            var M   = window.SITE_CONFIG.meta;
            var key = lang === 'en' ? 'En' : 'El';
            if (M['title' + key])       document.title = M['title' + key];
            var descEl = document.querySelector('meta[name="description"]');
            if (descEl && M['description' + key]) descEl.content = M['description' + key];
        }
    }

    /* ─── PUBLIC API ─────────────────────────────────────────────────────── */
    window.I18n = {
        setLang:      applyLang,
        getLang:      function () { return currentLang; },
        translations: t,
    };

    /* Global shorthand for onclick="setLang('en')" buttons */
    window.setLang = applyLang;

    /* ─── INIT ───────────────────────────────────────────────────────────── */
    /* Apply on DOM ready — handles page reload with saved language preference */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { applyLang(currentLang); });
    } else {
        applyLang(currentLang);
    }

})();
