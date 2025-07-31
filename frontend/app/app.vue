<template>
	<div class="dashboard">
		<AppSidebar v-model:expanded="sidebarExpanded" />

		<div class="content-wrapper" :class="{ 'sidebar-expanded': sidebarExpanded }">
			<AppHeader :title="pageTitle" />
			<main class="main-content">
				<NuxtPage />
			</main>
		</div>
	</div>
</template>

<script setup lang="ts">
import '@/assets/css/global.css';
import '@/assets/css/variables.css';
import { ref, computed } from 'vue';
import { useNavigation } from '@/composables/useNavigation';

const sidebarExpanded = ref(false);
const { getPageTitle } = useNavigation();
const pageTitle = computed(() => getPageTitle());
</script>

<style scoped>
.dashboard {
	display: flex;
	min-height: 100vh;
	background-color: var(--color-background);
}

.content-wrapper {
	flex: 1;
	margin-left: var(--sidebar-width-collapsed);
	transition: margin-left var(--transition-medium);
	min-height: 100vh;
	display: flex;
	flex-direction: column;
}

.content-wrapper.sidebar-expanded {
	margin-left: var(--sidebar-width-expanded);
}

.main-content {
	flex: 1;
	padding: calc(var(--spacing-unit) * 4);
	overflow-y: auto;
}
</style>
