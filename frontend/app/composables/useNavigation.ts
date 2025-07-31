import { computed } from 'vue';
import { useRoute } from 'vue-router';

/**
 * Um composable para gerenciar o estado e as ações de navegação.
 * Fornece funções para verificar a rota ativa, obter o título da página e navegar.
 */
export function useNavigation() {
	const route = useRoute();

	const currentRoute = computed(() => route.name);

	/**
	 * Verifica se a página fornecida é a rota ativa no momento.
	 * @param pageName O nome da rota a ser verificada.
	 */
	function isActive(pageName: string): boolean {
		return route.name === pageName;
	}

	/**
	 * Retorna o título da página com base na rota atual.
	 */
	function getPageTitle(): string {
		const titles: Record<string, string> = {
			index: 'Dashboard',
			gatos: 'Monitoramento de Gatos',
		};
		return titles[route.name as string] || 'HomeLab';
	}

	/**
	 * Navega para a página especificada.
	 * @param page O nome da rota para a qual navegar.
	 */
	function goTo(page: string) {
		navigateTo({ name: page });
	}

	return {
		currentRoute,
		isActive,
		getPageTitle,
		goTo,
	};
}
