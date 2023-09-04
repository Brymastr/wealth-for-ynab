<template>
  <div class="flex flex-col items-center whitespace-no-wrap" v-if="props.netWorth">
    <div class="text-xl">Net Change</div>
    <Currency class="text-3xl -mt-2" :number="value" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { WorthDate } from '@/types'; import Currency from '@/components/General/Currency.vue';

const props = defineProps<{ netWorth: WorthDate[] }>()

const value = computed(() => {
  const first = props.netWorth[0]?.worth ?? 0;
  const last = props.netWorth[props.netWorth.length - 1]?.worth ?? 0;
  return last - first;
})


</script>
