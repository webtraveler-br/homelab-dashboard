<template>
	<div v-if="isModalOpen" class="insights-modal">
		<div class="modal-content">
			<div class="modal-header">
				<h2>Últimos Insights</h2>
				<button class="close-button" @click="closeModal">
					<span class="material-icons">close</span>
				</button>
			</div>
			<div class="modal-body">
				<div v-if="loading" class="loading">
					<span class="material-icons spin">sync</span>
					Carregando insights...
				</div>
				<div v-else-if="error" class="error-message">
					<span class="material-icons">error_outline</span>
					{{ error }}
				</div>
				<div v-else-if="insights && insights.length === 0" class="empty-state">Nenhum insight disponível.</div>
				<div v-else class="insights-list">
					<div v-for="insight in insights" :key="insight.id" class="insight-item" :class="insight.severity.toLowerCase()">
						<div class="insight-header">
							<span class="material-icons">
								{{ getIconForType(insight.type) }}
							</span>
							<div class="insight-info">
								<div class="insight-title">{{ getTitle(insight) }}</div>
								<div class="insight-timestamp">{{ formatDate(insight.timestamp) }}</div>
							</div>
							<div class="insight-severity" :class="insight.severity.toLowerCase()">
								{{ insight.severity }}
							</div>
						</div>
						<div class="insight-details">
							<p>{{ insight.payload.message }}</p>
							<div v-if="insight.payload.value" class="insight-value">Valor: {{ insight.payload.value }}</div>
							<div class="insight-source">Fonte: {{ insight.payload.source_topic }}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useInsightsStore } from '@/stores/insights';

const insightsStore = useInsightsStore();
const { isModalOpen, insights, loading, error } = storeToRefs(insightsStore);
const { closeModal, fetchLatestInsights } = insightsStore;

const analysisAgents: Record<string, { icon: string; title: string }> = {
	analysis_agent_presence: {
		icon: 'visibility',
		title: 'Alerta de Presença',
	},
	analysis_agent_anomaly: {
		icon: 'air',
		title: 'Alerta de Anomalia',
	},
	analysis_agent_water: {
		icon: 'water_drop',
		title: 'Alerta de Água',
	},
	analysis_agent_location: {
		icon: 'location_on',
		title: 'Alerta de Localização',
	},
};

onMounted(() => {
	if (isModalOpen.value) {
		fetchLatestInsights();
	}
});

watch(isModalOpen, async (open) => {
	if (open) {
		await fetchLatestInsights();
	}
});

function getIconForType(type: string): string {
	return analysisAgents[type]?.icon || 'notifications';
}

function getTitle(insight: Insight): string {
	return analysisAgents[insight.type]?.title || insight.type;
}

function formatDate(dateStr: string): string {
	const date = new Date(dateStr);
	return new Intl.DateTimeFormat('pt-BR', {
		day: '2-digit',
		month: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
	}).format(date);
}
</script>

<style scoped>
.insights-modal {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 100;
}

.modal-content {
	background-color: var(--color-background);
	border-radius: var(--border-radius);
	width: 90%;
	max-width: 550px;
	max-height: 80vh;
	box-shadow: var(--shadow-lg);
	overflow: hidden;
	display: flex;
	flex-direction: column;
}

.modal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: calc(var(--spacing-unit) * 2);
	border-bottom: 1px solid var(--color-border);
}

.modal-header h2 {
	margin: 0;
	font-size: 1.2rem;
	color: var(--color-text);
}

.close-button {
	background: none;
	border: none;
	cursor: pointer;
	color: var(--color-text-muted);
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all var(--transition-fast);
}

.close-button:hover {
	color: var(--color-primary);
}

.modal-body {
	padding: calc(var(--spacing-unit) * 2);
	overflow-y: auto;
}

.loading,
.error-message,
.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: calc(var(--spacing-unit) * 4);
	color: var(--color-text-muted);
	text-align: center;
	gap: var(--spacing-unit);
}

.spin {
	animation: spin 2s linear infinite;
}

@keyframes spin {
	100% {
		transform: rotate(360deg);
	}
}

.insight-item {
	margin-bottom: calc(var(--spacing-unit) * 2);
	border-radius: var(--border-radius);
	background-color: var(--color-background-alt);
	overflow: hidden;
	border-left: 4px solid var(--color-primary);
}

.insight-item.high {
	border-left-color: var(--color-danger);
}

.insight-item.medium {
	border-left-color: var(--color-warning);
}

.insight-item.low {
	border-left-color: var(--color-success);
}

.insight-header {
	display: flex;
	padding: calc(var(--spacing-unit) * 1.5);
	background-color: rgba(0, 0, 0, 0.03);
	align-items: center;
	gap: calc(var(--spacing-unit) * 1.5);
}

.insight-header .material-icons {
	color: var(--color-primary);
	font-size: 1.5rem;
}

.insight-item.high .insight-header .material-icons {
	color: var(--color-danger);
}

.insight-item.medium .insight-header .material-icons {
	color: var(--color-warning);
}

.insight-item.low .insight-header .material-icons {
	color: var(--color-success);
}

.insight-info {
	flex: 1;
}

.insight-title {
	font-weight: 600;
	margin-bottom: calc(var(--spacing-unit) * 0.5);
}

.insight-timestamp {
	font-size: 0.8rem;
	color: var(--color-text-muted);
}

.insight-severity {
	font-size: 0.8rem;
	font-weight: 600;
	padding: calc(var(--spacing-unit) * 0.5) calc(var(--spacing-unit) * 1);
	border-radius: var(--border-radius-sm);
	background-color: var(--color-primary-light);
	color: var(--color-primary-dark);
}

.insight-severity.high {
	background-color: var(--color-danger-light);
	color: var(--color-danger);
}

.insight-severity.medium {
	background-color: var(--color-warning-light);
	color: var(--color-warning-dark);
}

.insight-severity.low {
	background-color: var(--color-success-light);
	color: var(--color-success-dark);
}

.insight-details {
	padding: calc(var(--spacing-unit) * 1.5);
}

.insight-details p {
	margin: 0 0 calc(var(--spacing-unit) * 1.5) 0;
}

.insight-value,
.insight-source {
	font-size: 0.9rem;
	color: var(--color-text-muted);
	margin-top: calc(var(--spacing-unit) * 0.5);
}

.insight-source {
	font-style: italic;
	font-size: 0.8rem;
}
</style>
