<template>
	<div class="dashboard no-theme">
		<ToastNotification :show="notificationStore.notification.show" :message="notificationStore.notification.message" :type="notificationStore.notification.type" :icon="notificationStore.notification.icon" @close="notificationStore.hide()" />
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

import { useHead } from '#app';
import { ref, onMounted } from 'vue';

import { useRouteStore } from '@/stores/route';
import { useNotificationStore } from '@/stores/notification';

import { useTheme } from '@/composables/useTheme';
import ToastNotification from '@/components/ToastNotification.vue';

const notificationStore = useNotificationStore();

// necessário para aplicar o tema antes da renderização
// evitando um flash do tema branco ou da página sem estilo
useHead({
	script: [
		{
			innerHTML: `
				(function() {
				const savedTheme = localStorage.getItem('theme');
				const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
				if ((savedTheme === 'dark') || (!savedTheme && prefersDark)) {
					document.documentElement.classList.add('dark-theme');
				}
				var dash = document.querySelector('.dashboard.no-theme');
				if (dash) dash.classList.remove('no-theme');
				})();
			`,
			tagPriority: 'critical',
		},
	],
});

const sidebarExpanded = ref(false);
const routeStore = useRouteStore();
const pageTitle = routeStore.getPageTitle();
const { initTheme } = useTheme();

onMounted(() => {
	initTheme();
});
</script>

<style scoped>
.dashboard {
	display: flex;
	min-height: 100vh;
	background-color: var(--color-background);
}

.dashboard.loading {
	opacity: 0;
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
