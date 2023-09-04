<template>
  <!-- page -->
  <main class="flex flex-col text-blue-400 min-h-screen">
    <!-- header -->
    <LandingHeader :data="chartData" :options="options" />

    <!-- content -->
    <section class="text-gray-800 mb-20">
      <div class="lg:container mx-auto px-5 max-width flex flex-col sm:flex-row">
        <div class="flex flex-col flex-1 self-center">
          <NetChange :netWorth="data" />
          <PositiveNegative :netWorth="data" />
        </div>
        <div class="flex flex-col flex-1 self-center">
          <AverageChange :netWorth="data" />
          <BestWorst :netWorth="data" />
        </div>
        <div class="order-first flex-1 sm:order-last self-center mb-10 sm:mb-0 text-center sm:text-left">
          <h2 class="leading-none pb-2 text-3xl whitespace-no-wrap">Plan for your goals</h2>
          <span>
            Wealth for YNAB is for people who have reached level 4 and above and are looking to plan beyond
            the recommended 30 days age of money.
          </span>
        </div>
      </div>
    </section>

    <section class="text-gray-800 mb-20">
      <div class="lg:container mx-auto px-5 max-width grid grid-cols-6">
        <div class="col-span-6 sm:col-span-2 self-center text-center sm:text-left">
          <h2 class="text-3xl">Facebook OSS</h2>
          <span>Utilizing Facebook Prophet for time series forecasting.</span>
        </div>
        <div class="col-span-6 sm:col-span-4 self-center flex justify-evenly text-blue-700 mt-10 sm:mt-0">
          <a href="https://opensource.facebook.com">
            <img class="h-32 w-32" src="../assets/facebook_og_image-cutout.png" alt="facebook open source" />
          </a>

          <a href="https://facebook.github.io/prophet" alt="facebook prophet">
            <svg class="h-32 w-32 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72.6 72"
              xml:space="preserve">
              <path class="st0" d="M10.2,49.1v-0.1c0-7.6,5.4-13.8,13.3-13.8c1.2,0,2.3,0.2,3.4,0.4l6.2-7.6c-2.8-1.2-6-1.8-9.5-1.8
	C9.9,26.1,0,36.5,0,49.1v0.1c0,5.2,1.7,10.1,4.7,13.9l6.7-8.3C10.6,53.1,10.2,51.1,10.2,49.1z" />
              <path class="st0" d="M36.6,46.1c0.2,1,0.3,2,0.3,3v0.1c0,7.6-5.4,13.8-13.3,13.8c-2.3,0-4.3-0.5-6.1-1.5l-7.8,6.3
	c3.8,2.6,8.5,4.2,13.8,4.2c13.7,0,23.6-10.3,23.6-22.9v-0.1c0-3.5-0.8-6.7-2.1-9.6L36.6,46.1z" />
              <circle class="st0" cx="52.4" cy="20.2" r="6.9" />
              <circle class="st0" cx="68.7" cy="3.9" r="3.9" />
            </svg>
          </a>
        </div>
      </div>
    </section>

    <!-- footer -->
    <footer class="bg-blue-200 text-black min-w-full py-6">
      <!-- main footer content -->
      <div class="mx-auto">
        <div class="container mx-auto p-5">
          <a href="https://ynab.com/referral/?ref=IIutIbt-D7md0_0d&utm_source=customer_referral">
            <WorksWithYnabSvg />
          </a>
        </div>

        <!-- disclaimer -->
        <div class="text-xs text-gray-100 bg-gray-800 px-5">
          <span class="block container mx-auto text-center py-3">
            <span class="font-bold">You Need a Budget</span> and <span class="font-bold">YNAB</span> are
            registered trademarks of <span class="font-bold">You Need a Budget LLC</span>. Wealth for YNAB is
            an unofficial extension and not affiliated with
            <span class="font-bold">You Need a Budget LLC</span>.
          </span>
        </div>

        <!-- masthead -->
        <span class="block text-center text-gray-500 mt-3">
          Made by
          <a class="text-gray-800 hover:text-blue-800" href="https://github.com/brymastr">Brycen</a>
        </span>
      </div>
    </footer>
  </main>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import AverageChange from '@/components/Stats/AverageChange.vue';
import BestWorst from '@/components/Stats/BestWorst.vue';
import NetChange from '@/components/Stats/NetChange.vue';
import PositiveNegative from '@/components/Stats/PositiveNegative.vue';
import { getOptions, getChartData } from '@/composables/dummyGraph';
import LandingHeader from '@/components/Landing/LandingHeader.vue';
import WorksWithYnabSvg from '@/assets/works_with_ynab.vue';
import { useDummyDataApi } from '@/api/DummyDataApi';

export default defineComponent({
  components: {
    BestWorst,
    AverageChange,
    NetChange,
    PositiveNegative,
    LandingHeader,
    WorksWithYnabSvg,
  },
  setup() {


    function getData() {
      const data = dummyData.generateNetWorth();
      return getChartData(data);
    }

    function rebuild() {
      chartData.value = getData()

      clearInterval(interval.value);
      interval.value = setInterval(rebuild, 30000);
    }

    const dummyData = useDummyDataApi();

    const chartData = ref(getData());

    const interval = ref();

    const options = ref(getOptions(rebuild));

    rebuild();

    return { options, data: dummyData.generateNetWorth(), chartData };
  },
});
</script>
