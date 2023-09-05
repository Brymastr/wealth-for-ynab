<template>
  <Stat title="Time to $100k">
    <template v-for="(item, index) in items">
      <Currency :key="index + '-first-currency'" v-if="index === 0" class="w-1/3" :full=true :number="item.dollar" />
      <p :key="index + '-first-month'" class="w-1/3" v-if="index === 0">{{ formatDate(item.date as string) }}</p>
      <p :key="index + '-first-blank'" v-if="index === 0" class="w-1/3"></p>

      <Currency :key="index + '-dollar'" v-if="index > 0 && index < items.length - 1" class="w-1/3"
        :number="Math.floor(item.dollar / _100k) * _100k" />
      <p :key="index + '-date'" v-if="index > 0 && index < items.length - 1" class="w-1/3">{{ formatDate(item.date as
        string) }}</p>
      <p :key="index + '-blank'" v-if="index === 1" class="w-1/3"></p>
      <p :key="index + '-ttk'" v-if="index >= 2 && index < items.length - 1" class="w-1/3">{{ item.months }} months</p>

      <Currency :key="index + '-dollar-last'" v-if="index === items.length - 1" class="w-1/3"
        :number="Math.ceil(item.dollar / _100k) * _100k" />
      <Currency :key="index + '-dollar-last'" v-if="index === items.length - 1" class="w-1/3"
        :number="(item.deficit as number)" :full="true" />
      <p :key="index + '-blank-last'" v-if="index === items.length - 1" class="w-1/3"></p>
    </template>

  </Stat>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { WorthDate } from '@/types';
import { formatDate } from '@/services/helper'

// Components
import Stat from '@/components/Stats/Stat.vue';
import Currency from '@/components/General/Currency.vue';

interface Item {
  date?: string
  dollar: number
  months?: number
  deficit?: number
  index: number
}


const props = defineProps<{ netWorth: WorthDate[] }>()


const firstItem = computed<Item>(() => ({ date: props.netWorth[0].date, dollar: props.netWorth[0].worth, index: 0 }))
const items = ref<Item[]>([firstItem.value])

let multiplier = 1
const _100k = 100_000
for (const [i, worthDate] of props.netWorth.entries()) {
  if (worthDate.worth >= _100k * multiplier) {
    const item: Item = { date: worthDate.date, dollar: worthDate.worth, index: i }
    if (multiplier >= 2) {
      item.months = i - (items.value[multiplier - 1].index)
    }
    items.value.push(item)
    multiplier++
  }

  if (i === props.netWorth.length - 1) {
    items.value[items.value.length - 1].deficit = _100k * multiplier - worthDate.worth
  }
}

const currentWorthDate = computed(() => props.netWorth[props.netWorth.length - 1])


items.value.push({
  deficit: multiplier * _100k - currentWorthDate.value.worth,
  dollar: currentWorthDate.value.worth,
  index: currentWorthDate.value.index as number,
  date: currentWorthDate.value.date,
})

</script>
