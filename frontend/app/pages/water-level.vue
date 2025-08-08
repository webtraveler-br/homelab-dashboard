<template>
	<div class="dashboard-content">
		<div class="welcome-header">
			<h2>Nível de Água</h2>
			<p class="subtitle">Monitore a distância medida pelo sensor ultrassônico (cm)</p>
		</div>

		<div class="dashboard-grid">
			<div class="dashboard-card">
				<div class="card-header">
					<span class="material-icons">timeline</span>
					<h3>Período</h3>
				</div>
				<div class="card-content period-selector">
					<button v-for="period in periods" :key="period.value" class="btn" :class="{ 'btn-primary': selectedPeriod === period.value }" @click="selectPeriod(period.value)">
						{{ period.label }}
					</button>
				</div>
			</div>

			<div class="dashboard-card chart-card">
				<div class="card-header">
					<span class="material-icons">water_drop</span>
					<h3>Distância até a Superfície</h3>
				</div>
				<div class="card-content chart-container" :class="{ loading: isLoading }">
					<div v-if="isLoading" class="loading-spinner">
						<span class="material-icons rotating">sync</span>
						<p>Carregando dados...</p>
					</div>
					<div v-else-if="error" class="error-message">
						<span class="material-icons">error_outline</span>
						<p>{{ error }}</p>
					</div>
					<div v-else-if="logs.length === 0" class="no-data">
						<span class="material-icons">info</span>
						<p>Nenhum dado disponível para este período</p>
					</div>
					<div v-else>
						<div class="chart-wrapper">
							<ThemedLineChart :key="themeKey" :labels="logs.map((l) => formatDisplayDate(l.timestamp))" :values="logs.map((l) => Number(l.payload.distance))" series-label="Distância" y-title="Distância (cm)" />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import ThemedLineChart from '@/components/ThemedLineChart.vue';
import { useToast } from '@/composables/useToast';
import { useTheme } from '@/composables/useTheme';
import { useApiWrapper } from '@/composables/useApiWrapper';

const { isDarkTheme } = useTheme();
const themeKey = computed(() => (isDarkTheme.value ? 'dark' : 'light'));

interface SensorLog {
	id: number;
	timestamp: string;
	topic: string;
	payload: { distance: number; [key: string]: unknown };
}

const toast = useToast();

const logs = ref<SensorLog[]>([]);
const isLoading = ref(false);
const error = ref('');
const selectedPeriod = ref<'day' | 'week' | 'month'>('day');

const { sensor } = useApiWrapper();

const periods = [
	{ label: 'Último Dia', value: 'day' },
	{ label: 'Última Semana', value: 'week' },
	{ label: 'Último Mês', value: 'month' },
] as const;

const formatDate = (date: Date) => {
	const isoString = date.toISOString();
	return isoString.split('.')[0] || isoString;
};

const getDateRange = (period: 'day' | 'week' | 'month') => {
	const end = new Date();
	const start = new Date();
	if (period === 'day') start.setDate(start.getDate() - 1);
	else if (period === 'week') start.setDate(start.getDate() - 7);
	else start.setMonth(start.getMonth() - 1);
	return { start: formatDate(start), end: formatDate(end) };
};

const formatDisplayDate = (dateString: string) => {
	const date = new Date(dateString);
	return new Intl.DateTimeFormat('pt-BR', {
		day: '2-digit',
		month: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
	}).format(date);
};

const loadData = async () => {
	isLoading.value = true;
	error.value = '';
	try {
		const { start, end } = getDateRange(selectedPeriod.value);
		const resp = await sensor.getWaterLevelLogs(start, end);
		logs.value = Array.isArray(resp) ? resp : [];
	} catch (e: unknown) {
		const msg = e instanceof Error ? e.message : 'Erro ao carregar dados';
		error.value = msg;
		toast.error('Falha ao carregar dados de nível de água');
	} finally {
		isLoading.value = false;
	}
};

const selectPeriod = (period: 'day' | 'week' | 'month') => {
	selectedPeriod.value = period;
	loadData();
};

onMounted(() => {
	loadData();
});
</script>

<style scoped>
.dashboard-content {
	max-width: 1200px;
	margin: 0 auto;
	padding: 0 var(--spacing-unit);
}
.welcome-header {
	margin-bottom: calc(var(--spacing-unit) * 3);
	text-align: center;
}
.dashboard-grid {
	display: grid;
	grid-template-columns: 1fr;
	gap: calc(var(--spacing-unit) * 3);
	margin-bottom: calc(var(--spacing-unit) * 4);
}
.dashboard-card {
	background-color: var(--color-background-alt);
	border-radius: var(--border-radius);
	box-shadow: var(--shadow-md);
	overflow: hidden;
	transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.card-header {
	display: flex;
	align-items: center;
	padding: calc(var(--spacing-unit) * 2);
	background-color: var(--color-primary);
	color: #fff;
}
.card-header h3 {
	margin: 0 0 0 calc(var(--spacing-unit) * 1.5);
	font-size: 1.2rem;
}
.card-header .material-icons {
	font-size: 1.5rem;
}
.card-content {
	padding: calc(var(--spacing-unit) * 2);
}
.period-selector {
	display: flex;
	gap: calc(var(--spacing-unit) * 1.5);
	flex-wrap: wrap;
}
.chart-card {
	min-height: 650px;
}
.chart-container {
	height: 600px;
	position: relative;
	padding: calc(var(--spacing-unit) * 2);
	background-color: var(--chart-bg);
	border-radius: var(--border-radius);
	box-shadow: var(--shadow-md);
	border: 1px solid rgba(0, 0, 0, 0.1);
}
.loading-spinner,
.error-message,
.no-data {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100%;
	color: var(--chart-text);
	background-color: var(--chart-bg);
}
.rotating {
	animation: rotate 1.5s linear infinite;
}
@keyframes rotate {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}
.btn {
	padding: calc(var(--spacing-unit)) calc(var(--spacing-unit) * 2);
	border: none;
	border-radius: var(--border-radius-sm);
	background-color: var(--color-background);
	color: var(--color-text);
	cursor: pointer;
	font-weight: 500;
	transition: background-color 0.2s ease, color 0.2s ease;
}
.btn:hover {
	background-color: var(--color-primary-light);
}
.btn-primary {
	background-color: var(--color-primary);
	color: #fff;
}
.chart-wrapper {
	height: 100%;
	width: 100%;
	min-height: 550px;
	background-color: var(--chart-bg);
}
@media (min-width: 768px) {
	.period-selector {
		justify-content: center;
	}
}
</style>
