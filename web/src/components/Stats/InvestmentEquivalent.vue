<template>
  <Stat title="Net Worth Required for Equivalent Income in Retirement">
    <p>Income:</p>
    <input v-model="income" placeholder="100000" />

    <p>Interest:</p>
    <input v-model="interest" placeholder="5" />

    <p>Required Investment:</p>
    <Currency class="text-3xl -mt-2" :full=true :number="requiredInvestment" />
  </Stat>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

// Components
import Stat from '@/components/Stats/Stat.vue'
import Currency from '@/components/General/Currency.vue';

const income = ref<number>(136000)
const interest = ref(5)

const requiredInvestment = computed(() => income.value / (interest.value / 100))

</script>
