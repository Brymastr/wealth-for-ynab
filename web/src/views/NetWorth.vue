<template>
  <div class="font-thin" v-if="isBudgetSelected">
    <!-- header fix -->
    <HeaderFix />

    <!-- loading replacement for utility bar -->
    <Spinner v-if="!ready">Loading YNAB Data...</Spinner>

    <!-- utility bar -->
    <NetWorthUtilityBar v-if="ready" :dateList="(dateList as string[])" :startIndex="(startIndex as number)"
      :endIndex="(endIndex as number)" />

    <!-- main section -->
    <NetWorthMainSection v-if="ready" :netWorth="(netWorth as WorthDate[])" />

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// Composables
import useBackend from '@/composables/backend';
import { BackendType } from '@/composables/types';

// Components
import Spinner from '@/components/General/Spinner.vue';
import NetWorthUtilityBar from '@/components/NetWorth/UtilityBar.vue';
import NetWorthMainSection from '@/components/NetWorth/MainSection.vue';
import HeaderFix from '@/components/General/HeaderFix.vue'
import useNetWorth from '@/composables/netWorth';
import { WorthDate } from '@/types';

const { activeBackend, setActiveBackend } = useBackend()

if (activeBackend.value.name === undefined) {
  setActiveBackend(BackendType.ynab)
}

const isBudgetSelected = activeBackend.value.isThereASelectedBudget

const { netWorth, dateList, startIndex, endIndex } = useNetWorth()

const netWorthLength = computed(() => netWorth.value && netWorth.value.length)

if (netWorthLength.value === 0) activeBackend.value.loadNetWorth()

const ready = computed(() => isBudgetSelected.value && netWorth.value !== undefined && netWorth.value.length > 0);
</script>
