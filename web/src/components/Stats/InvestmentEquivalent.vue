<template>
  <div class="flex flex-row self-start flex-wrap text-xl gap-y-3 pb-3 bg-gray-200 shadow-lg rounded-sm">
    <div class="text-gray-200 bg-gray-800 p-2 rounded-t-sm w-full">Net Worth Required for Equivalent Income in Retirement
    </div>
    <p>Income:</p>
    <input v-model="income" placeholder="100000" />

    <p>Interest:</p>
    <input v-model="interest" placeholder="5" />

    <p>Required Investment:</p>
    <Currency class="text-3xl -mt-2" :full=true :number="requiredInvestment" />

  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { WorthDate } from '@/types';
// Components
import Currency from '@/components/General/Currency.vue';

const props = defineProps<{ netWorth: WorthDate[] }>()

const income = ref<number>(136000)
const interest = ref(5)

const requiredInvestment = computed(() => income.value / (interest.value / 100))

</script>
