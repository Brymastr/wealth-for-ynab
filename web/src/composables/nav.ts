import { nextTick, ref } from 'vue';
import router from '@/router';

export type NavPage = 'budgets' | 'settings' | null;
export type NavVisibility = 'closed' | 'mobile' | 'open';

const navPage = ref<NavPage>(null);
const navVisibility = ref<NavVisibility>('closed');
let previousNavVisibility: NavVisibility = 'closed';

function logout() {
  nextTick(() => router.replace({ name: 'Logout' }));
}

function openNav() {
  previousNavVisibility = navVisibility.value;
  navVisibility.value = 'open';
}

function closeNav() {
  if (previousNavVisibility === 'mobile') navVisibility.value = 'mobile';
  else navVisibility.value = 'closed';
}

function toggleMobileNav() {
  if (navVisibility.value === 'mobile') {
    navVisibility.value = 'closed';
  } else navVisibility.value = 'mobile';
  navPage.value = null;
}

function setNavPage(page: NavPage) {
  if (navPage.value === page) {
    navPage.value = null;
    closeNav();
  } else {
    navPage.value = page;
    openNav();
  }
}

function goToSettings() {
  setNavPage('settings');
}

function goToBudgets() {
  setNavPage('budgets');
}

function firstUse() {
  goToBudgets();
}

export default function useNav() {
  return { navPage, navVisibility, logout, goToSettings, goToBudgets, firstUse, toggleMobileNav };
}
