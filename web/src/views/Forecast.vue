<template>
  <div class="font-thin">
    <!-- header fix -->
    <HeaderFix />

    <!-- loading replacement for utility bar -->
    <Spinner :on="!ready">Loading YNAB Data...</Spinner>

    <!-- utility bar -->
    <div class="h-header bg-blue-400 text-white px-3 xl:px-0" v-if="ready">
      <div class="xl:container mx-auto flex justify-between items-center">
        <DateRangeComponent :dateList="dateList" :startIndex="(startIndex as number)" :endIndex="(endIndex as number)"
          @dateSelected="dateSelected" />
        <ReloadIcon class="pl-3 h-full items-center" id="reload-net-worth" :rotate="spinLoadingIcon" :ready="ready"
          :action="loadForecast" size="small">{{ spinLoadingIcon || !ready ? 'Loading...' : reloadText }}</ReloadIcon>
      </div>
    </div>

    <!-- main section -->
    <section class="flex-grow" v-if="ready">
      <ForecastGraph class="col-span-3 md:col-span-2 min-h-540 md:min-h-0 order-1 md:order-2" :netWorth="netWorthSlice"
        :forecast="forecastSlice" v-on:dateHighlighted="dateHighlighted" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import DateRangeComponent from '@/components/General/DateRange.vue';
import Spinner from '@/components/General/Spinner.vue';
import ForecastGraph from '@/components/Graphs/Forecast.vue';
import ReloadIcon from '@/components/Icons/ReloadIcon.vue';
import useNetWorth from '@/composables/netWorth';
import useForecast from '@/composables/forecast';
import { createDateList } from '@/services/helper';
import { DateRange } from '@/types';
import HeaderFix from '@/components/General/HeaderFix.vue';

const { netWorthSlice, netWorth } = useNetWorth();
const {
  reloadText,
  forecastSlice,
  forecast,
  loadData: loadForecast,
  spinLoadingIcon,
  startIndex,
  endIndex,
  setDateRange: setForecastDateRange,
} = useForecast();

if (forecast?.value?.length === 0) loadForecast();

const ready = computed(() => netWorth.value && netWorth.value.length > 0 && forecast.value && forecast?.value?.length > 0);

const dateList = computed(() => {
  const combined = [...(netWorth.value ?? []), ...(forecast.value ?? [])];
  return createDateList(combined);
});

function dateSelected(payload: DateRange) {
  setForecastDateRange(payload);
}

function dateHighlighted() {
  console.log('dateHighlighted');
}
</script>
