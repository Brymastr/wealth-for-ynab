<template>
  <div class="h-400">
    <canvas id="testing-chart" width="400" height="400"></canvas>
  </div>
</template>

<script>
import { defineComponent, onMounted } from 'vue';
// import { Chart } from 'chart.js';
// @ts-ignore
import Chart from '@/components/ChartNative';

export default defineComponent({
  setup() {
    onMounted(() => {
      const ctx = document.getElementById('testing-chart').getContext('2d');

      // @ts-ignore
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
          datasets: [
            {
              label: '# of Votes',
              data: [12, 19, 3, 5, 2, 3],
              fill: 'origin',
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
              ],
              borderWidth: 1,
            },
          ],
        },
      });
    });
  },
});
</script>

<style>
</style>
