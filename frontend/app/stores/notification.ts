import { defineStore } from 'pinia';
import { ref } from 'vue';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationData {
	show: boolean;
	message: string;
	type: NotificationType;
	icon: string;
	timeout: ReturnType<typeof setTimeout> | null;
}

export const useNotificationStore = defineStore('notification', () => {
	const notification = ref<NotificationData>({
		show: false,
		message: '',
		type: 'info',
		icon: 'info',
		timeout: null,
	});

	// Icones para cada tipo de notificação
	const typeIcons: Record<NotificationType, string> = {
		success: 'check_circle',
		error: 'error',
		warning: 'warning',
		info: 'info',
	};

	// Exibe uma notificação toast para o usuário
	function show(message: string, type: NotificationType = 'info', duration = 5000) {
		if (notification.value.timeout) {
			clearTimeout(notification.value.timeout);
			notification.value.timeout = null;
		}

		const icon = typeIcons[type] || typeIcons.info;

		notification.value = {
			show: true,
			message,
			type,
			icon,
			timeout: null,
		};

		if (duration > 0) {
			notification.value.timeout = setTimeout(() => {
				hide();
			}, duration);
		}
	}

	// Esconde o toast manualmente ou pelo timeout
	function hide() {
		if (notification.value.timeout) {
			clearTimeout(notification.value.timeout); // Garante que não fica pendente
		}
		notification.value.show = false;
		notification.value.timeout = null;
	}

	return {
		notification,
		show,
		hide,
	};
});
