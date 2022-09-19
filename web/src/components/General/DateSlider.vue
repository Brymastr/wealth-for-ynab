<template>
  <div class="flex h-header items-center">
    <datalist id="dates">
      <option v-for="item in dates" :key=" item"></option>
    </datalist>
    <div class="slider-wrapper flex flex-col items-center text-xl leading-tight text-center w-full">
      <input type="range" list="dates" class="w-full" v-model="startIndex" :max="dates.length - 1">
      <input type="range" list="dates" class="w-full" v-model="endIndex" :max="dates.length - 1">

      {{startIndex}}
      {{endIndex}}
    </div>
  </div>
</template>

<script lang="ts">
import { getYearMonth } from '@/services/helper';
import { DateRange } from '@/types';
import { defineComponent, onMounted, PropType, ref, watch } from 'vue';

interface Props {
  dates: string[];
  selectedStartIndex: number;
  selectedEndIndex: number;
}

export default defineComponent({
  name: 'Date Select',
  components: {},
  props: {
    dates: { type: Array as PropType<string[]>, default: () => [] },
    selectedStartIndex: { type: Number, required: true },
    selectedEndIndex: { type: Number, required: true },
  },
  setup(props: Props, { emit }) {

    const startIndex = ref(props.selectedStartIndex)
    const endIndex = ref(props.selectedEndIndex)

    function dateSelected() {
      const dateRange: DateRange = {
        startDate: props.dates[startIndex.value],
        endDate: props.dates[endIndex.value],
      };
      emit('dateSelected', dateRange);
    }

    watch(() => startIndex, dateSelected)
    watch(() => endIndex, dateSelected)

    return {
      getYearMonth,
      startIndex,
      endIndex,
    };
  },
});
</script>

<style lang="css" scoped>
.slider-wrapper {
  width: 300px;
  margin: auto;
  text-align: center;
  position: relative;
  height: 6em;
}

.slider-wrapper input[type=range] {
  position: absolute;
  left: 0;
  bottom: 0;
}

input[type=range] {
  -webkit-appearance: none;
  width: 100%;
}

input[type=range]:focus {
  outline: none;
}

input[type=range]:focus::-webkit-slider-runnable-track {
  background: #2497e3;
}

input[type=range]:focus::-ms-fill-lower {
  background: #2497e3;
}

input[type=range]:focus::-ms-fill-upper {
  background: #2497e3;
}

input[type=range]::-webkit-slider-runnable-track {
  width: 100%;
  height: 5px;
  cursor: pointer;
  animate: 0.2s;
  background: #2497e3;
  border-radius: 1px;
  box-shadow: none;
  border: 0;
}

input[type=range]::-webkit-slider-thumb {
  z-index: 2;
  position: relative;
  box-shadow: 0px 0px 0px #000;
  border: 1px solid #2497e3;
  height: 18px;
  width: 18px;
  border-radius: 25px;
  background: #a1d0ff;
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -7px;
}
</style>
