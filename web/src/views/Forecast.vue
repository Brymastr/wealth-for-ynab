<template>
  <div class="font-thin">
    <!-- header fix -->
    <div class="invisible h-header min-h-header"></div>

    <!-- loading replacement for utility bar -->
    <Spinner :on="!ready">Loading YNAB Data...</Spinner>

    <!-- utility bar -->
    <div class="h-header bg-blue-400 text-white px-3 xl:px-0" v-if="ready">
      <div class="xl:container mx-auto flex justify-between items-center">
        <DateSelect
          :dates="dateList"
          :startDate="startDate"
          :endDate="endDate"
          @dateSelected="dateSelected"
        />
        <ReloadIcon
          class="pl-3 h-full items-center"
          id="reload-net-worth"
          :rotate="spinLoadingIcon"
          :ready="ready"
          :action="reload"
          size="small"
          >{{ spinLoadingIcon || !ready ? 'Loading...' : reloadText }}</ReloadIcon
        >
      </div>
    </div>

    <!-- main section -->
    <section class="flex-grow" v-if="ready">
      <ForecastGraph
        class="col-span-3 md:col-span-2 min-h-540 md:min-h-0 order-1 md:order-2"
        :netWorth="realNetWorth"
        :forecast="forecastNetWorth"
        v-on:dateHighlighted="dateHighlighted"
      />
    </section>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import DateSelect from '@/components/General/DateSelect.vue';
import Spinner from '@/components/General/Spinner.vue';
import ForecastGraph from '@/components/Graphs/Forecast.vue';
import ReloadIcon from '@/components/Icons/ReloadIcon.vue';
import useNetWorth from '@/composables/netWorth';
import useForecast from '@/composables/forecast';
import { DateRange, LoadingStatus } from '@/composables/types';
import { createDateList } from '@/services/helper';

export default defineComponent({
  name: 'Forecast',
  components: {
    Spinner,
    DateSelect,
    ReloadIcon,
    ForecastGraph,
  },
  setup() {
    const { netWorthSlice, netWorth } = useNetWorth();
    const {
      reloadText,
      forecastSlice,
      forecast,
      loadData: loadForecast,
      spinLoadingIcon,
      startDate,
      endDate,
      setDateRange: setForecastDateRange,
    } = useForecast();

    if (forecast?.value?.length === 0) loadForecast();

    const ready = computed(() => netWorth?.value?.length > 0 && forecast?.value?.length > 0);

    const dateList = computed(() => {
      const combined = [...netWorth.value, ...forecast.value];
      return createDateList(combined);
    });

    function dateSelected(payload: DateRange) {
      setForecastDateRange(payload);
    }

    function dateHighlighted() {
      console.log('dateHighlighted');
    }

    return {
      ready,
      realNetWorth: netWorthSlice,
      forecastNetWorth: forecastSlice,
      startDate,
      endDate,
      reloadText,
      spinLoadingIcon,
      dateList,
      dateSelected,
      reload: loadForecast,
      dateHighlighted,
    };
  },
});
</script>
