<template>
  <section class="grid grid-cols-3 xl:grid-cols-6 gap-5 xl:container py-5 mx-3 xl:mx-auto">
    <!-- graph area -->
    <CurrentNetWorthSummary class="col-span-3 order-2 xl:col-span-2 xl:order-1" v-if="selectedItem"
      :selectedItem="selectedItem" :netWorth="props.netWorth" />
    <NetWorthGraph class=" h-screen-2/5 col-span-3 order-1 xl:col-span-4 xl:order-2" :netWorth="props.netWorth"
      v-on:dateHighlighted="dateHighlighted" />

    <!-- stats area -->
    <NetChange class="order-3" :netWorth="props.netWorth" />
    <AverageChange class="order-4" :netWorth="props.netWorth" />
    <PositiveMonths class="order-5" :netWorth="props.netWorth" />
    <NegativeMonths class="order-6" :netWorth="props.netWorth" />
    <BestMonth class="order-7" :netWorth="props.netWorth" />
    <WorstMonth class="order-8" :netWorth="props.netWorth" />
  </section>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import CurrentNetWorthSummary from '@/components/General/CurrentNetWorthSummary.vue';
import NetWorthGraph from '@/components/Graphs/NetWorth.vue';
import NetChange from '@/components/Stats/NetChange.vue';
import AverageChange from '@/components/Stats/AverageChange.vue';
import PositiveMonths from '@/components/Stats/PositiveMonths.vue';
import NegativeMonths from '@/components/Stats/NegativeMonths.vue';
import BestMonth from '@/components/Stats/BestMonth.vue';
import WorstMonth from '@/components/Stats/WorstMonth.vue';
import type { WorthDate } from '@/types';
const props = defineProps<{ netWorth: WorthDate[] }>()

const selectedItem = ref(props.netWorth[props.netWorth.length - 1]);

function dateHighlighted(item: WorthDate) {
  selectedItem.value = item;
}

watch(
  () => props.netWorth,
  () => dateHighlighted(selectedItem.value),
);

</script>
