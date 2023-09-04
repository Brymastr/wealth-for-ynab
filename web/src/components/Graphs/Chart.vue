<template>
  <div class="relative h-full w-full">
    <canvas :id="props.chartId" class="absolute h-full w-full"></canvas>
  </div>
</template>

<script setup lang="ts">
import {
  Chart,
  type ChartOptions,
  type ChartData,
  LinearScale,
  CategoryScale,
  LineController,
  PointElement,
  LineElement,
  BarElement,
  BarController,
  type ChartType,
  type ChartConfiguration,
  type Plugin,
} from 'chart.js';

// import ChartNative from '@/components/ChartNative';
import { onMounted, watch } from 'vue';
Chart.register(LinearScale);
Chart.register(CategoryScale);
Chart.register(LineController);
Chart.register(BarController);
Chart.register(PointElement);
Chart.register(LineElement);
Chart.register(BarElement);

const props = defineProps<{
  data: ChartData,
  chartId: string,
  options: ChartOptions,
  type: ChartType;
  plugins?: Plugin[],
}>()

let chart: Chart;

onMounted(() => {
  const { type, data, options, plugins } = props;

  const chartConfig: ChartConfiguration = {
    type,
    data,
    options,
    plugins,
  };

  chart = new Chart(props.chartId, chartConfig);
});

watch(
  () => props.data,
  newData => {
    chart.data = newData;
    chart.update();
  },
);
watch(
  () => props.options,
  newData => {
    chart.options = newData;
    chart.update();
  },
);
</script>
