function createThemeStore() {
	let theme = $state("system");
	const THEME_UID = "theme_color_lab_3405204t8ja";

	const isDark = $derived(
		theme === "dark" ||
			(theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches),
	);

	function setTheme(newTheme) {
		theme = newTheme;
		localStorage.setItem(THEME_UID, newTheme);

		document.documentElement.classList.add("no-transition");
		document.documentElement.setAttribute("data-theme", newTheme);

		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				document.documentElement.classList.remove("no-transition");
			});
		});
	}

	function init() {
		const saved = localStorage.getItem(THEME_UID);
		setTheme(saved ?? "grey");
	}

	return {
		get theme() {
			return theme;
		},
		get isDark() {
			return isDark;
		},
		setTheme,
		init,
	};
}

export const themeStore = createThemeStore();
