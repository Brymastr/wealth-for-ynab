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
      <!-- graph area -->
      <div class="bg-gray-300 min-h-540 md:h-screen-1/2 px-3">
        <div class="xl:container mx-auto grid grid-cols-3 gap-x-5 h-full">
          <div class="flex flex-col justify-center md:col-span-1 col-span-3 order-2 mb-4 md:mb-0">
            <CurrentNetWorthSummary
              class="bg-gray-200 shadow-lg"
              v-if="selectedItem"
              :selectedItem="selectedItem"
            />
            <button class="text-right text-lg text-blue-400 font-medium" @click="goToForecast">
              Forecast >
            </button>
          </div>
          <NetWorthGraph
            class="col-span-3 md:col-span-2 min-h-540 md:min-h-0 order-1 md:order-2"
            :netWorth="netWorth"
            v-on:dateHighlighted="dateHighlighted"
          />
        </div>
      </div>

      <!-- stats area -->
      <div class="grid grid-cols-12 gap-5 xl:container mx-3 xl:mx-auto pt-5">
        <NetWorthStats class="col-span-12 md:col-span-7" :netWorth="netWorth" />
        <NetWorthTable class="col-span-12 md:col-span-5 row-span-2 max-h-500" :netWorth="netWorth" />
        <MonthlyAverage class="col-span-12 md:col-span-7" :netWorth="netWorth" />
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import DateSelect from '@/components/General/DateSelect.vue';
import Spinner from '@/components/General/Spinner.vue';
import CurrentNetWorthSummary from '@/components/General/CurrentNetWorthSummary.vue';
import NetWorthGraph from '@/components/Graphs/NetWorth.vue';
import NetWorthStats from '@/components/Stats/NetWorth.vue';
import NetWorthTable from '@/components/Tables/NetWorth.vue';
import ReloadIcon from '@/components/Icons/ReloadIcon.vue';
import MonthlyAverage from '@/components/Graphs/MonthlyAverage.vue';
import { DateRange, WorthDate } from '@/composables/types';
import useNetWorth from '@/composables/netWorth';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'Net Worth',
  components: {
    Spinner,
    DateSelect,
    ReloadIcon,
    MonthlyAverage,
    NetWorthGraph,
    NetWorthStats,
    NetWorthTable,
    CurrentNetWorthSummary,
  },
  setup() {
    const {
      loadData: reload,
      netWorth,
      netWorthSlice,
      reloadText,
      startDate,
      endDate,
      loadingStatus,
      spinLoadingIcon,
      dateList,
      setDateRange,
    } = useNetWorth();
    const router = useRouter();

    function defaultSelectedItem() {
      const data = netWorthSlice.value ?? [];
      return data[data.length - 1];
    }

    const selectedItem = ref<WorthDate>(defaultSelectedItem());

    function dateHighlighted(item: WorthDate) {
      selectedItem.value = item;
    }

    const ready = computed(() => netWorth.value && netWorth.value.length > 0);

    watch(
      () => netWorth.value,
      () => dateHighlighted(defaultSelectedItem()),
    );

    return {
      reload,
      dateHighlighted,
      netWorth: netWorthSlice,
      dateList,
      reloadText,
      loading: loadingStatus,
      startDate,
      endDate,
      selectedItem,
      ready,
      spinLoadingIcon,
      goToForecast: () => router.push({ name: 'Forecast' }),
      dateSelected: (payload: DateRange) => setDateRange(payload),
    };
  },
});
</script>
