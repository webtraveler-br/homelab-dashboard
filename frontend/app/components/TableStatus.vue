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
							<span class="status-dot" :class="wasCatDetected ? 'status-active' : 'status-inactive'" />
							{{ status }}
						</div>
					</td>
					<td>{{ timestamp ? formatDate(timestamp) : '---' }}</td>
				</tr>
			</tbody>
		</table>
		<div class="actions-section">
			<button class="refresh-button" @click="fetchPresence">
				<span class="material-icons">refresh</span>
				Atualizar Status
			</button>
			<button v-if="wasCatDetected" class="buzzer-button" @click="activateBuzzer">
				<span class="material-icons">volume_up</span>
				Espante o gato
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useApiWrapper } from '@/composables/useApiWrapper';
import { useToast } from '@/composables/useToast';

const status = ref('Carregando...');
const timestamp = ref<string | null>(null);
const presence = ref(false);
const { sensor } = useApiWrapper();
const toast = useToast();

const wasCatDetected = computed(() => presence.value);

function formatDate(dateStr: string) {
	const d = new Date(dateStr);
	return d.toLocaleString('pt-BR', { hour12: false });
}

async function fetchPresence() {
	try {
		status.value = 'Carregando...';
		presence.value = false;
		const data = await sensor.getTablePresence();
		if (data) {
			status.value = data.status;
			timestamp.value = data.timestamp;
			presence.value = !!data.presence;
		} else {
			throw new Error('Sem dados disponíveis');
		}
	} catch {
		status.value = 'Erro ao buscar status';
		timestamp.value = null;
		presence.value = false;
	}
}

async function activateBuzzer() {
	try {
		await sensor.setBuzzer();
		toast.success('Comando enviado para espantar o gato!');
	} catch {
		toast.error('Falha ao enviar comando.');
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

.actions-section {
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	gap: calc(var(--spacing-unit) * 2);
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
	position: relative;
	overflow: hidden;
	transition: all var(--transition-fast);
}

.refresh-button::before {
	content: '';
	position: absolute;
	top: 0;
	left: -100%;
	width: 100%;
	height: 100%;
	background: linear-gradient(90deg, transparent, rgba(217, 131, 59, 0.2), transparent);
	transition: all 0.6s ease;
}

.refresh-button:hover {
	background-color: var(--color-primary);
	color: white;
	box-shadow: var(--shadow-sm);
}

.refresh-button:hover::before {
	left: 100%;
}

.refresh-button:focus {
	outline: none;
	box-shadow: 0 0 0 3px rgba(217, 131, 59, 0.3);
}

.dark-theme .refresh-button::before {
	background: linear-gradient(90deg, transparent, rgba(90, 138, 168, 0.2), transparent);
}

.dark-theme .refresh-button:focus {
	box-shadow: 0 0 0 3px rgba(90, 138, 168, 0.3);
}

.buzzer-button {
	display: flex;
	align-items: center;
	gap: calc(var(--spacing-unit));
	padding: calc(var(--spacing-unit) * 1.25) calc(var(--spacing-unit) * 2);
	background-color: transparent;
	border: 1px solid var(--color-warning);
	color: var(--color-warning);
	border-radius: var(--border-radius);
	font-weight: 500;
	cursor: pointer;
	position: relative;
	overflow: hidden;
	transition: all var(--transition-fast);
}

.buzzer-button::before {
	content: '';
	position: absolute;
	top: 0;
	left: -100%;
	width: 100%;
	height: 100%;
	background: linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.2), transparent);
	transition: all 0.6s ease;
}

.buzzer-button:hover {
	background-color: var(--color-warning);
	color: white;
	box-shadow: var(--shadow-sm);
}

.buzzer-button:hover::before {
	left: 100%;
}

.buzzer-button:focus {
	outline: none;
	box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.3);
}

.dark-theme .buzzer-button {
	border-color: var(--color-danger);
	color: var(--color-danger);
}

.dark-theme .buzzer-button::before {
	background: linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.2), transparent);
}

.dark-theme .buzzer-button:hover {
	background-color: var(--color-danger);
	color: white;
}

.dark-theme .buzzer-button:focus {
	box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.3);
}
</style>
