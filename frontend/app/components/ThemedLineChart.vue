<template>
	<div class="tlc-root">
		<Line :key="themeKey" :data="chartData" :options="chartOptions" />
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, type Plugin, type Chart, type ChartOptions } from 'chart.js';
import { useTheme } from '@/composables/useTheme';

interface Props {
	labels: string[];
	values: number[];
	seriesLabel?: string;
	yTitle?: string;
	showLegend?: boolean;
	tension?: number;
	borderWidth?: number;
	pointRadius?: number;
	yMin?: number;
	yMax?: number;
}

const props = withDefaults(defineProps<Props>(), {
	seriesLabel: 'Série',
	yTitle: '',
	showLegend: true,
	tension: 0.3,
	borderWidth: 2,
	pointRadius: 3,
	yMin: undefined,
	yMax: undefined,
});

// Registrar escalas do Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Plugin para pintar o chartArea com a cor do tema
const chartAreaBackgroundPlugin: Plugin<'line', { color?: string }> = {
	id: 'chartAreaBackground',
	beforeDraw: (chart: Chart, _args, options) => {
		const { ctx, chartArea } = chart;
		if (!chartArea) return;
		ctx.save();
		ctx.fillStyle = (options?.color as string) || '#ffffff';
		ctx.fillRect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
		ctx.restore();
	},
};

// Evita múltiplos registros do plugin em hot-reload
let chartBgPluginRegistered = false;
if (!chartBgPluginRegistered) {
	ChartJS.register(chartAreaBackgroundPlugin);
	chartBgPluginRegistered = true;
}

// Plugin para sincronizar opções com as variáveis CSS do tema
const chartThemeSyncPlugin: Plugin<'line'> = {
	id: 'chartThemeSync',
	beforeUpdate: (chart) => {
		const styles = getComputedStyle(document.documentElement);
		const textColor = styles.getPropertyValue('--chart-text').trim() || '#333333';
		const gridColor = styles.getPropertyValue('--chart-grid').trim() || 'rgba(0,0,0,0.1)';
		const tooltipBg = styles.getPropertyValue('--chart-tooltip-bg').trim() || '#ffffff';
		const tooltipText = styles.getPropertyValue('--chart-tooltip-text').trim() || '#333333';
		const tooltipBorder = styles.getPropertyValue('--chart-tooltip-border').trim() || '#d9833b';
		const bgColor = styles.getPropertyValue('--chart-bg').trim() || '#ffffff';

		const opts = chart.options as ChartOptions<'line'> & { plugins?: { chartAreaBackground?: { color?: string } } };
		if (opts.plugins?.legend?.labels) {
			opts.plugins.legend.labels.color = textColor;
		}
		if (opts.plugins?.tooltip) {
			opts.plugins.tooltip.backgroundColor = tooltipBg;
			opts.plugins.tooltip.titleColor = tooltipText;
			opts.plugins.tooltip.bodyColor = tooltipText;
			opts.plugins.tooltip.borderColor = tooltipBorder;
		}
		if (opts.plugins?.chartAreaBackground) {
			opts.plugins.chartAreaBackground.color = bgColor;
		}
		if (opts.scales?.x?.ticks) opts.scales.x.ticks.color = textColor;
		if (opts.scales?.x?.grid) opts.scales.x.grid.color = gridColor;
		if (opts.scales?.y?.ticks) opts.scales.y.ticks.color = textColor;
		if (opts.scales?.y?.grid) opts.scales.y.grid.color = gridColor;
	},
};

let chartThemeSyncRegistered = false;
if (!chartThemeSyncRegistered) {
	ChartJS.register(chartThemeSyncPlugin);
	chartThemeSyncRegistered = true;
}

const { isDarkTheme } = useTheme();
const themeKey = computed(() => (isDarkTheme.value ? 'dark' : 'light'));

const chartOptions = computed(() => {
	// dependência reativa para reavaliar quando o tema mudar
	const _theme = isDarkTheme.value;
	const styles = getComputedStyle(document.documentElement);
	const textColor = styles.getPropertyValue('--chart-text').trim() || '#333333';
	const gridColor = styles.getPropertyValue('--chart-grid').trim() || 'rgba(0,0,0,0.1)';
	const tooltipBg = styles.getPropertyValue('--chart-tooltip-bg').trim() || '#ffffff';
	const tooltipText = styles.getPropertyValue('--chart-tooltip-text').trim() || '#333333';
	const tooltipBorder = styles.getPropertyValue('--chart-tooltip-border').trim() || '#d9833b';
	const bgColor = styles.getPropertyValue('--chart-bg').trim() || '#ffffff';

	return {
		responsive: true,
		maintainAspectRatio: false,
		animation: { duration: 800 },
		interaction: { mode: 'index' as const, intersect: false },
		plugins: {
			legend: {
				labels: { color: textColor, usePointStyle: true },
				display: props.showLegend,
				position: 'top' as const,
			},
			tooltip: {
				backgroundColor: tooltipBg,
				titleColor: tooltipText,
				bodyColor: tooltipText,
				borderColor: tooltipBorder,
				borderWidth: 2,
				padding: 10,
				usePointStyle: true,
			},
			chartAreaBackground: { color: bgColor },
		},
		scales: {
			y: {
				beginAtZero: true,
				min: props.yMin,
				max: props.yMax,
				title: { display: !!props.yTitle, text: props.yTitle, color: textColor },
				ticks: { color: textColor },
				grid: { color: gridColor },
			},
			x: {
				ticks: { color: textColor, maxRotation: 45, minRotation: 45 },
				grid: { color: gridColor },
			},
		},
	} as const;
});

const chartData = computed(() => {
	// dependência reativa para reavaliar quando o tema mudar
	const _theme = isDarkTheme.value;
	const styles = getComputedStyle(document.documentElement);
	const line = styles.getPropertyValue('--chart-line').trim() || '#d9833b';
	const point = styles.getPropertyValue('--chart-point').trim() || line;

	return {
		labels: props.labels,
		datasets: [
			{
				label: props.seriesLabel,
				data: props.values,
				fill: false,
				borderColor: line,
				backgroundColor: point,
				pointBackgroundColor: point,
				pointBorderColor: line,
				borderWidth: props.borderWidth,
				tension: props.tension,
				pointRadius: props.pointRadius,
				pointHoverRadius: Math.max(5, props.pointRadius + 2),
			},
		],
	} as const;
});
</script>

<style scoped>
.tlc-root {
	height: 100%;
	width: 100%;
	min-height: 550px;
	background-color: var(--chart-bg);
}

.chart-card {
	min-height: 650px;
}

.chart-container {
	height: 600px;
	position: relative;
	padding: calc(var(--spacing-unit) * 2);
	background-color: var(--chart-bg);
	border-radius: var(--border-radius);
	box-shadow: var(--shadow-md);
	border: 1px solid rgba(0, 0, 0, 0.1);
}

.chart-wrapper {
	height: 100%;
	width: 100%;
	min-height: 550px;
	background-color: var(--chart-bg);
}

.loading-spinner,
.error-message,
.no-data {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100%;
	color: var(--chart-text);
	background-color: var(--chart-bg);
}
</style>
