<template>
  <Card class="flex flex-col text-2xl">
    <Icon class="text-5xl mb-4" />
    <div class="text-2xl">Average Change</div>
    <Currency class="text-5xl pb-5" :number="value" />
  </Card>
</template>

<script setup lang="ts">
import Currency from '@/components/General/Currency.vue';
import type { WorthDate } from '@/types'; import { computed } from 'vue';
import Card from '@/components/General/Card.vue'
import Icon from '~icons/material-symbols/difference-outline-rounded'

const props = defineProps<{
  netWorth: WorthDate[],
}>()

const value = computed(() => {
  const first = props.netWorth[0]?.worth ?? 0;
  const last = props.netWorth[props.netWorth.length - 1]?.worth ?? 0;

  const numMonths = props.netWorth.length;
  return (last - first) / numMonths;
});
</script>
