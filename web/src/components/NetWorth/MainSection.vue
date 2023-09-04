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
        <NetWorthGraph class="col-span-3 md:col-span-2 min-h-540 md:min-h-0 order-1 md:order-2" :netWorth="props.netWorth"
          v-on:dateHighlighted="dateHighlighted" />
      </div>
    </div>

    <!-- stats area -->
    <div id="stats-area" class="xl:container xl:mx-auto pt-5">
      <NetWorthStats class="net-worth-stats" :netWorth="props.netWorth" />
      <MonthlyAverage class="monthly-average" :netWorth="props.netWorth" />
      <NetWorthTable class="net-worth-table" :netWorth="props.netWorth" :selectedItem="selectedItem"
        v-on:dateHighlighted="dateHighlighted" />
      <InvestmentEquivalent class="investment-equivalent" :netWorth="props.netWorth" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import CurrentNetWorthSummary from '@/components/General/CurrentNetWorthSummary.vue';
import NetWorthGraph from '@/components/Graphs/NetWorth.vue';
import NetWorthStats from '@/components/Stats/NetWorth.vue';
import NetWorthTable from '@/components/Tables/NetWorth.vue';
import MonthlyAverage from '@/components/Graphs/MonthlyAverage.vue';
import InvestmentEquivalent from '@/components/Stats/InvestmentEquivalent.vue';
import type { WorthDate } from '@/types';
const props = defineProps<{ netWorth: WorthDate[] }>()

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

<style>
div#stats-area {
  display: grid;
  gap: 1.25rem;
  padding-top: 1.25rem;
  grid-template-rows: 190px 400px;
  grid-template-columns: 7fr 5fr;
  grid-template-areas:
    "net-worth-stats net-worth-table"
    "monthly-average net-worth-table"
    "investment-equivalent .";
}

div#stats-area>div.net-worth-stats {
  grid-area: net-worth-stats;
}

div#stats-area>div.net-worth-table {
  grid-area: net-worth-table;
}

div#stats-area>div.monthly-average {
  grid-area: monthly-average;
}

div#stats-area>.investment-equivalent {
  grid-area: investment-equivalent;
}
</style>
