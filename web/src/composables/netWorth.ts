import { computed } from 'vue';
import { BackendType, LoadingStatus } from './types';
import useBackend from '@/composables/backend';
import { isBetween } from '@/services/helper';
import { DateRange } from '@/types';

const { activeBackend, activeBackendType } = useBackend();

const netWorth = activeBackend.value.netWorth;
const startDate = activeBackend.value.selectedStartDate;
const endDate = activeBackend.value.selectedEndDate;
const dateList = activeBackend.value.dateList;
const startIndex = activeBackend.value.selectedStartIndex;
const endIndex = activeBackend.value.selectedEndIndex;
const loadingStatus = activeBackend.value.loadingNetWorthStatus;

const netWorthSlice = computed(() => {
  const data = netWorth.value ?? [];
  const start = startDate.value;
  const end = endDate.value;
  if (!start || !end) return [];

  const filtered = data.filter(({ date }) => isBetween(new Date(date), new Date(start), new Date(end)));
  return filtered;
});

const reloadText = computed(() =>
  activeBackendType.value === BackendType.dummy ? 'Randomize Dummy Data' : 'Refresh',
);

const spinLoadingIcon = computed(
  () => activeBackend.value.loadingNetWorthStatus.value === LoadingStatus.loading,
);

function loadData() {
  activeBackend.value.loadNetWorth();
}

function setDateRange(dateRange: DateRange) {
  activeBackend.value.setBudgetDateRange(dateRange);
}

export default function useNetWorth() {
  return {
    loadData,
    setDateRange,
    dateList,
    netWorth,
    netWorthSlice,
    reloadText,
    startDate,
    endDate,
    startIndex,
    endIndex,
    loadingStatus,
    spinLoadingIcon,
  };
}
