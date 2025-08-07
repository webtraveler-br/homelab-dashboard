import type { Insight } from '@/stores/insights';
import { useApi } from './useApi';

/**
 * Composable que centraliza chamadas de API específicas do projeto.
 */
export function useApiWrapper() {
	/**
	 * Busca o status de presença do gato na mesa.
	 */
	const sensorApi = useApi();
	async function getTablePresence() {
		return sensorApi.fetch('status/table-presence');
	}

	/**
	 * Ativa o buzzer para espantar o gato.
	 */
	async function setBuzzer() {
		return sensorApi.post('commands/buzzer', {});
	}

	/**
	 * Busca os últimos insights do sistema.
	 */
	const insightsApi = useApi<Insight[]>();
	async function getLatestInsights() {
		return insightsApi.fetch('insights/latest');
	}

	return {
		sensor: {
			...sensorApi,
			getTablePresence,
			setBuzzer,
		},
		insights: {
			...insightsApi,
			getLatestInsights,
		},
	};
}
