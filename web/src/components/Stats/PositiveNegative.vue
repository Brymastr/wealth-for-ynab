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

<script lang="ts">
import netWorth from '@/composables/netWorth';
import { WorthDate } from '@/types';
import { computed, defineComponent } from '@vue/runtime-core';
import { PropType } from 'vue';

export default defineComponent({
  props: {
    netWorth: {
      type: Array as PropType<WorthDate[]>,
      default: () => [],
    },
  },
  setup(props) {
    const diffs = computed(() => {
      if (props.netWorth.length === 0) return [0];
      return props.netWorth.map(({ worth }, index, all) => {
        if (index === 0) return 0;
        return worth - all[index - 1].worth;
      });
    });

    const positives = computed(() => diffs.value.reduce((acc, cur) => (cur >= 0 ? acc + 1 : acc)));
    const negatives = computed(() => diffs.value.reduce((acc, cur) => (cur < 0 ? acc + 1 : acc)));

    return { positives, negatives };
  },
});
</script>
