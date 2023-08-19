import { computed } from 'vue';
import { BackendType, LoadingStatus } from './types';
import useBackend from '@/composables/backend';
import { greaterOf } from '@/services/helper';
import { DateRangeIndices } from '@/types';


export default function useNetWorth() {
  const { activeBackend, activeBackendType } = useBackend();

  const netWorth = activeBackend.value.netWorth
  const startDate = activeBackend.value.selectedStartDate;
  const endDate = activeBackend.value.selectedEndDate;
  const dateList = activeBackend.value.dateList;
  const startIndex = activeBackend.value.selectedStartIndex;
  const endIndex = activeBackend.value.selectedEndIndex;
  const loadingStatus = activeBackend.value.loadingNetWorthStatus;

  const netWorthSlice = computed(() => {
    const data = activeBackend.value?.netWorth?.value ?? [];

    return data.slice(startIndex.value, (endIndex.value as number) + 1 ?? greaterOf(data.length - 1, 0));
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

  function setDateRange(dateRange: DateRangeIndices) {
    activeBackend.value.setBudgetDateRange(dateRange);
  }

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
