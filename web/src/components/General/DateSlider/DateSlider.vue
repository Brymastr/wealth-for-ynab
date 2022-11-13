<template>
  <div class="slider-grid mt-3">
    <div class="slider w-full flex flex-col justify-center relative" ref="slider">
      <div class="h-2 bg-gray-500"></div>
      <div class="absolute bg-blue-400 h-2" :style="{left: `${thumb1Position}px`, width: `${middleWidth}px`}">
      </div>
      <DateSliderThumb id="left-slider-item" ref="sliderItemLeft" side="left" :position="thumb1Position"
        :text="thumb1Date" />
      <DateSliderThumb id="right-slider-item" ref="sliderItemRight" side="right" :position="thumb2Position"
        :text="thumb2Date" />
    </div>
    <div class="buttons flex items-center whitespace-nowrap">
      <DateSliderButton @click="setMonths(3)">3M</DateSliderButton>
      <DateSliderButton @click="setMonths(6)">6M</DateSliderButton>
      <DateSliderButton @click="setMonths(12)">1Y</DateSliderButton>
      <DateSliderButton @click="setMonths()">All Time</DateSliderButton>
    </div>
    <div class="pips text-gray-700 flex flex-col" ref="pips">
      <div class="h-3 flex justify-between w-full">
        <div class="border-r-2 border-gray-500 h-1 transition-height" v-for="date, index in dates" :key="date"
          :class="{'h-full': highlightPip(index)}"></div>
      </div>
      <div class="h-full w-full relative">
        <div class="date-pips absolute flex justify-between"
          :style="{width: `calc(${sliderWidth}px + 3rem)`, left: '-1.5rem'}">
          <div class="h-full text-center whitespace-nowrap text-xs" v-for="date, index in dates" :key="date"
            v-show="showPipDate(index)" :class="{'font-bold': highlightPip(index)}">{{getYearMonth(date)}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getYearMonth } from '@/services/helper';
import { DateRangeIndices } from '@/types';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import DateSliderThumb from './DateSliderThumb.vue';
import DateSliderButton from './DateSliderButton.vue';

type Props = {
  dates: string[]
  selectedStartIndex: number
  selectedEndIndex: number
  visible?: boolean
}

const props = withDefaults(defineProps<Props>(), { dates: () => [], visible: false })

const emit = defineEmits(['dateSelected'])

const pips = ref<HTMLElement | null>()
const startIndex = ref(props.selectedStartIndex)
const endIndex = ref(props.selectedEndIndex)
const minMonths = 2
watch([startIndex, endIndex], dateSelected)
watch(() => props.visible, (newVisibility) =>
  newVisibility && nextTick(setWidth), { flush: 'post', })

function dateSelected() {
  const dateRange: DateRangeIndices = {
    startIndex: startIndex.value,
    endIndex: endIndex.value,
  };

  emit('dateSelected', dateRange);
}

const clientWidth = ref(document.querySelector('html')?.clientWidth)
const slider = ref<HTMLElement | null>(null)
const sliderWidth = ref(0)
const sliderLeft = ref(0)
let selectedItem: HTMLElement | null

const sliderItemLeft = ref<{ thumb: HTMLElement } | null>(null)
const sliderItemRight = ref<{ thumb: HTMLElement } | null>(null)

const thumb1Position = computed(() => calculatePosition(startIndex.value))
const thumb1Date = computed(() => getYearMonth(props.dates[startIndex.value]))
const thumb2Position = computed(() => calculatePosition(endIndex.value))
const thumb2Date = computed(() => getYearMonth(props.dates[endIndex.value]))
const middleWidth = computed(() => thumb2Position.value - thumb1Position.value)


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
  const itemSize = sliderWidth.value / (items - 1)
  if (x <= 0) return 0
  else if (x >= sliderWidth.value - 1) return items - 1
  const rounded = Math.round((x) / itemSize) * itemSize
  const index = Math.round(rounded / itemSize)
  if (index > items - 1) return items - 1
  return index
}

function calculatePosition(index: number) {
  const items = props.dates.length
  const itemSize = sliderWidth.value / (items - 1)
  return index * itemSize
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
      }
    }
  } else if (selectedItem?.id === 'right-slider-item') {
    if (index > startIndex.value + minMonths) {
      if (index !== endIndex.value) {
        endIndex.value = index
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

function highlightPip(index: number) {
  return index === startIndex.value || index === endIndex.value
}

function showPipDate(index: number) {
  const items = props.dates.length
  const even = items % 2 === 0
  let show = false
  if (index === 0 || index === items - 1) show = true
  show = (index) % 10 === 0

  return show
}
</script>

<style lang="postcss" scoped>
.slider-grid {
  display: grid;
  grid-template-columns: 2rem auto 2.6rem min-content;
  grid-template-rows: 2rem 2rem;
  grid-template-areas:
    ". slider . buttons"
    ". pips . .";
}

.space {
  grid-area: space;
}

.slider {
  grid-area: slider;
}

.buttons {
  grid-area: buttons;
}

.pips {
  grid-area: pips;
}

.date-pips {
  flex: 1 1 0;

  >div {
    width: 3rem
  }
}
</style>
