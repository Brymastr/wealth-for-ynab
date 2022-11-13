<template>
  <div class="text-white bg-gray-300">
    <div class="bg-blue-400 h-header px-3 xl:px-0">
      <div class="xl:container mx-auto flex justify-between items-center">
        <DateRangeComponent :dateList="dateList" :startIndex="startIndex" :endIndex="endIndex"
          @click="toggleSlider()" />
        <ReloadIcon class="pl-3 h-full items-center" id="reload-net-worth" :rotate="spinLoadingIcon" :ready="ready"
          :action="loadData" size="small">{{ spinLoadingIcon ? 'Loading...' : reloadText }}</ReloadIcon>
      </div>
    </div>

    <div class="xl:container mx-auto px-3 xl:px-0" v-show="sliderVisible">
      <DateSlider :dates="dateList" :selectedStartIndex="startIndex" :selectedEndIndex="endIndex"
        @dateSelected="dateSelected" :visible="sliderVisible" />
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { DateRangeIndices } from '@/types';
import useBackend from '@/composables/backend';
import { LoadingStatus } from '@/composables/types';
import DateRangeComponent from '@/components/General/DateRange.vue';
import DateSlider from '@/components/General/DateSlider/DateSlider.vue';
import ReloadIcon from '@/components/Icons/ReloadIcon.vue';
import useForecast from '@/composables/forecast';

defineProps<{
  dateList: string[]
  startIndex: number
  endIndex: number
}>()

const emit = defineEmits(['dateSelected'])

const {
  loadData,
  reloadText,
  spinLoadingIcon,
} = useForecast();

const sliderVisible = ref(false)
function toggleSlider() {
  sliderVisible.value = !sliderVisible.value
}

const { activeBackend } = useBackend()
const ready = computed(() => activeBackend.value.loadingForecastStatus.value === LoadingStatus.ready)

const dateSelected = (dateRange: DateRangeIndices) => emit('dateSelected', dateRange);

</script>
