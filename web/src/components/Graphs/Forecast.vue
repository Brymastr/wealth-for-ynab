<template>
  <LineGraph chart-id="forecast-graph" class="line-graph cursor-pointer" :data="graphData" :options="graphOptions" />
</template>

<script lang="ts">
import LineGraph from '@/components/Graphs/LineGraph.vue';
import { formatCurrency, formatDate } from '@/services/helper';
import { ChartData, ChartOptions, ChartDataset, ChartEvent, ActiveElement } from 'chart.js';
import { BLUE } from '@/colors';
import { computed, PropType, ref, defineComponent } from 'vue';
import { WorthDate } from '@/types';

interface Props {
  netWorth: WorthDate[];
  forecast: WorthDate[];
  changeGraph: boolean;
}

export default defineComponent({
  name: 'Forecast Graph',
  components: { LineGraph },
  props: {
    netWorth: {
      type: Object as PropType<WorthDate[]>,
      required: true,
    },
    forecast: {
      type: Object as PropType<WorthDate[]>,
      required: true,
    },
    changeGraph: {
      type: Boolean,
      default: false,
    },
  },
  setup(props: Props, { emit }) {
    const selectedDate = ref<WorthDate>(props.netWorth[props.netWorth.length - 1]);
    const selectedDateIndex = ref<number>(props.netWorth.length - 1);

    function tickCallback(tickValue: string | number) {
      return formatCurrency(tickValue, false);
    }

    function dateHighlighted(highlighted: WorthDate, index: number) {
      highlighted.index = index;
      selectedDate.value = highlighted;
      emit('dateHighlighted', highlighted);
    }

    function onHover(event: ChartEvent, elements: ActiveElement[]) {
      if (elements.length === 0) return;

      const index = elements[0].index;
      if (index === selectedDateIndex.value) return;

      selectedDateIndex.value = index;

      const selected = Object.assign({}, props.netWorth[index]);
      if (index > 0) selected.previous = Object.assign({}, props.netWorth[index - 1]);

      selectedDate.value = selected;

      dateHighlighted(selectedDate.value, selectedDateIndex.value);
    }

    const graphData = computed(() => {
      const combined = [...props.netWorth, ...props.forecast];
      const labels = combined.map(({ date }) => formatDate(date));
      const actual = props.netWorth.map(({ worth }) => worth);
      const lastActual = actual[actual.length - 1];
      const nullActual = actual.map(() => null);
      nullActual.pop();
      const forecast = [...nullActual, lastActual, ...props.forecast.map(({ worth }) => worth)];

      const datasets: ChartDataset[] = [
        {
          label: 'Actual',
          data: actual,
          fill: 'origin',
          backgroundColor: 'rgb(98, 179, 237, 0.5)',
          pointBackgroundColor: 'rgb(98, 179, 237)',
          pointRadius: 2.5,
          pointHoverRadius: 5,
          pointBorderWidth: 0,
          tension: 0.3,
        },
        {
          label: 'Forecast',
          data: forecast,
          fill: 'origin',
          backgroundColor: 'rgb(98, 179, 237, 0.5)',
          pointBackgroundColor: 'rgb(222, 156, 24)',
          pointRadius: 2.5,
          pointHoverRadius: 5,
          pointBorderWidth: 0,
          tension: 0.3,
        },
      ];

      const chartData: ChartData = { labels, datasets };

      return chartData;
    });

    const graphOptions = computed(() => {
      const options: ChartOptions = {
        layout: {
          padding: {
            right: 10,
            left: 10,
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        events: ['mousemove', 'click'],
        hover: {
          mode: 'index',
          intersect: false,
        },
        onHover,
        elements: {
          point: {
            pointStyle: 'circle',
            borderWidth: 0,
            backgroundColor: BLUE,
          },
        },
        scales: {
          y: {
            beginAtZero: false,
            ticks: {
              callback: tickCallback,
              mirror: true,
              labelOffset: -10,
              padding: -4,
            },
            grid: {
              drawBorder: false,
            },
          },
          x: {
            ticks: {
              display: false,
            },
            grid: {
              display: false,
            },
          },
        },
        plugins: {
          tooltip: {
            enabled: false,
          },
          legend: {
            display: false,
          },
        },
      };

      return options;
    });

    return { graphData, graphOptions, dateHighlighted };
  },
});
</script>

<style lang="postcss" scoped>
.line-graph {
  clip-path: inset(8px 0);
}
</style>
