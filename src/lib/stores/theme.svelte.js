function createThemeStore() {
    let theme = $state('system');

    const isDark = $derived(
        theme === 'dark' ||
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );

    function setTheme(newTheme) {
        theme = newTheme;
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    }

    function init() {
        const saved = localStorage.getItem('theme');
        setTheme(saved ?? 'system');
    }

    return {
        get theme() { return theme; },
        get isDark() { return isDark; },
        setTheme,
        init,
    };
}

export const themeStore = createThemeStore();