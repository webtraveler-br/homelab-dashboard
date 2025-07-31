<template>
	<div class="dashboard-content">
		<div class="welcome-header">
			<h2>Bem-vindo ao HomeLab</h2>
			<p class="subtitle">Plataforma para gerenciamento de projetos do portfólio</p>
		</div>

		<div class="dashboard-grid">
			<div class="dashboard-card status-card">
				<div class="card-header">
					<span class="material-icons">pets</span>
					<h3>Status dos Gatos</h3>
				</div>
				<div class="card-content">
					<p>Monitore a presença dos seus gatos em tempo real.</p>
					<button class="btn btn-primary" @click="$router.push('/gatos')">Ver Monitoramento</button>
				</div>
			</div>

			<div class="dashboard-card">
				<div class="card-header">
					<span class="material-icons">photo_camera</span>
					<h3>Foto Recente</h3>
				</div>
				<div class="card-content">
					<div class="cat-photo">
						<img src="/assets/images/gatos.jpg" alt="Gato fofo" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
// Página inicial: Dashboard com cards e informações
</script>

<style scoped>
.dashboard-content {
	max-width: 1200px;
	margin: 0 auto;
}

.welcome-header {
	margin-bottom: calc(var(--spacing-unit) * 4);
	text-align: center;
}

.welcome-header h2 {
	font-size: 2rem;
	margin-bottom: calc(var(--spacing-unit));
	color: var(--color-text);
}

.subtitle {
	font-size: 1.1rem;
	color: var(--color-text-muted);
	margin-top: 0;
}

.dashboard-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
	gap: calc(var(--spacing-unit) * 3);
}

.dashboard-card {
	background-color: var(--color-background-alt);
	border-radius: var(--border-radius);
	box-shadow: var(--shadow-md);
	overflow: hidden;
	transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.dashboard-card:hover {
	transform: translateY(-4px);
	box-shadow: var(--shadow-lg);
}

.card-header {
	display: flex;
	align-items: center;
	gap: calc(var(--spacing-unit) * 1.5);
	padding: calc(var(--spacing-unit) * 2);
	background-color: var(--color-primary);
	color: white;
}

.card-header h3 {
	margin: 0;
	font-size: 1.2rem;
}

.card-content {
	padding: calc(var(--spacing-unit) * 3);
}

.status-card .card-content {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: calc(var(--spacing-unit) * 2);
}

.btn {
	padding: calc(var(--spacing-unit) * 1.25) calc(var(--spacing-unit) * 2);
	border: none;
	border-radius: var(--border-radius);
	font-weight: 500;
	cursor: pointer;
	transition: background-color var(--transition-fast);
}

.btn-primary {
	background-color: var(--color-primary);
	color: white;
}

.btn-primary:hover {
	background-color: var(--color-primary-light);
}

.cat-photo {
	overflow: hidden;
	border-radius: var(--border-radius);
}

.cat-photo img {
	width: 100%;
	height: auto;
	display: block;
	transition: transform var(--transition-fast);
}

.cat-photo:hover img {
	transform: scale(1.03);
}
</style>
