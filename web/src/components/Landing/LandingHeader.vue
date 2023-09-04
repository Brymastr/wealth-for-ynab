
<template>
  <section class="bg-gray-900 mb-20 h-screen min-h-540 md:h-screen-1/2">
    <div class="lg:container mx-auto px-5 h-full flex flex-col">
      <header class="flex flex-col sm:flex-row items-center justify-between py-12">
        <!-- logo -->
        <BrynabLogo v-if="brynab" />
        <Logo v-else />

        <!-- nav buttons -->
        <div class="mt-12 flex w-full self-center sm:w-auto">
          <!-- full signup / login -->
          <div class="hidden sm:block text-xl">
            <a class="inline-block mt-0" :href="ynabReferral">
              <Underline color="green">Sign up for YNAB</Underline>
            </a>
            <LoginButton />
          </div>

          <!-- mobile signup / login -->
          <div class="sm:hidden text-center w-full mx-auto">
            <a class="inline-block p-4 mx-5 mb-5 leading-none rounded border border-blue-400 w-11/12"
              :href="ynabReferral">Sign up for YNAB</a>
            <a class="text-gray-800 inline-block p-4 mx-5 leading-none rounded bg-blue-400 w-11/12"
              href="/login">Login</a>
          </div>
        </div>
      </header>

      <!-- headline and graph -->
      <div class="grid grid-cols-3 h-full">
        <div class="self-center col-span-3 md:col-span-1 text-center sm:text-left">
          <h2 class="text-3xl">Discover your wealth</h2>
          <span>
            Wealth for YNAB is a free utility for analyzing your changing net worth. Discover trends, make
            correlations, and even glimpse into the future.
          </span>
        </div>
        <div class="-mr-5 col-span-3 md:col-span-2 cursor-pointer">
          <LineGraph chartId="header-line-graph" :data="props.data" :options="props.options" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ChartData, ChartOptions } from 'chart.js';
import LineGraph from '@/components/Graphs/LineGraph.vue';
import Logo from '@/components/General/Logo.vue';
import BrynabLogo from '@/components/General/BrynabLogo.vue';
import Underline from '@/components/General/Underline.vue';
import LoginButton from '@/components/Landing/LoginButton.vue';
import useSettings from '@/composables/settings';
import { ynabReferral } from '@/api/constants';

const props = defineProps<{
  data: ChartData,
  options: ChartOptions,
}>()

const { state: settings } = useSettings();
const brynab = computed(() => settings.brynab);

</script>
