<template>
  <Card class="flex flex-col text-2xl">
    <Icon class="text-5xl mb-4" />
    <div class="text-2xl">Positive Months</div>
    <p class="text-5xl pb-5 text-blue-600">{{ value }}</p>
  </Card>
</template>

<script setup lang="ts">
import type { WorthDate } from '@/types'; import { computed } from 'vue';
import Card from '@/components/General/Card.vue'
import Icon from '~icons/system-uicons/upward'

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


const value = computed(() => diffs.value.reduce((acc, cur) => (cur >= 0 ? acc + 1 : acc)));
</script>
