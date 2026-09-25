/* tools-tabs.js — τα τρία εργαλεία ρυμουλκούμενου (οδηγός, έλεγχος Κ.Ο.Κ.,
 * υπολογιστής έλξης) σε ένα κουτί με καρτέλες, αντί για τρία κουτιά το ένα
 * κάτω από το άλλο. Όλο το περιεχόμενο μένει στο HTML (το διαβάζουν τα
 * ρομπότ)· απλώς φαίνεται ένα τη φορά. Σύνδεσμος με #id ενός εργαλείου
 * (π.χ. /#ypologistis) ανοίγει κατευθείαν τη σωστή καρτέλα. */
(function () {
    'use strict';
    var root = document.getElementById('ergaleia');
    if (!root) return;
    var tabs = [].slice.call(root.querySelectorAll('.tools-tab'));
    if (!tabs.length) return;
    var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });

    function show(i, focus) {
        tabs.forEach(function (t, j) {
            var on = i === j;
            t.classList.toggle('is-active', on);
            t.setAttribute('aria-selected', String(on));
            t.tabIndex = on ? 0 : -1;
            if (panels[j]) {
                panels[j].classList.toggle('tools-panel-hidden', !on);
                panels[j].setAttribute('role', 'tabpanel');
                panels[j].setAttribute('aria-labelledby', t.id);
                if (on) {
                    /* ό,τι εμφανίζεται με την κύλιση μέσα στο πάνελ να φαίνεται αμέσως */
                    [].forEach.call(panels[j].querySelectorAll('[data-reveal]'), function (e) { e.classList.add('visible', 'is-visible'); });
                    if (panels[j].hasAttribute('data-reveal')) panels[j].classList.add('visible', 'is-visible');
                }
            }
        });
        if (focus) tabs[i].focus();
    }

    tabs.forEach(function (t, i) {
        t.addEventListener('click', function () { show(i); });
        t.addEventListener('keydown', function (e) {
            var k = e.key, n = tabs.length, j = null;
            if (k === 'ArrowRight') j = (i + 1) % n;
            else if (k === 'ArrowLeft') j = (i - 1 + n) % n;
            else if (k === 'Home') j = 0;
            else if (k === 'End') j = n - 1;
            if (j !== null) { e.preventDefault(); show(j, true); }
        });
    });

    function fromHash() {
        var id = (location.hash || '').slice(1);
        if (!id) return false;
        var el = document.getElementById(id);
        if (!el) return false;
        for (var i = 0; i < panels.length; i++) {
            if (panels[i] && (panels[i] === el || panels[i].contains(el))) { show(i); return true; }
        }
        return false;
    }

    show(0);
    fromHash();
    window.addEventListener('hashchange', fromHash);
})();
