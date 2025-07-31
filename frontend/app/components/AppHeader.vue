<template>
	<header class="main-header">
		<div class="header-content">
			<h1 class="page-title">{{ title }}</h1>
			<div class="header-actions">
                <!-- Ainda sem funcionalidade, mas serão utilizados no futuro -->
				<span class="material-icons">notifications</span> 
				<span class="material-icons">settings</span>
			</div>
		</div>
	</header>
</template>

<script setup lang="ts">
defineProps({
	title: {
		type: String,
		default: 'HomeLab',
	},
});
</script>

<style scoped>
.main-header {
	background-color: var(--color-background-alt);
	border-bottom: 1px solid rgba(0, 0, 0, 0.05);
	box-shadow: var(--shadow-sm);
	padding: 0 calc(var(--spacing-unit) * 3);
	height: var(--header-height);
}

.header-content {
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.page-title {
	font-size: 1.5rem;
	font-weight: 600;
	margin: 0;
}

.header-actions {
	display: flex;
	align-items: center;
	gap: calc(var(--spacing-unit) * 2);
}

.header-actions .material-icons {
	color: var(--color-text-muted);
	cursor: pointer;
	transition: color var(--transition-fast);
}

.header-actions .material-icons:hover {
	color: var(--color-primary);
}
</style>
