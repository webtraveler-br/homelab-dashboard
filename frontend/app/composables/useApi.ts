import { ref } from 'vue';

interface ApiState<T> {
	data: T | null;
	loading: boolean;
	error: string | null;
	lastUpdated: Date | null;
}

export function useApi<T>() {
	const state = ref<ApiState<T>>({
		data: null,
		loading: false,
		error: null,
		lastUpdated: null,
	});

	/**
	 * Busca dados de um endpoint da API.
	 * @param endpoint Caminho do endpoint (ex: 'status/table-presence')
	 * @param options Opções extras para o fetch (método, headers, etc)
	 * @returns Os dados retornados pela API ou null em caso de erro.
	 */
	async function fetch(endpoint: string, options?: RequestInit) {
		state.value.loading = true;
		state.value.error = null;

		try {
			const response = await window.fetch(`/api/${endpoint}`, options);

			if (!response.ok) {
				throw new Error(`API error: ${response.status}`);
			}

			const data = await response.json();
			state.value.data = data;
			state.value.lastUpdated = new Date();
			return data;
		} catch (err: unknown) {
			const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar dados da API';
			state.value.error = errorMessage;
			console.error('API Error:', err);
			return null;
		} finally {
			state.value.loading = false;
		}
	}

	/**
	 * Envia dados para um endpoint da API usando POST.
	 * @param endpoint Caminho do endpoint (ex: 'cat-logs')
	 * @param data Objeto com os dados a serem enviados
	 * @returns Resposta da API ou null em caso de erro.
	 */
	async function post<D>(endpoint: string, data: D) {
		return fetch(endpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});
	}

	/**
	 * Atualiza dados em um endpoint da API usando PUT.
	 * @param endpoint Caminho do endpoint
	 * @param data Objeto com os dados a serem atualizados
	 * @returns Resposta da API ou null em caso de erro.
	 */
	async function put<D>(endpoint: string, data: D) {
		return fetch(endpoint, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});
	}

	/**
	 * Remove dados em um endpoint da API usando DELETE.
	 * @param endpoint Caminho do endpoint
	 * @returns true se a exclusão foi bem-sucedida, false caso contrário.
	 */
	async function remove(endpoint: string) {
		return fetch(endpoint, {
			method: 'DELETE',
		});
	}

	return {
		...state.value,
		fetch,
		post,
		put,
		remove,
	};
}

/**
 * Composable dedicado a sensores e monitoramento de gatos.
 */
export function useSensorApi() {
	const api = useApi();

	/**
	 * Busca o status de presença do gato na mesa.
	 * @returns Status atual do gato (presente/ausente) ou null em caso de erro.
	 */
	async function getTablePresence() {
		return api.fetch('status/table-presence');
	}

	return {
		...api,
		getTablePresence,
	};
}
