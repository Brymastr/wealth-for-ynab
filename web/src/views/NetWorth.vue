<template>
  <div class="font-light" v-if="isBudgetSelected">
    <!-- header fix -->
    <HeaderFix />

    <!-- loading replacement for utility bar -->
    <Spinner v-if="!ready">Loading YNAB Data...</Spinner>

    <!-- utility bar -->
    <NetWorthUtilityBar v-if="ready" :dateList="(dateList as string[])" :startIndex="(startIndex as number)"
      :endIndex="(endIndex as number)" />

    <!-- main section -->
    <NetWorthMainSection v-if="ready" :netWorth="netWorthSlice" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// Composables
import useBackend from '@/composables/backend';
import useNetWorth from '@/composables/netWorth';

// Components
import Spinner from '@/components/General/Spinner.vue';
import NetWorthUtilityBar from '@/components/NetWorth/UtilityBar.vue';
import NetWorthMainSection from '@/components/NetWorth/MainSection.vue';
import HeaderFix from '@/components/General/HeaderFix.vue';

const { activeBackend } = useBackend()

const isBudgetSelected = activeBackend.value.isThereASelectedBudget

const { netWorthSlice, dateList, startIndex, endIndex } = useNetWorth()

const ready = computed(() => isBudgetSelected.value && netWorthSlice.value !== undefined && netWorthSlice.value.length > 0);
</script>
