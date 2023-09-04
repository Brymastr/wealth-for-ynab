<template>
  <Chart type="bar" :chartId="props.chartId" :data="props.data" :options="props.options" />
</template>


<script setup lang="ts">
import type { ChartOptions, ChartData, Plugin } from 'chart.js';
import Chart from '@/components/Graphs/Chart.vue';

const props = defineProps<{
  data: ChartData,
  chartId: string,
  options: ChartOptions,
  plugins?: Plugin[],
}>()

</script>
