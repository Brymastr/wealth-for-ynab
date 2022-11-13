import { BackendType, LoadingStatus } from './types';
import useBackend from '@/composables/backend';
import { createDateList, greaterOf } from '@/services/helper';
import { computed } from 'vue';
import { DateRangeIndices } from '@/types';

const { activeBackend, activeBackendType } = useBackend();

const forecast = activeBackend.value.forecast;
const startIndex = activeBackend.value.selectedForecastStartIndex;
const endIndex = activeBackend.value.selectedForecastEndIndex;
const loadingStatus = activeBackend.value.loadingForecastStatus;
const dateList = computed(() => createDateList(forecast.value ?? []));

const forecastSlice = computed(() => {
  const data = forecast.value ?? [];
  return data.slice(startIndex.value, endIndex.value ?? greaterOf(data.length - 1, 0));
});

const reloadText = computed(() =>
  activeBackendType.value === BackendType.dummy ? 'Randomize Dummy Data' : 'Refresh',
);

const spinLoadingIcon = computed(
  () => activeBackend.value.loadingForecastStatus.value === LoadingStatus.loading,
);

function loadData() {
  activeBackend.value.loadForecast();
}

function setDateRange(dateRange: DateRangeIndices) {
  activeBackend.value.setForecastDateRange(dateRange);
}

export default function useForecast() {
  return {
    loadData,
    setDateRange,
    dateList,
    forecast,
    forecastSlice,
    reloadText,
    startIndex,
    endIndex,
    loadingStatus,
    spinLoadingIcon,
  };
}
