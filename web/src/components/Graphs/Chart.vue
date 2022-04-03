<template>
  <div class="relative h-full w-full">
    <canvas :id="chartId" class="absolute h-full w-full"></canvas>
  </div>
</template>

<script lang="ts">
import {
  Chart,
  ChartOptions,
  ChartData,
  LinearScale,
  CategoryScale,
  LineController,
  PointElement,
  LineElement,
  BarElement,
  BarController,
  ChartType,
  ChartConfiguration,
  Plugin,
} from 'chart.js';

// import ChartNative from '@/components/ChartNative';
import { defineComponent, PropType, onMounted, watch } from 'vue';
Chart.register(LinearScale);
Chart.register(CategoryScale);
Chart.register(LineController);
Chart.register(BarController);
Chart.register(PointElement);
Chart.register(LineElement);
Chart.register(BarElement);

interface Props {
  data: ChartData;
  chartId: string;
  options: ChartOptions;
  type: ChartType;
  plugins: Plugin[];
}

export default defineComponent({
  name: 'Base Chart',
  props: {
    chartId: {
      type: String,
      required: true,
    },
    type: {
      type: String as PropType<ChartType>,
      default: 'line',
    },
    data: {
      type: Object as PropType<ChartData>,
      required: true,
    },
    options: {
      type: Object as PropType<ChartOptions>,
      required: true,
    },
    plugins: {
      type: Array as PropType<Plugin[]>,
      default: () => [],
    },
  },
  setup(props: Props) {
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
  },
});
</script>
