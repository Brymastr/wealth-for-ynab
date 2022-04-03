<template>
  <div class="flex h-header items-center">
    <div class="mr-2 hidden sm:block">Date Range:</div>

    <!-- date select -->
    <div class="parent flex flex-col items-center text-xl leading-tight text-center">
      <!-- start date -->
      <Underline>
        <select
          class="cursor-pointer bg-transparent font-thin h-full focus:outline-none"
          name="date-select-start"
          id="date-select-start"
          v-model="selectedStartDate"
          @change="dateRangeSelected"
        >
          <option class="bg-gray-800" v-for="date in startDateOptions" :value="date" :key="date">
            {{ formatDate(date) }}
          </option>
        </select>
      </Underline>
    </div>

    <!-- divider -->
    <div class="mx-2 cursor-default">-</div>

    <!-- end date -->
    <div class="parent flex flex-col items-center text-xl leading-tight">
      <Underline>
        <select
          class="cursor-pointer bg-transparent font-thin focus:outline-none"
          name="date-select-end"
          id="date-select-end"
          v-model="selectedEndDate"
          @change="dateRangeSelected"
        >
          <option class="bg-gray-800" v-for="date in endDateOptions" :value="date" :key="date">
            {{ formatDate(date) }}
          </option>
        </select>
      </Underline>
    </div>
  </div>
</template>

<script lang="ts">
import { isBetween } from '@/services/helper';
import useYnab from '@/composables/ynab';
import { computed, defineComponent, PropType, ref } from 'vue';
import { addDays } from 'date-fns';
import { formatToTimeZone as format } from 'date-fns-timezone';
import Underline from '@/components/General/Underline.vue';

interface Props {
  dates: string[];
  startDate: string;
  endDate: string;
}

export default defineComponent({
  name: 'Date Select',
  components: { Underline },
  props: {
    dates: { type: Array as PropType<string[]>, default: () => [] },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
  },
  setup(props: Props, { emit }) {
    const { state, setBudgetStartDate, setBudgetEndDate } = useYnab();
    const firstDate = computed(() => props.dates[0]);
    const lastDate = computed(() => props.dates[props.dates.length - 1]);

    const selectedStartDate = ref(props.startDate);
    const selectedEndDate = ref(props.endDate);

    const startDateOptions = computed(() =>
      props.dates.filter(date => {
        const current = new Date(date);
        const start = new Date(firstDate.value);
        const end = addDays(new Date(selectedEndDate.value), -1);
        return isBetween(current, start, end);
      }),
    );

    const endDateOptions = computed(() =>
      props.dates.filter(date => {
        const current = new Date(date);
        const start = addDays(new Date(selectedStartDate.value), 1);
        const end = new Date(lastDate.value);
        return isBetween(current, start, end);
      }),
    );

    function formatDate(date: string) {
      return format(new Date(date), 'MMM YYYY', { timeZone: 'UTC' });
    }

    function dateRangeSelected() {
      const budget = {
        selectedStartDate: selectedStartDate.value,
        selectedEndDate: selectedEndDate.value,
        id: state.selectedBudgetId,
      };
      setBudgetStartDate(budget);
      setBudgetEndDate(budget);
      emit('dateRangeSelected');
    }

    return {
      firstDate,
      lastDate,
      startDateOptions,
      endDateOptions,
      formatDate,
      dateRangeSelected,
      selectedStartDate,
      selectedEndDate,
    };
  },
});
</script>

<style lang="postcss" scoped>
select {
  -webkit-appearance: none;
  -moz-appearance: none;
}

.underline {
  width: 0;
  height: 2px;
  background-color: #41526b;
}

.parent:hover > .underline {
  width: 100%;
  color: white;
}

.parent > select {
  text-align-last: center;
}
</style>
