<template>
  <Card class="flex flex-col text-2xl">
    <Icon class="text-5xl mb-4" />
    <div class="text-2xl">Worst Month</div>
    <Currency class="text-5xl pb-5" :number="value" />
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Currency from '@/components/General/Currency.vue';
import type { WorthDate } from '@/types';
import Card from '@/components/General/Card.vue'
import Icon from '~icons/radix-icons/pin-bottom'

const props = defineProps<{
  netWorth: WorthDate[],
}>()

const diffs = computed(() => {
  const amounts = props.netWorth.map(({ worth }) => worth);
  if (amounts.length === 0) return [0];
  return amounts.map((amount, index) => {
    if (index === 0) return 0;
    else return amount - amounts[index - 1];
  });
});

const value = computed(() => Math.min(...diffs.value));
</script>
