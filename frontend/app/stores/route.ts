import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export interface RouteInfo {
	name: string; // nome da rota
	icon: string; // ícone para sidebar
	label: string; // texto para sidebar
	title: string; // título para header
}

const routes: Record<string, RouteInfo> = {
	'index': { name: 'index', icon: 'home', label: 'Dashboard', title: 'Dashboard HomeLab' },
	'table': { name: 'table', icon: 'pets', label: 'Presença', title: 'Monitoramento de Gatos na Mesa' },
	'air-quality': { name: 'air-quality', icon: 'air', label: 'Qualidade do Ar', title: 'Monitoramento de Qualidade do Ar' },
	'water-level': { name: 'water-level', icon: 'water_drop', label: 'Nível de Água', title: 'Monitoramento de Nível de Água' },
};

// Centraliza navegação e informações das rotas
export const useRouteStore = defineStore('route', () => {
	const router = useRouter();
	const route = useRoute();
	const currentRoute = computed(() => route.name as string);

	// Verifica se a rota informada está ativa
	function isActive(pageName: string): boolean {
		return currentRoute.value === pageName;
	}

	// Retorna o título da página atual para o header
	function getPageTitle(): string {
		const info = routes[currentRoute.value];
		return info?.title || 'HomeLab';
	}

	// Retorna todas as informações de uma rota pelo nome
	function getRouteInfo(name: string): RouteInfo | undefined {
		return routes[name];
	}

	// Navega para a rota informada pelo nome
	function goTo(page: string) {
		router.push({ name: page });
	}

	return {
		routes: Object.values(routes),
		currentRoute,
		isActive,
		getPageTitle,
		getRouteInfo,
		goTo,
	};
});