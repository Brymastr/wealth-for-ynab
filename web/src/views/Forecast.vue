<template>
  <div class="font-thin">
    <!-- header fix -->
    <HeaderFix />

    <!-- loading replacement for utility bar -->
    <Spinner v-if="!ready">Loading YNAB Data...</Spinner>

    <!-- utility bar -->
    <ForecastUtilityBar v-if="ready" :dateList="dateList" :startIndex="combinedStartIndex" :endIndex="combinedEndIndex"
      @dateSelected="dateSelected" />

    <!-- main section -->
    <ForecastMainSection v-if="ready" :netWorth="netWorthSlice" :forecast="forecastSlice" />

  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

// Components
import Spinner from '@/components/General/Spinner.vue';
import ForecastUtilityBar from '@/components/Forecast/UtilityBar.vue';
import ForecastMainSection from '@/components/Forecast/MainSection.vue';
import HeaderFix from '@/components/General/HeaderFix.vue';

import useNetWorth from '@/composables/netWorth';
import useForecast from '@/composables/forecast';
import { createDateList } from '@/services/helper';
import type { DateRangeIndices, WorthDate } from '@/types';

const { netWorth } = useNetWorth();
const { forecast, loadData: loadForecast } = useForecast();

if (forecast?.value?.length === 0) loadForecast();

const ready = computed(() => netWorth.value && netWorth.value.length > 0 && forecast.value && forecast.value?.length > 0);

const forecastStartsAt = computed(() => (netWorth.value as WorthDate[]).length)

const combinedStartIndex = ref(0)

const combinedEndIndex = ref(forecastStartsAt.value - 1 + (forecast.value?.length ?? 0))

const netWorthSlice = computed(() => netWorth.value?.slice(combinedStartIndex.value, combinedEndIndex.value) ?? [])

const forecastSlice = computed(() => forecast.value?.slice(combinedStartIndex.value, combinedEndIndex.value) ?? [])

const dateList = computed(() => {
  const combined = [...(netWorth.value ?? []), ...(forecast.value ?? [])];
  return createDateList(combined);
});

function dateSelected({ startIndex, endIndex }: DateRangeIndices) {
  combinedStartIndex.value = startIndex
  combinedEndIndex.value = endIndex
}

</script>
