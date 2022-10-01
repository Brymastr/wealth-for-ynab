<template>
  <div class="h-10 flex flex-col">
    <div class="slider-and-buttons flex h-8">
      <div class="w-12"></div>
      <div id="slider" ref="slider" class="relative bg-gray-500 h-2 mt-3 w-full">
        <DateSliderThumb id="left-slider-item" ref="sliderItemLeft" side="left" :position="pip1Position"
          :text="pip1Date" />
        <DateSliderThumb id="right-slider-item" ref="sliderItemRight" side="right" :position="pip2Position"
          :text="pip2Date" />
        <div class="z-10 absolute bg-blue-400 h-full" :style="{left: `${pip1Position}px`, width: `${middleWidth}px`}">
        </div>
      </div>
      <div class="w-12"></div>
      <div class="self-center mx-1 ml-2 bg-blue-400 rounded-full px-2 cursor-pointer hover:bg-gray-700"
        @click="setMonths(3)">3M</div>
      <div class="self-center mx-1 bg-blue-400 rounded-full px-2 cursor-pointer hover:bg-gray-700"
        @click="setMonths(6)">6M</div>
      <div class="self-center mx-1 bg-blue-400 rounded-full px-2 cursor-pointer hover:bg-gray-700"
        @click="setMonths(12)">1Y</div>
      <div class="self-center mx-1 bg-blue-400 rounded-full px-2 cursor-pointer hover:bg-gray-700 whitespace-nowrap"
        @click="setMonths()">All Time</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getYearMonth } from '@/services/helper';
import { DateRange } from '@/types';
import { computed, nextTick, onMounted, PropType, ref, watch } from 'vue';
import DateSliderThumb from './DateSliderThumb.vue';

const props = defineProps({
  dates: { type: Array as PropType<string[]>, default: () => [] },
  selectedStartIndex: { type: Number, required: true },
  selectedEndIndex: { type: Number, required: true },
  visible: { type: Boolean, default: () => false }
})

const emit = defineEmits(['dateSelected'])

const startIndex = ref(props.selectedStartIndex)
const endIndex = ref(props.selectedEndIndex)
const minMonths = 3
watch([startIndex, endIndex], dateSelected)
watch(() => props.visible, (newVisibility) =>
  newVisibility && nextTick(setWidth), { flush: 'post', })

function dateSelected() {
  console.log('dateSelected')
  const dateRange: DateRange = {
    startDate: props.dates[startIndex.value],
    endDate: props.dates[endIndex.value],
  };
  emit('dateSelected', dateRange);
}

const clientWidth = ref(document.querySelector('html')?.clientWidth)
const slider = ref<HTMLElement | null>(null)
const sliderWidth = ref(1000) // 1145
const sliderLeft = ref(0) // 192 + 45 = 237
let selectedItem: HTMLElement | null

const sliderItemLeft = ref<{ thumb: HTMLElement } | null>(null)
const sliderItemRight = ref<{ thumb: HTMLElement } | null>(null)

const pip1Position = computed(() => calculatePosition(startIndex.value))
const pip1Date = computed(() => getYearMonth(props.dates[startIndex.value]))
const pip2Position = computed(() => calculatePosition(endIndex.value))
const pip2Date = computed(() => getYearMonth(props.dates[endIndex.value]))
const middleWidth = computed(() => pip2Position.value - pip1Position.value)

let allowMove = true
let allowResize = true

function dragStart(event: MouseEvent) {
  event.preventDefault();
  selectedItem = event.target as HTMLElement
  const parent = sliderItemRight.value?.thumb.parentElement as HTMLElement
  clientWidth.value = document.querySelector('html')?.clientWidth as number
  sliderWidth.value = parent.offsetWidth
  sliderLeft.value = parent.offsetLeft

  document.onmouseup = closeDragElement;
  document.onmousemove = elementDrag;
}

function calculateIndex(clientX: number): number {
  const x = clientX - sliderLeft.value
  const items = props.dates.length
  const itemSize = sliderWidth.value / items
  if (x <= 0) return 0
  else if (x >= sliderWidth.value - itemSize) return items - 1
  const rounded = Math.round((x) / itemSize) * itemSize
  const index = Math.round(rounded / itemSize)
  return index
}

function calculatePosition(index: number) {
  const items = props.dates.length
  if (index >= items - 1) index = items - 1
  const itemSize = sliderWidth.value / items
  return (index) * itemSize
}

function elementDrag(event: MouseEvent) {
  event.preventDefault()
  if (!allowMove) return
  allowMove = false
  setTimeout(() => allowMove = true, 30)

  const index = calculateIndex(event.clientX)

  if (selectedItem?.id === 'left-slider-item') {
    if (index < endIndex.value - minMonths) {
      if (index !== startIndex.value) {
        startIndex.value = index
        dateSelected()
      }
    }
  } else if (selectedItem?.id === 'right-slider-item') {
    if (index > startIndex.value + minMonths) {
      if (index !== endIndex.value) {
        endIndex.value = index
        dateSelected()
      }

    }
  }
}

function closeDragElement() {
  // stop moving when mouse button is released:
  document.onmouseup = null;
  document.onmousemove = null;
  selectedItem = null
}

function setWidth() {
  sliderWidth.value = slider.value?.offsetWidth as number
  sliderLeft.value = slider.value?.offsetLeft as number
}

function onResize() {
  if (!allowResize) return
  allowResize = false
  setTimeout(() => allowResize = true, 100)

  setWidth()
}

function start() {
  if (sliderItemRight.value !== null) {
    sliderItemRight.value.thumb.onmousedown = dragStart
  }
  if (sliderItemLeft.value !== null) {
    sliderItemLeft.value.thumb.onmousedown = dragStart
  }

  console.log(slider.value)

  setWidth()

  window.addEventListener('resize', onResize);
}

onMounted(start)

function setMonths(months?: number) {
  if (months === undefined) {
    startIndex.value = 0
    endIndex.value = props.dates.length - 1
  } else {
    startIndex.value = props.dates.length - months - 1
    endIndex.value = props.dates.length - 1
  }
}


</script>
