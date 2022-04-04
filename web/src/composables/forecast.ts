import { DateRange, LoadingStatus, WorthDate } from './types';
import useBackend from '@/composables/backend';
import useDummy from '@/composables/dummy';
import useYnab from '@/composables/ynab';
import { createDateList, isBetween } from '@/services/helper';
import { computed, ComputedRef } from 'vue';

const { isDummy, isYnab } = useBackend();

const forecast = computed(() => {
  let result: ComputedRef<WorthDate[]> = computed(() => []);
  if (isYnab.value) {
    const { getForecast, loadForecast } = useYnab();
    if (!getForecast.value) loadForecast();
    result = getForecast;
  } else if (isDummy.value) {
    const { getForecast, loadForecast } = useDummy();
    if (!getForecast.value) loadForecast();
    result = getForecast;
  }
  return result.value;
});

const forecastSlice = computed(() => {
  const data = forecast.value;
  const start = startDate.value;
  const end = endDate.value;
  if (!start || !end) return [];
  const filtered = data.filter(({ date }) => isBetween(new Date(date), new Date(start), new Date(end)));
  return filtered;
});

const reloadText = computed(() => {
  let text = 'Refresh';
  if (isDummy.value) {
    text = 'Randomize Dummy Data';
  }
  return text;
});

const startDate = computed(() => {
  let result: string;
  if (isYnab.value) {
    const { getSelectedForecastStartDate } = useYnab();
    result = getSelectedForecastStartDate.value ?? '';
  } else if (isDummy.value) {
    const { selectedForecastStartDate } = useDummy();
    result = selectedForecastStartDate.value ?? '';
  } else {
    result = 'oopsie';
  }
  return result;
});

const endDate = computed(() => {
  let result: string;
  if (isYnab.value) {
    const { getSelectedForecastEndDate } = useYnab();
    result = getSelectedForecastEndDate.value ?? '';
  } else if (isDummy.value) {
    const { selectedForecastEndDate } = useDummy();
    result = selectedForecastEndDate.value ?? '';
  } else {
    result = 'oopsie';
  }
  return result;
});

const loadingStatus = computed(() => {
  let result: LoadingStatus;
  if (isYnab.value) {
    const { state } = useYnab();
    result = state.loadingForecastStatus;
  } else if (isDummy.value) {
    const { state } = useDummy();
    result = state.loadingForecastStatus;
  } else {
    result = LoadingStatus.ready;
  }
  return result;
});

const spinLoadingIcon = computed(() => {
  let result: boolean;
  if (isYnab.value) {
    const { state } = useYnab();
    result = state.loadingForecastStatus === LoadingStatus.loading;
  } else if (isDummy.value) {
    const { state } = useDummy();
    result = state.loadingForecastStatus === LoadingStatus.loading;
  } else {
    result = false;
  }
  return result;
});

function loadData() {
  if (isYnab.value) {
    const { loadForecast } = useYnab();
    loadForecast();
  } else if (isDummy.value) {
    const { loadForecast } = useDummy();
    loadForecast();
  }
}

function setDateRange(dateRange: DateRange) {
  if (isYnab.value) {
    const { setForecastDateRange } = useYnab();
    setForecastDateRange(dateRange);
  } else if (isDummy.value) {
    const { setForecastDateRange } = useDummy();
    setForecastDateRange(dateRange);
  }
}

const dateList = computed(() => createDateList(forecast.value));

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
