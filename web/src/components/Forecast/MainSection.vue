<template>
  <section class="flex-grow">
    <ForecastGraph class="col-span-3 md:col-span-2 min-h-540 md:min-h-0 order-1 md:order-2" :netWorth="netWorth"
      :forecast="forecast" />
  </section>
</template>

<script setup lang="ts">
import ForecastGraph from '@/components/Graphs/Forecast.vue';
import { WorthDate } from '@/types';

defineProps<{ forecast: WorthDate[], netWorth: WorthDate[] }>()
</script>
