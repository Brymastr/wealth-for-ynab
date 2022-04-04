<template>
  <div class="grid grid-cols-2 text-xl gap-y-3 leading-none bg-gray-200 shadow-lg rounded-sm">
    <div class="text-gray-200 bg-gray-800 p-2 rounded-tl-sm">Net Worth</div>
    <div class="text-right text-blue-300 bg-gray-800 p-2 rounded-tr-sm">
      <span :class="{ invisible: !forecast }">Forecast</span>
    </div>

    <div class="self-center pl-2">Date:</div>
    <div class="text-right text-2xl whitespace-no-wrap pr-2">{{ date }}</div>

    <div class="self-center pl-2">Current:</div>
    <Currency class="justify-end text-2xl pr-2" :number="worth" :arrow="false" :full="true" />

    <div class="self-center pl-2 pb-2">Change:</div>
    <Currency
      class="justify-end text-2xl pr-2 pb-2"
      v-if="difference"
      :number="difference"
      :arrow="true"
      :full="true"
    />
    <Currency class="justify-end text-2xl pr-2 pb-2" v-else :number="0" :arrow="false" :full="false" />
  </div>
</template>

<script lang="ts">
import { WorthDate } from '@/composables/types';
import { formatDate } from '@/services/helper';
import Currency from '@/components/General/Currency.vue';
import { computed, defineComponent, PropType } from 'vue';

interface Props {
  selectedItem: WorthDate;
  forecast?: boolean;
}

export default defineComponent({
  name: 'Current Net Worth Summary',
  components: { Currency },
  props: {
    selectedItem: {
      type: Object as PropType<WorthDate>,
      required: true,
    },
    forecast: {
      type: Boolean,
      required: false,
    },
  },
  setup(props: Props) {
    const difference = computed(() => {
      if (props.selectedItem.previous !== undefined) {
        return props.selectedItem.worth - props.selectedItem.previous.worth;
      } else return null;
    });

    const date = computed(() => formatDate(props.selectedItem.date));

    const worth = computed(() => props.selectedItem.worth);

    return { difference, date, worth };
  },
});
</script>
