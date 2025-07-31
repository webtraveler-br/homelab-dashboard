import { ref } from 'vue';

export function useTheme() {
	const isDarkTheme = ref(false);

	// Função para alternar entre os temas
	function toggleTheme() {
		isDarkTheme.value = !isDarkTheme.value;

		if (isDarkTheme.value) {
			document.documentElement.classList.add('dark-theme');
		} else {
			document.documentElement.classList.remove('dark-theme');
		}

		localStorage.setItem('theme', isDarkTheme.value ? 'dark' : 'light');
	}

	// Sincroniza o estado com a classe no document.documentElement
	function initTheme() {
		isDarkTheme.value = document.documentElement.classList.contains('dark-theme');
	}

	return {
		isDarkTheme,
		toggleTheme,
		initTheme,
	};
}
