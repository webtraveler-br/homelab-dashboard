import { defineStore } from 'pinia';
import { useApiWrapper } from '@/composables/useApiWrapper';

export interface Insight {
	id: number;
	type: string;
	severity: string;
	payload: Record<string, unknown>;
	timestamp: string;
}

export const useInsightsStore = defineStore('insights', {
	state: () => ({
		isModalOpen: false as boolean,
		insights: [] as Insight[],
		loading: false as boolean,
		error: null as string | null,
	}),
	actions: {
		openModal() {
			this.isModalOpen = true;
		},
		closeModal() {
			this.isModalOpen = false;
		},
		async fetchLatestInsights() {
			this.loading = true;
			this.error = null;
			try {
				const { insights } = useApiWrapper();
				const data = await insights.getLatestInsights();
				if (!data) throw new Error('Erro ao buscar insights');
				this.insights = data;
			} catch (err) {
				this.error = err instanceof Error ? err.message : 'Erro desconhecido';
			} finally {
				this.loading = false;
			}
		},
	},
});
