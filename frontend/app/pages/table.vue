<template>
	<div class="monitoring-page">
		<div class="status-header">
			<div class="status-title">
				<span class="material-icons">pets</span>
				<h2>Status dos Gatos</h2>
			</div>
			<p class="status-description">Acompanhe a presença dos seus gatos na mesa em tempo real.</p>
		</div>

		<div class="status-card">
			<TableStatus />
		</div>
	</div>
</template>

<script setup lang="ts">
import TableStatus from '@/components/TableStatus.vue';
</script>

<style scoped>
.monitoring-page {
	max-width: 900px;
	margin: 0 auto;
}

.status-header {
	margin-bottom: calc(var(--spacing-unit) * 4);
}

.status-title {
	display: flex;
	align-items: center;
	gap: calc(var(--spacing-unit) * 1.5);
	margin-bottom: calc(var(--spacing-unit) * 1.5);
}

.status-title .material-icons {
	font-size: 2rem;
	color: var(--color-primary);
}

.status-title h2 {
	margin: 0;
	font-size: 1.8rem;
}

.status-description {
	color: var(--color-text-muted);
	font-size: 1.1rem;
	margin: 0;
}

.status-card {
	background-color: var(--color-background-alt);
	border-radius: var(--border-radius);
	box-shadow: var(--shadow-md);
	padding: calc(var(--spacing-unit) * 4);
}
</style>
