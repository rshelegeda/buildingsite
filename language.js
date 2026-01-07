async function applyTranslations(lang) {
    try {
        const response = await fetch('/translations.json');
        const translations = await response.json();
        const currentLangText = translations[lang];

        if (!currentLangText) return;

        // 1. Обновляем тексты
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (currentLangText[key]) {
                element.textContent = currentLangText[key];
            }
        });

        // 2. Обновляем ссылки (!ВАЖНО ДЛЯ SEO!)
        // Добавляем ?lang=... ко всем ссылкам на сайте, чтобы робот Google мог пройти по ним
        document.querySelectorAll('nav a, .button-onContent a').forEach(link => {
            const href = link.getAttribute('href');
            if (href && href !== '#' && !href.startsWith('http')) {
                const url = new URL(href, window.location.origin);
                url.searchParams.set('lang', lang);
                link.setAttribute('href', url.pathname + url.search);
            }
        });

        document.documentElement.setAttribute('lang', lang);
        localStorage.setItem('siteLang', lang);
    } catch (error) {
        console.error("Ошибка перевода:", error);
    }
}

function setupLanguageSwitchers() {
    document.querySelectorAll('.language-switcher button').forEach(button => {
        button.addEventListener('click', () => {
            const lang = button.getAttribute('data-lang');
            // При клике перезагружаем страницу с новым параметром
            const url = new URL(window.location.href);
            url.searchParams.set('lang', lang);
            window.location.href = url.toString();
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupLanguageSwitchers();

    // Читаем язык из URL, если нет - из хранилища, если нет - 'uk'
    const urlParams = new URLSearchParams(window.location.search);
    const langFromUrl = urlParams.get('lang');
    const storedLang = localStorage.getItem('siteLang');
    const langToApply = langFromUrl || storedLang || 'uk';

    applyTranslations(langToApply);
});