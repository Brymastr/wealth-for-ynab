<template>
  <div class="flex flex-col items-center whitespace-no-wrap" v-if="netWorth">
    <div class="text-xl">Positive and Negative</div>
    <div class="text-3xl -mt-2 flex flex-row">
      <div class="text-blue-600">+{{ positives }}</div>
      <div class="px-2">/</div>
      <div class="text-red-600">-{{ negatives }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WorthDate } from '@/types';
import { computed } from 'vue';

const props = defineProps<{
  netWorth: WorthDate[],
}>()

const diffs = computed(() => {
  if (props.netWorth.length === 0) return [0];
  return props.netWorth.map(({ worth }, index, all) => {
    if (index === 0) return 0;
    return worth - all[index - 1].worth;
  });
});

const positives = computed(() => diffs.value.reduce((acc, cur) => (cur >= 0 ? acc + 1 : acc)));
const negatives = computed(() => diffs.value.reduce((acc, cur) => (cur < 0 ? acc + 1 : acc)));


</script>
