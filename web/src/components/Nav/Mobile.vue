<template>
  <div class="sm:hidden flex flex-col h-5/6">
    <!-- top  -->
    <div class="nav-top grid" @click="toggleMobileNav">
      <!-- hamburger -->
      <NavItem class="py-2 h-full w-10 pl-3" :underline="false"><Logo /></NavItem>

      <!-- title -->
      <Title class="h-header" />
    </div>

    <!-- links -->
    <div class="justify-center h-header flex links">
      <NavItem @clicked="goToSettings" :selected="settingsSelected">Settings</NavItem>
      <NavItem @clicked="goToBudgets" :selected="budgetsSelected">Budgets</NavItem>
      <NavItem @clicked="logout">Logout</NavItem>
    </div>

    <!-- nav content -->
    <Expanded />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import useNav from '@/composables/nav';
import Title from '@/components/Nav/Title.vue';
import NavItem from '@/components/Nav/NavTopItem.vue';
import Expanded from '@/components/Nav/Expanded.vue';
import Logo from '@/assets/logo.vue';

export default defineComponent({
  name: 'Mobile',
  components: { Title, NavItem, Expanded, Logo },
  setup() {
    const { navPage, goToSettings, goToBudgets, logout, toggleMobileNav } = useNav();

    const settingsSelected = computed(() => navPage.value === 'settings');
    const budgetsSelected = computed(() => navPage.value === 'budgets');

    return {
      settingsSelected,
      budgetsSelected,
      goToSettings,
      goToBudgets,
      logout,
      toggleMobileNav,
    };
  },
});
</script>

<style lang="postcss" scoped>
.nav-top {
  grid-template-columns: repeat(3, 1fr);
}

.links {
  > div {
    @apply p-2;
  }
}
</style>
