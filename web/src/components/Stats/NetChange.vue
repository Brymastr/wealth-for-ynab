<template>
  <div class="flex flex-col items-center whitespace-no-wrap" v-if="netWorth">
    <div class="text-xl">Net Change</div>
    <Currency class="text-3xl -mt-2" :number="value" />
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { computed, defineComponent } from '@vue/runtime-core';
import Currency from '@/components/General/Currency.vue';
import netWorth from '@/composables/netWorth';
import { WorthDate } from '@/types';

export default defineComponent({
  components: { Currency },
  props: {
    netWorth: {
      type: Array as PropType<WorthDate[]>,
      default: () => [],
    },
  },
  setup(props) {
    const value = computed(() => {
      const first = props.netWorth[0]?.worth ?? 0;
      const last = props.netWorth[props.netWorth.length - 1]?.worth ?? 0;

      return last - first;
    });

    return { value };
  },
});
</script>
