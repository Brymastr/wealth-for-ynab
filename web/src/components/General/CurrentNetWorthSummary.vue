<template>
  <Card class="flex flex-col text-2xl">
    <p class="text-3xl pb-10 pt-5">Summary</p>
    <!-- Date -->
    <div class="flex justify-between pb-5">
      <p class="self-center">Date:</p>
      <p class="text-right text-4xl whitespace-no-wrap">{{ date }}</p>
    </div>

    <!-- Current value -->
    <div class="flex justify-between pb-5">
      <p class="self-center">Current:</p>
      <Currency class="justify-end text-4xl" :number="worth" :arrow="false" :full="true" />
    </div>

    <!-- Change in value -->
    <div class="flex justify-between pb-5">
      <p class="self-center">Change:</p>
      <Currency class="justify-end text-4xl" v-if="difference" :number="difference" :arrow="true" :full="true" />
      <Currency class="justify-end text-4xl" v-else :number="0" :arrow="false" :full="false" />
    </div>

    <!-- Deviation from average change -->
    <div class="flex justify-between">
      <p class="self-center">Deviation from average:</p>
      <Currency class="justify-end text-4xl" v-if="difference" :number="deviationFromAverageChange" :arrow="true"
        :full="true" />
      <Currency class="justify-end text-4xl" v-else :number="0" :arrow="false" :full="false" />
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { formatDate } from '@/services/helper';
import Currency from '@/components/General/Currency.vue';
import type { WorthDate } from '@/types';
import Card from '@/components/General/Card.vue'


const props = defineProps<{
  selectedItem: WorthDate,
  forecast?: boolean,
  netWorth: WorthDate[],
}>()

const difference = computed(() => {
  if (props.selectedItem.previous !== undefined) {
    return props.selectedItem.worth - props.selectedItem.previous.worth;
  } else return null;
});

const date = computed(() => formatDate(props.selectedItem.date));

const worth = computed(() => props.selectedItem.worth);

const averageChange = computed(() => {
  const first = props.netWorth[0]?.worth ?? 0;
  const last = props.netWorth[props.netWorth.length - 1]?.worth ?? 0;

  const numMonths = props.netWorth.length;
  return (last - first) / numMonths;
});

const deviationFromAverageChange = computed(() => (difference.value ?? 0) - averageChange.value)

</script>
