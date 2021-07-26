<template>
  <div class="nav-parent xl:container mx-auto h-full hidden sm:grid px-3">
    <!-- left side -->
    <div class="justify-start h-header flex links" :class="{ invisible: hideLeftSide }">
      <NavItem @clicked="goToSettings" :selected="settingsSelected">Settings</NavItem>
      <NavItem @clicked="goToBudgets" :selected="budgetsSelected">Budgets</NavItem>
    </div>

    <!-- title -->
    <Title class="h-header" :class="{ invisible: hideTitle }" />

    <!-- right side -->
    <div class="justify-end h-header flex links">
      <NavItem @clicked="logout">Logout</NavItem>
    </div>

    <!-- nav content -->
    <Expanded />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import useNav from '@/composables/nav';
import Expanded from '@/components/Nav/Expanded.vue';
import Title from '@/components/Nav/Title.vue';
import NavItem from '@/components/Nav/NavTopItem.vue';
import useYnab from '@/composables/ynab';

export default defineComponent({
  name: 'Desktop',
  components: { Title, NavItem, Expanded },
  setup() {
    const { navPage, goToSettings, goToBudgets, logout } = useNav();
    const { state: ynabState } = useYnab();
    const budgetId = computed(() => ynabState.selectedBudgetId);

    const hideTitle = computed(() => navPage.value !== null);
    const hideLeftSide = computed(() => !budgetId.value);
    const settingsSelected = computed(() => navPage.value === 'settings');
    const budgetsSelected = computed(() => navPage.value === 'budgets');

    return { hideTitle, hideLeftSide, settingsSelected, budgetsSelected, goToSettings, goToBudgets, logout };
  },
});
</script>

<style lang="postcss" scoped>
.nav-parent {
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: min-content auto min-content;
}

.links {
  /* @apply -mx-1; */
  > div {
    @apply px-1;
  }
}
</style>
