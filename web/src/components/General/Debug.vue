<template>
  <div class="absolute top-10 left-5 z-50 text-white bg-gray-600 p-5 rounded-sm flex flex-col">
    <div class="flex">
      <p class="font-bold pr-24 pb-2">Debug component</p>
    </div>
    <div class="flex justify-between" v-for="[label, value], index in info" :key="index">
      <p>{{ label }}:</p>
      <p>{{ value }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import useBackend from '@/composables/backend'
import useNetWorth from '@/composables/netWorth';
import { LoadingStatus } from '@/composables/types';


const { netWorth, netWorthSlice, startIndex, endIndex, startDate, endDate } = useNetWorth()
const { activeBackendType, activeBackend } = useBackend()
const isBudgetSelected = activeBackend.value.isThereASelectedBudget

const netWorthTotalLength = computed(() => netWorth.value?.length)
const netWorthSliceLength = computed(() => netWorthSlice.value.length)
const budgetName = computed(() => activeBackend.value.selectedBudgetName.value ?? 0)

const ready = computed(() => isBudgetSelected.value && netWorthSlice.value !== undefined && netWorthSlice.value.length > 0);
const netWorthLoadingStatus = computed(() => LoadingStatus[activeBackend.value.loadingNetWorthStatus.value])
const forecastLoadingStatus = computed(() => LoadingStatus[activeBackend.value.loadingForecastStatus.value])

const info = [
  ['Active Backend', activeBackendType],
  ['Budget is Selected', isBudgetSelected],
  ['Active Budget', budgetName],
  ['NW Total Length', netWorthTotalLength],
  ['NW Slice Length', netWorthSliceLength],
  ['Start Index', startIndex],
  ['End Index', endIndex],
  ['Start Date', startDate],
  ['End Date', endDate],
  ['Ready', ready],
  ['NW Loading Status', netWorthLoadingStatus],
  ['F Loading Status', forecastLoadingStatus],
]
</script>
