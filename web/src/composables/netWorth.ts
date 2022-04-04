import { LoadingStatus, WorthDate } from './types';
import useBackend from '@/composables/backend';
import useDummy from '@/composables/dummy';
import useYnab from '@/composables/ynab';
import { computed, ComputedRef } from 'vue';
import { createDateList, isBetween } from '@/services/helper';

const { isDummy, isYnab } = useBackend();

const netWorth = computed(() => {
  let result: ComputedRef<WorthDate[]> = computed(() => []);
  if (isYnab.value) {
    const { getNetWorth } = useYnab();
    result = getNetWorth;
  } else if (isDummy.value) {
    const { getNetWorth, loadNetWorth } = useDummy();
    if (!getNetWorth.value) loadNetWorth();
    result = getNetWorth;
  }
  return result.value;
});

const netWorthSlice = computed(() => {
  const data = netWorth.value;
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
    const { getSelectedStartDate } = useYnab();
    result = getSelectedStartDate.value ?? '';
  } else if (isDummy.value) {
    const { selectedStartDate } = useDummy();
    result = selectedStartDate.value ?? '';
  } else {
    result = 'oopsie';
  }
  return result;
});

const endDate = computed(() => {
  let result: string;
  if (isYnab.value) {
    const { getSelectedEndDate } = useYnab();
    result = getSelectedEndDate.value ?? '';
  } else if (isDummy.value) {
    const { selectedEndDate } = useDummy();
    result = selectedEndDate.value ?? '';
  } else {
    result = 'oopsie';
  }
  return result;
});

const forecastStartDate = computed(() => {
  let result: string;
  if (isYnab.value) {
    const { getSelectedForecastStartDate } = useYnab();
    result = getSelectedForecastStartDate.value ?? '';
  } else if (isDummy.value) {
    const { selectedStartDate } = useDummy();
    result = selectedStartDate.value ?? '';
  } else {
    result = 'oopsie';
  }
  return result;
});

const forecastEndDate = computed(() => {
  let result: string;
  if (isYnab.value) {
    const { getSelectedForecastEndDate } = useYnab();
    result = getSelectedForecastEndDate.value ?? '';
  } else if (isDummy.value) {
    const { selectedEndDate } = useDummy();
    result = selectedEndDate.value ?? '';
  } else {
    result = 'oopsie';
  }
  return result;
});

const loadingStatus = computed(() => {
  let result: LoadingStatus;
  if (isYnab.value) {
    const { state } = useYnab();
    result = state.loadingNetWorthStatus;
  } else if (isDummy.value) {
    const { state } = useDummy();
    result = state.loadingNetWorthStatus;
  } else {
    result = LoadingStatus.ready;
  }
  return result;
});

const spinLoadingIcon = computed(() => {
  let result: boolean;
  if (isYnab.value) {
    const { state } = useYnab();
    result = state.loadingNetWorthStatus === LoadingStatus.loading;
  } else if (isDummy.value) {
    const { state } = useDummy();
    result = state.loadingNetWorthStatus === LoadingStatus.loading;
  } else {
    result = false;
  }
  return result;
});

function loadData() {
  if (isYnab.value) {
    const { loadNetWorth } = useYnab();
    loadNetWorth();
  } else if (isDummy.value) {
    const { loadNetWorth } = useDummy();
    loadNetWorth();
  }
}

const sliceNetWorth = (data: WorthDate[]) => {
  const start = startDate.value;
  const end = endDate.value;
  return data.filter(({ date }) => isBetween(new Date(date), new Date(start), new Date(end)));
};

const sliceForecastNetWorth = (data: WorthDate[]) => {
  const start = forecastStartDate.value;
  const end = forecastEndDate.value;
  return data.filter(({ date }) => isBetween(new Date(date), new Date(start), new Date(end)));
};

const dateList = computed(() => createDateList(netWorth.value));

export default function useNetWorth() {
  return {
    loadData,
    dateList,
    netWorth,
    netWorthSlice,
    reloadText,
    startDate,
    endDate,
    forecastStartDate,
    forecastEndDate,
    loadingStatus,
    spinLoadingIcon,
    sliceNetWorth,
    sliceForecastNetWorth,
  };
}
