<template>
  <div class="flex flex-col items-center whitespace-no-wrap" v-if="netWorth">
    <div class="text-xl">Best and Worst</div>
    <div class="text-3xl -mt-2 flex flex-row">
      <Currency :number="best" />
      <div class="px-2">/</div>
      <Currency :number="worst" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Currency from '@/components/General/Currency.vue';
import type { WorthDate } from '@/types';
import { computed } from 'vue';

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

const best = computed(() => Math.max(...diffs.value));
const worst = computed(() => Math.min(...diffs.value));

</script>
