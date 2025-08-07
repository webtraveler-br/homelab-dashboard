import { useNotificationStore } from '@/stores/notification';
import type { NotificationType } from '@/stores/notification';

// Composable para facilitar o uso de notificações em qualquer lugar do site
export function useToast() {
	const store = useNotificationStore();

	// Exibe uma notificação toast
	function show(message: string, type: NotificationType = 'info', duration = 5000) {
		store.show(message, type, duration);
	}

	// Toast de sucesso
	function success(message: string) {
		show(message, 'success');
	}

	// Toast de erro
	function error(message: string) {
		show(message, 'error');
	}

	// Toast de aviso
	function warning(message: string) {
		show(message, 'warning');
	}

	// Toast de info
	function info(message: string) {
		show(message, 'info');
	}

	// Esconde o toast atual
	function hide() {
		store.hide();
	}

	return {
		show,
		success,
		error,
		warning,
		info,
		hide,
	};
}
