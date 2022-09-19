<template>
  <section class="flex-grow">
    <!-- graph area -->
    <div class="bg-gray-300 min-h-540 md:h-screen-1/2 px-3">
      <div class="xl:container mx-auto grid grid-cols-3 gap-x-5 h-full">
        <div class="flex flex-col justify-center md:col-span-1 col-span-3 order-2 mb-4 md:mb-0">
          <CurrentNetWorthSummary class="bg-gray-200 shadow-lg" v-if="selectedItem" :selectedItem="selectedItem" />
          <button class="text-right text-lg text-blue-400 font-medium" @click="goToForecast">
            Forecast >
          </button>
        </div>
        <NetWorthGraph class="col-span-3 md:col-span-2 min-h-540 md:min-h-0 order-1 md:order-2" :netWorth="netWorth"
          v-on:dateHighlighted="dateHighlighted" />
      </div>
    </div>

    <!-- stats area -->
    <div class="grid grid-cols-12 gap-5 xl:container mx-3 xl:mx-auto pt-5">
      <NetWorthStats class="col-span-12 md:col-span-7" :netWorth="netWorth" />
      <NetWorthTable class="col-span-12 md:col-span-5 row-span-2 max-h-500" :netWorth="netWorth" />
      <MonthlyAverage class="col-span-12 md:col-span-7" :netWorth="netWorth" />
    </div>
  </section>
</template>

<script setup lang="ts">
import CurrentNetWorthSummary from '@/components/General/CurrentNetWorthSummary.vue';
import NetWorthGraph from '@/components/Graphs/NetWorth.vue';
import NetWorthStats from '@/components/Stats/NetWorth.vue';
import NetWorthTable from '@/components/Tables/NetWorth.vue';
import MonthlyAverage from '@/components/Graphs/MonthlyAverage.vue';
import useBackend from '@/composables/backend';
import { useRouter } from 'vue-router';
import { PropType, ref, watch } from 'vue';
import { WorthDate } from '@/types';

const props = defineProps({
  netWorth: {
    type: Array as PropType<WorthDate[]>,
    required: true
  }
})

const router = useRouter();
const goToForecast = () => router.push({ name: 'Forecast' })

const selectedItem = ref(props.netWorth[props.netWorth.length - 1]);

function dateHighlighted(item: WorthDate) {
  selectedItem.value = item;
}

watch(
  () => props.netWorth,
  () => dateHighlighted(selectedItem.value),
);

</script>
