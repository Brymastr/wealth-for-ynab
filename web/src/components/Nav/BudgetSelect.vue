<template>
  <div class="
      flex flex-col
      sm:flex-row
      items-stretch
      divide-y-2
      sm:divide-y-0 sm:divide-x-2
      divide-blue-400
      w-full
      mx-auto
      sm:w-min
    ">
    <!-- left side -->
    <div class="flex sm:flex-col items-end justify-between sm:justify-start sm:pr-3 pb-3 sm:pb-0 px-3">
      <div class="flex flex-col sm:items-end">
        <div class="text-5xl sm:text-6xl uppercase leading-none">Budgets</div>
        <p>Select a budget to analyze</p>
      </div>
      <!-- small -->
      <div class="flex sm:hidden overflow-hidden">
        <ReloadIcon class="text-3xl -mr-1" id="reload-budgets-small" :rotate="spinLoadingIcon" :ready="ready"
          :action="loadBudgets" size="large">{{ spinLoadingIcon || !ready ? 'Loading ' : '' }}</ReloadIcon>

        <ArrowRightCircleIcon v-if="selectedBudgetId !== null" class="text-3xl -mr-1" label="" :action="go"
          size="large" />
      </div>
      <!-- large -->
      <div class="sm:flex-col sm:items-end hidden sm:flex">
        <ReloadIcon class="text-3xl -mr-1" id="reload-budgets-large" :rotate="spinLoadingIcon" :ready="ready"
          :action="loadBudgets" size="large">{{ spinLoadingIcon || !ready ? 'Loading...' : 'Refresh' }}</ReloadIcon>

        <ArrowRightCircleIcon v-if="selectedBudgetId !== null" class="text-3xl -mr-1" label="Go!" :action="go"
          size="large" />
      </div>
    </div>

    <!-- right side -->
    <div class="pt-3 sm:pt-0 sm:pl-3 sm:w-72">
      <div class="cursor-pointer transition duration-100 ease-out hover:bg-gray-900 p-3" v-for="budget in sortedBudgets"
        :key="budget.id" @click="budgetSelected(budget)">
        <span class="text-3xl leading-none">{{ budget.name }}</span>
        <CircleCheckIcon class="pl-2 -mt-2 inline-block" v-if="budget.id === selectedBudgetId" />
        <p class="pl-5">Beginning: {{ formatDate(budget.firstMonth) }}</p>
        <p class="pl-5">Last updated: {{ dateDifFormat(budget.lastModified) }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ReloadIcon from '@/components/Icons/ReloadIcon.vue';
import CircleCheckIcon from '@/components/Icons/CircleCheckIcon.vue';
import ArrowRightCircleIcon from '@/components/Icons/ArrowRightCircleIcon.vue';
import { formatDate, dateDifFormat } from '@/services/helper';
import { computed, defineComponent } from 'vue';
import useBackend from '@/composables/backend';
import { LoadingStatus } from '@/composables/types';
import { Budget } from '@/types';

export default defineComponent({
  name: 'Budget Select',
  components: { ReloadIcon, CircleCheckIcon, ArrowRightCircleIcon },
  setup(_, { emit }) {
    const { activeBackend } = useBackend()

    if (activeBackend.value.budgets.value.length === 0) activeBackend.value.loadBudgets();

    const spinLoadingIcon = computed(
      () => activeBackend.value.loadingBudgetsStatus.value === LoadingStatus.loading,
    );
    const ready = computed(() => activeBackend.value.loadingBudgetsStatus.value === LoadingStatus.ready);
    const selectedBudgetId = activeBackend.value.selectedBudgetId;

    // function budgetSelected(budget: Budget) {
    //   activeBackend.value.setSelectedBudget(budget)
    //   if()
    // }

    return {
      go: () => {
        emit('done');
      },
      dateDifFormat,
      loadBudgets: activeBackend.value.loadBudgets.bind(activeBackend.value),
      budgetSelected: activeBackend.value.setSelectedBudget.bind(activeBackend.value),
      formatDate,
      sortedBudgets: activeBackend.value.sortedBudgets,
      selectedBudgetId,
      spinLoadingIcon,
      ready,
    };
  },
});
</script>
