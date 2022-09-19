<template>
  <div class="nav-parent xl:container h-full hidden sm:grid mx-3 xl:mx-auto">
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

<script setup lang="ts">
import { computed } from 'vue';
import useNav from '@/composables/nav';

// Components
import Expanded from '@/components/Nav/Expanded.vue';
import Title from '@/components/Nav/Title.vue';
import NavItem from '@/components/Nav/NavTopItem.vue';
import useBackend from '@/composables/backend';

const { navPage, goToSettings, goToBudgets, logout } = useNav();
const { activeBackend } = useBackend()

const hideTitle = computed(() => navPage.value !== null);
const hideLeftSide = computed(() => !activeBackend.value?.isThereASelectedBudget.value);
const settingsSelected = computed(() => navPage.value === 'settings');
const budgetsSelected = computed(() => navPage.value === 'budgets');
</script>

<style lang="postcss" scoped>
.nav-parent {
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: min-content auto min-content;
}

.links {

  /* @apply -mx-1; */
  >div {
    @apply px-1;
  }
}
</style>
