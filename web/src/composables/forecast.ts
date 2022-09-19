import { BackendType, LoadingStatus } from './types';
import useBackend from '@/composables/backend';
import { createDateList, isBetween } from '@/services/helper';
import { computed } from 'vue';
import { DateRange } from '@/types';

const { activeBackend, activeBackendType } = useBackend();

const forecast = activeBackend.value.forecast;

const forecastSlice = computed(() => {
  const data = forecast.value ?? [];
  const start = startDate.value;
  const end = endDate.value;
  if (!start || !end) return [];
  const filtered = data.filter(({ date }) => isBetween(new Date(date), new Date(start), new Date(end)));
  return filtered;
});

const reloadText = computed(() =>
  activeBackendType.value === BackendType.dummy ? 'Randomize Dummy Data' : 'Refresh',
);

const startDate = activeBackend.value.selectedForecastStartDate;
const endDate = activeBackend.value.selectedForecastEndDate;

const loadingStatus = activeBackend.value.loadingForecastStatus;

const spinLoadingIcon = computed(
  () => activeBackend.value.loadingForecastStatus.value === LoadingStatus.loading,
);

function loadData() {
  activeBackend.value.loadForecast();
}

function setDateRange(dateRange: DateRange) {
  activeBackend.value.setForecastDateRange(dateRange);
}

const dateList = computed(() => createDateList(forecast.value ?? []));

export default function useForecast() {
  return {
    loadData,
    setDateRange,
    dateList,
    forecast,
    forecastSlice,
    reloadText,
    startDate,
    endDate,
    loadingStatus,
    spinLoadingIcon,
  };
}
