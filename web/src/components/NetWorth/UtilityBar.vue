<template>
  <div class="h-header bg-blue-400 text-white px-3 xl:px-0">
    <div class="xl:container mx-auto flex justify-between items-center">
      <DateSelect :dates="dateList" :startDate="startDate" :endDate="endDate" @dateSelected="dateSelected" />
      <ReloadIcon class="pl-3 h-full items-center" id="reload-net-worth" :rotate="spinLoadingIcon" :ready="ready"
        :action="loadData" size="small">{{ spinLoadingIcon ? 'Loading...' : reloadText }}</ReloadIcon>
    </div>

    <div class="xl:container mx-auto bg-gray-200">
      <DateSlider :dates="dateList" :selectedStartIndex="startIndex" :selectedEndIndex="endIndex"
        @dateSelected="dateSelected" />
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';
import { DateRange } from '@/types';
import useBackend from '@/composables/backend';
import { LoadingStatus } from '@/composables/types';
import useNetWorth from '@/composables/netWorth';
import DateSelect from '@/components/General/DateSelect.vue';
import DateSlider from '@/components/General/DateSlider.vue';
import ReloadIcon from '@/components/Icons/ReloadIcon.vue';

const props = defineProps<{
  dateList: string[]
  startIndex: number
  endIndex: number
}>()

const startDate = computed(() => props.dateList[props.startIndex])
const endDate = computed(() => props.dateList[props.endIndex])

const {
  loadData,
  reloadText,
  spinLoadingIcon,
  setDateRange,
} = useNetWorth();

const { activeBackend } = useBackend()
const ready = computed(() => activeBackend.value.loadingNetWorthStatus.value === LoadingStatus.ready)

const dateSelected = (dateRange: DateRange) => setDateRange(dateRange)

</script>
