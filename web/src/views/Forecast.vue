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
import useYnab, { BudgetDates } from '@/composables/ynab';
import useNetWorth from '@/composables/netWorth';
import { LoadingStatus } from '@/composables/types';
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
    const { getNetWorth, getForecast, loadForecast, state, setForecastDateRange } = useYnab();
    const { reloadText, forecastStartDate, forecastEndDate, sliceForecastNetWorth } = useNetWorth();

    if (getForecast?.value?.length === 0) loadForecast();

    const ready = computed(() => getNetWorth?.value?.length > 0 && getForecast?.value?.length > 0);

    const spinLoadingIcon = computed(() => {
      const result = state.loadingForecastStatus === LoadingStatus.loading;
      return result;
    });

    const dateList = computed(() => {
      const combined = [...getNetWorth.value, ...getForecast.value];
      return createDateList(combined);
    });

    function dateSelected(payload: BudgetDates) {
      setForecastDateRange(payload);
    }

    const realNetWorth = computed(() => sliceForecastNetWorth(getNetWorth.value));
    const forecastNetWorth = computed(() => sliceForecastNetWorth(getForecast.value));

    function dateHighlighted() {
      console.log('dateHighlighted');
    }

    return {
      ready,
      realNetWorth,
      forecastNetWorth,
      startDate: forecastStartDate,
      endDate: forecastEndDate,
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

<style>
</style>
