// Language switcher
(function() {
  const STORAGE_KEY = 'preferred-lang';

  // Get saved language or default to Danish
  function getLang() {
    return localStorage.getItem(STORAGE_KEY) || 'da';
  }

  // Save language preference
  function setLang(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
  }

  // Apply translations to all elements with data-i18n attribute
  function applyTranslations(lang) {
    const t = translations[lang];
    if (!t) return;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key]) {
        el.textContent = t[key];
      }
    });

    // Update html lang attribute
    document.documentElement.lang = lang;

    // Update toggle button text
    const toggle = document.querySelector('.lang-toggle');
    if (toggle) {
      toggle.textContent = lang === 'da' ? 'EN' : 'DA';
      toggle.setAttribute('aria-label', lang === 'da' ? 'Switch to English' : 'Skift til dansk');
    }
  }

  // Initialize on page load
  function init() {
    const lang = getLang();
    applyTranslations(lang);

    // Set up toggle button click handler
    const toggle = document.querySelector('.lang-toggle');
    if (toggle) {
      toggle.addEventListener('click', function() {
        const currentLang = getLang();
        const newLang = currentLang === 'da' ? 'en' : 'da';
        setLang(newLang);
        applyTranslations(newLang);
      });
    }
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
