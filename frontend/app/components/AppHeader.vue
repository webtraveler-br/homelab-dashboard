<template>
	<header class="main-header">
		<div class="header-content">
			<h1 class="page-title">{{ title }}</h1>
			<div class="header-actions">
                <button class="theme-toggle" title="Alternar tema" @click="toggleTheme">
                    <span class="material-icons">{{ isDarkTheme ? 'light_mode' : 'dark_mode' }}</span>
                </button>
				<span class="material-icons">notifications</span> 
				<span class="material-icons">settings</span>
			</div>
		</div>
	</header>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme';
import { onMounted } from 'vue';

defineProps({
	title: {
		type: String,
		default: 'HomeLab',
	},
});

const { isDarkTheme, toggleTheme, initTheme } = useTheme();

onMounted(() => {
    initTheme();
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

.theme-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    border: none;
    padding: calc(var(--spacing-unit) * 0.5);
    border-radius: var(--border-radius);
    cursor: pointer;
    color: var(--color-text-muted);
    transition: all var(--transition-fast);
}

.theme-toggle:hover {
    background-color: var(--color-primary-light);
    color: var(--color-primary);
}

.theme-toggle .material-icons {
    font-size: 1.3rem;
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
