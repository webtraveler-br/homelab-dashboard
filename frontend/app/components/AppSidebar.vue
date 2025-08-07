<template>
	<aside :class="['sidebar', { expanded }]" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
		<div class="sidebar-header">
			<span class="material-icons logo-icon">hub</span>
			<h2 v-if="expanded" class="logo-text">HomeLab</h2>
		</div>
		<nav class="sidebar-nav">
			<ul>
				<li v-for="item in navItems" :key="item.name" :class="{ active: isActive(item.name) }" @click="goTo(item.name)">
					<span class="material-icons">{{ item.icon }}</span>
					<span v-if="expanded" class="nav-text">{{ item.label }}</span>
				</li>
			</ul>
		</nav>
		<div class="sidebar-footer">
			<span class="material-icons">info</span>
			<span v-if="expanded" class="footer-text">dev</span>
		</div>
	</aside>
</template>

<script setup lang="ts">
import { useRouteStore } from '@/stores/route';

const props = defineProps({
	expanded: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(['update:expanded']);
const routeStore = useRouteStore();
const { isActive, goTo } = routeStore;

const navItems = routeStore.routes;

function onMouseEnter() {
	emit('update:expanded', true);
}

function onMouseLeave() {
	emit('update:expanded', false);
}
</script>

<style scoped>
/* Sidebar styles */
.sidebar {
	background: var(--sidebar-bg);
	color: var(--sidebar-text);
	width: var(--sidebar-width-collapsed);
	transition: width var(--transition-medium), 
			background var(--transition-medium),
			color var(--transition-medium),
			box-shadow var(--transition-medium);
	display: flex;
	flex-direction: column;
	align-items: center;
	box-shadow: var(--shadow-md);
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	z-index: 10;
	overflow-x: hidden;
	overflow-y: auto;
}

.sidebar.expanded {
	width: var(--sidebar-width-expanded);
	align-items: flex-start;
}

.sidebar-header {
	display: flex;
	align-items: center;
	padding: calc(var(--spacing-unit) * 2.5) calc(var(--spacing-unit) * 2);
	margin-bottom: calc(var(--spacing-unit) * 2);
	width: 100%;
	gap: calc(var(--spacing-unit) * 1.5);
}

.logo-icon {
	font-size: 1.8rem;
	color: var(--color-primary-light);
}

.logo-text {
	font-size: 1.3rem;
	font-weight: 600;
	margin: 0;
	color: var(--color-primary-light);
}

.sidebar-nav {
	width: 100%;
	flex: 1;
}

.sidebar-nav ul {
	list-style: none;
	padding: 0;
	margin: 0;
}

.sidebar-nav li {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: calc(var(--spacing-unit) * 2);
	cursor: pointer;
	padding: calc(var(--spacing-unit) * 1.5) calc(var(--spacing-unit) * 2.5);
	margin: calc(var(--spacing-unit) * 0.5) calc(var(--spacing-unit) * 1.5);
	border-radius: var(--border-radius);
	transition: all var(--transition-fast);
}

.sidebar-nav li:hover {
	background: var(--sidebar-bg-hover);
}

.sidebar-nav li.active {
	background-color: var(--color-primary);
	box-shadow: var(--shadow-sm);
}

.sidebar-nav li.active .material-icons,
.sidebar-nav li.active .nav-text {
	color: white;
}

.sidebar.expanded .sidebar-nav li {
	justify-content: unset;
}

.nav-text {
	font-weight: 500;
	white-space: nowrap;
}

.sidebar-footer {
	width: 100%;
	padding: calc(var(--spacing-unit) * 2) calc(var(--spacing-unit) * 2.5);
	display: flex;
	align-items: center;
	gap: calc(var(--spacing-unit) * 1.5);
	opacity: 0.7;
	border-top: 1px solid var(--border-color);
}
</style>
