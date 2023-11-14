<template>
  <Card class="flex flex-col text-2xl">
    <Icon class="text-5xl mb-4" style="transform: scaleY(-1);" />
    <div class="text-2xl">Negative Months</div>
    <p class="text-5xl pb-5 text-red-600">{{ value }}</p>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { WorthDate } from '@/types';
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

const value = computed(() => diffs.value.reduce((acc, cur) => (cur < 0 ? acc + 1 : acc)));
</script>
