<template>
  <div class="flex flex-col text-xl items-center bg-gray-200 shadow-lg rounded-sm whitespace-no-wrap">
    <div class="text-gray-200 bg-gray-800 p-2 rounded-t-sm w-full">Monthly</div>
    <div class="w-full overflow-y-scroll">
      <div class="flex flex-row justify-between px-2 hover:font-medium cursor-pointer" :class="{
        'bg-gray-300': index % 2 === 1,
        'font-medium': index === rows.length - (props.selectedItem?.index ?? 0) - 1,
      }" v-for="(item, index) of rows" :key="item.date" @mouseover="dateHighlighted(index)">
        <div class="w-1/3">{{ item.date }}</div>
        <Currency class="w-1/3" :number="item.worth" :arrow="false" :full="true" />
        <Currency class="w-1/3" :number="item.previous" :arrow="item.previous !== 0" :full="true" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Currency from '@/components/General/Currency.vue';
import { computed } from 'vue';
import { format } from 'date-fns';
import type { WorthDate } from '@/types';

const props = defineProps<{
  netWorth: WorthDate[],
  selectedItem?: WorthDate,
}>()


const emit = defineEmits(['dateHighlighted'])

function dateHighlighted(index: number) {
  emit('dateHighlighted', props.netWorth[props.netWorth.length - index - 1]);
}

const rows = computed(() =>
  props.netWorth
    .map((item, index, list): any => {
      let previous = 0;
      if (index > 0) {
        previous = item.worth - list[index - 1].worth;
      }
      return Object.assign({}, item, {
        date: format(new Date(item.date), 'yyyy MMM'),
        previous,
      });
    })
    .reverse(),
);
</script>
