import { ref } from 'vue';

// Estado compartilhado (mesmo ref para o todo o site)
const isDarkTheme = ref(false);

function applyThemeClass(dark: boolean) {
	if (typeof window === 'undefined') return;
	const root = document.documentElement;
	root.classList.toggle('dark-theme', dark);
}

function setTheme(theme: 'dark' | 'light') {
	const dark = theme === 'dark';
	applyThemeClass(dark); // importante aplicar a classe antes
	isDarkTheme.value = dark;
	if (typeof window !== 'undefined') {
		localStorage.setItem('theme', dark ? 'dark' : 'light');
	}
}

export function useTheme() {
	function toggleTheme() {
		setTheme(isDarkTheme.value ? 'light' : 'dark');
	}

	// Sincroniza o estado com a classe no document.documentElement
	function initTheme() {
		if (typeof window === 'undefined') return;
		const isDark = document.documentElement.classList.contains('dark-theme');
		isDarkTheme.value = isDark;
	}

	return {
		isDarkTheme,
		toggleTheme,
		initTheme,
	};
}
