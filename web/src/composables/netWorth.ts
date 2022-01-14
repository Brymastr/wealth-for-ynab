import { LoadingStatus, WorthDate } from './types';
import useBackend from '@/composables/backend';
import useDummy from '@/composables/dummy';
import useYnab from '@/composables/ynab';
import { computed, ComputedRef } from 'vue';
import { createDateList } from '@/services/helper';

const { isDummy, isYnab } = useBackend();

const netWorth = computed(() => {
  let result: ComputedRef<WorthDate[]> = computed(() => []);
  if (isYnab.value) {
    const { getNetWorth } = useYnab();
    result = getNetWorth;
  } else if (isDummy.value) {
    const { getNetWorth } = useDummy();
    result = getNetWorth;
  }
  return result.value;
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

const dateList = computed(() => createDateList(netWorth.value));

export default function useNetWorth() {
  return {
    loadData,
    dateList,
    netWorth,
    reloadText,
    startDate,
    endDate,
    loadingStatus,
    spinLoadingIcon,
  };
}
