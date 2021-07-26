<template>
  <transition name="navcontent" mode="out-in" class="flex justify-center items-center col-span-3 my-auto">
    <BudgetSelect v-if="showBudgets" @done="goToBudgets" />
    <Settings v-else-if="showSettings" @done="goToSettings" />
  </transition>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import useNav from '@/composables/nav';
import BudgetSelect from '@/components/Nav/BudgetSelect.vue';
import Settings from '@/components/Nav/Settings.vue';

export default defineComponent({
  name: 'Expanded',
  components: { BudgetSelect, Settings },
  setup() {
    const { navPage, goToSettings, goToBudgets } = useNav();

    const showBudgets = computed(() => navPage.value === 'budgets');
    const showSettings = computed(() => navPage.value === 'settings');

    return { showBudgets, showSettings, goToSettings, goToBudgets };
  },
});
</script>

<style lang="postcss">
.navcontent-enter-active,
.navcontent-leave-active {
  transition: opacity 0.2s ease;
}

.navcontent-enter-from,
.navcontent-leave-to {
  opacity: 0;
}
</style>
