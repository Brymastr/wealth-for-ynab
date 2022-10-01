<template>
  <div class="text-white bg-gray-300 px-3 xl:px-0">
    <div class="bg-blue-400 h-header">
      <div class="xl:container mx-auto flex justify-between items-center">
        <DateRangeComponent :dateList="dateList" :startIndex="startIndex" :endIndex="endIndex"
          @dateSelected="dateSelected" @click="toggleSlider()" />
        <ReloadIcon class="pl-3 h-full items-center" id="reload-net-worth" :rotate="spinLoadingIcon" :ready="ready"
          :action="loadData" size="small">{{ spinLoadingIcon ? 'Loading...' : reloadText }}</ReloadIcon>
      </div>
    </div>

    <div class="xl:container mx-auto" v-show="sliderVisible">
      <DateSlider :dates="dateList" :selectedStartIndex="startIndex" :selectedEndIndex="endIndex"
        @dateSelected="dateSelected" :visible="sliderVisible" />
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { DateRange } from '@/types';
import useBackend from '@/composables/backend';
import { LoadingStatus } from '@/composables/types';
import useNetWorth from '@/composables/netWorth';
import DateRangeComponent from '@/components/General/DateRange.vue';
import DateSlider from '@/components/General/DateSlider.vue';
import ReloadIcon from '@/components/Icons/ReloadIcon.vue';

defineProps<{
  dateList: string[]
  startIndex: number
  endIndex: number
}>()

const {
  loadData,
  reloadText,
  spinLoadingIcon,
  setDateRange,
} = useNetWorth();

const sliderVisible = ref(false)
function toggleSlider() {
  sliderVisible.value = !sliderVisible.value
}

const { activeBackend } = useBackend()
const ready = computed(() => activeBackend.value.loadingNetWorthStatus.value === LoadingStatus.ready)

const dateSelected = (dateRange: DateRange) => setDateRange(dateRange)

</script>
