<template>
  <div :class="[
    { 'text-red-600': number < 0, 'text-blue-600': number >= 0 },
    'flex',
    'items-center',
    'whitespace-no-wrap',
  ]">
    <Arrow class="-mx-1" :class="{ hidden: arrow === false }" :direction="number >= 0 ? 'up' : 'down'" />
    <div>{{ value }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { formatCurrency } from '../../services/helper';
import Arrow from '@/components/Icons/ArrowUpIcon.vue';

const props = defineProps<{
  number: number,
  arrow?: boolean,
  full?: boolean,
}>()

const value = computed(() => formatCurrency(Math.abs(props.number), props.full))

</script>
