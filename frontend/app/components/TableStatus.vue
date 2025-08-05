<template>
	<div class="table-container">
		<table class="status-table">
			<thead>
				<tr>
					<th>Status</th>
					<th>Última Detecção</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>
						<div class="status-indicator">
							<span class="status-dot" :class="status === 'Presente' ? 'status-active' : 'status-inactive'" />
							{{ status }}
						</div>
					</td>
					<td>{{ timestamp ? formatDate(timestamp) : '---' }}</td>
				</tr>
			</tbody>
		</table>
		<div class="refresh-section">
			<button class="refresh-button" @click="fetchPresence">
				<span class="material-icons">refresh</span>
				Atualizar Status
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useApiWrapper } from '@/composables/useApiWrapper';

const status = ref('Carregando...');
const timestamp = ref<string | null>(null);
const { sensor } = useApiWrapper();

function formatDate(dateStr: string) {
	const d = new Date(dateStr);
	return d.toLocaleString('pt-BR', { hour12: false });
}

async function fetchPresence() {
	try {
		status.value = 'Carregando...';
	const data = await sensor.getTablePresence();
		
		if (data) {
			status.value = data.status;
			timestamp.value = data.timestamp;
		} else {
			throw new Error('Sem dados disponíveis');
		}
	} catch {
		status.value = 'Erro ao buscar status';
		timestamp.value = null;
	}
}

onMounted(fetchPresence);
</script>

<style scoped>
.table-container {
	display: flex;
	flex-direction: column;
	gap: calc(var(--spacing-unit) * 3);
}

.status-table {
	width: 100%;
	border-collapse: separate;
	border-spacing: 0;
	border-radius: var(--border-radius);
	overflow: hidden;
	box-shadow: var(--shadow-sm);
}

.status-table th,
.status-table td {
	padding: calc(var(--spacing-unit) * 2);
	text-align: left;
}

.status-table thead tr {
	background-color: var(--color-primary);
	color: white;
}

.status-table th {
	font-weight: 600;
	text-transform: uppercase;
	font-size: 0.85rem;
	letter-spacing: 0.05em;
}

.status-table tbody tr:hover {
	background-color: rgba(0, 0, 0, 0.02);
}

.status-indicator {
	display: flex;
	align-items: center;
	gap: calc(var(--spacing-unit));
	font-weight: 500;
}

.status-dot {
	display: inline-block;
	width: 12px;
	height: 12px;
	border-radius: 50%;
}

.status-active {
	background-color: var(--color-secondary);
	box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
}

.status-inactive {
	background-color: var(--color-warning);
}

.refresh-section {
	display: flex;
	justify-content: flex-end;
}

.refresh-button {
	display: flex;
	align-items: center;
	gap: calc(var(--spacing-unit));
	padding: calc(var(--spacing-unit) * 1.25) calc(var(--spacing-unit) * 2);
	background-color: transparent;
	border: 1px solid var(--color-primary);
	color: var(--color-primary);
	border-radius: var(--border-radius);
	font-weight: 500;
	cursor: pointer;
	transition: all var(--transition-fast);
}

.refresh-button:hover {
	background-color: var(--color-primary);
	color: white;
}
</style>
