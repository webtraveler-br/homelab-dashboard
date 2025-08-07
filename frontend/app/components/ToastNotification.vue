<template>
	<transition name="toast-slide">
		<div v-if="show" class="toast-notification" :class="type">
			<div class="toast-content">
				<span class="material-icons">{{ icon }}</span>
				<span>{{ message }}</span>
			</div>
			<span class="material-icons toast-close" @click="$emit('close')">close</span>
		</div>
	</transition>
</template>

<script setup lang="ts">
import type { NotificationType } from '@/stores/notification';

defineProps({
	show: {
		type: Boolean,
		default: false,
	},
	message: {
		type: String,
		default: '',
	},
	type: {
		type: String as () => NotificationType,
		default: 'info',
	},
	icon: {
		type: String,
		default: 'info',
	},
});

defineEmits(['close']);
</script>

<style scoped>

.toast-notification {
	position: fixed;
	top: 20px;
	left: 50%;
	transform: translateX(-50%);
	z-index: 9999;
	min-width: 300px;
	max-width: 90vw;
	padding: calc(var(--spacing-unit) * 1.5);
	border-radius: var(--border-radius);
	display: flex;
	justify-content: space-between;
	align-items: center;
	box-shadow: var(--shadow-md);
	transform-origin: top;
	background-color: var(--toast-bg-info);
	border-left: 4px solid var(--toast-border-info);
	color: var(--toast-color-info);
}

.toast-notification.success {
	background-color: var(--toast-bg-success);
	border-left: 4px solid var(--toast-border-success);
	color: var(--toast-color-success);
}
.toast-notification.error {
	background-color: var(--toast-bg-error);
	border-left: 4px solid var(--toast-border-error);
	color: var(--toast-color-error);
}
.toast-notification.warning {
	background-color: var(--toast-bg-warning);
	border-left: 4px solid var(--toast-border-warning);
	color: var(--toast-color-warning);
}

.toast-content {
	display: flex;
	align-items: center;
	gap: calc(var(--spacing-unit));
}

.toast-notification .material-icons {
	color: inherit;
}

.toast-close {
	cursor: pointer;
	font-size: 1.2rem;
	opacity: 0.7;
	transition: opacity var(--transition-fast);
}

.toast-close:hover {
	opacity: 1;
}

/* animação dos botões */
.toast-slide-enter-active,
.toast-slide-leave-active {
	transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.toast-slide-enter-from,
.toast-slide-leave-to {
	opacity: 0;
	transform: translate(-50%, -20px);
}
</style>
