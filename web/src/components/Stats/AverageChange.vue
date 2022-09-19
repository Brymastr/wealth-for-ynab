<template>
  <div class="flex flex-col items-center whitespace-no-wrap" v-if="netWorth">
    <div class="text-xl">Average Change</div>
    <Currency class="text-3xl -mt-2" :number="value" />
  </div>
</template>

<script lang="ts">
import Currency from '@/components/General/Currency.vue';
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
  components: {
    Currency,
  },
  setup(props: any) {
    const value = computed(() => {
      const first = props.netWorth[0]?.worth ?? 0;
      const last = props.netWorth[props.netWorth.length - 1]?.worth ?? 0;

      const numMonths = props.netWorth.length;
      return (last - first) / numMonths;
    });

    return { value };
  },
});
</script>
