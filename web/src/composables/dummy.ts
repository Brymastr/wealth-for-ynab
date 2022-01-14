import { subMonths, addMonths } from 'date-fns';
import { formatEndOfMonth, wait } from '@/services/helper';
import { LoadingStatus, WorthDate } from '@/composables/types';
import { computed, reactive, readonly } from 'vue';
import useComposition from './base';
const namespace = 'dummy';

const { persist } = useComposition();

interface State {
  monthlyNetWorth: WorthDate[];
  forecast: WorthDate[];
  loadingNetWorthStatus: LoadingStatus;
  selectedStartDate?: string;
  selectedEndDate?: string;
}

const defaultState: State = {
  monthlyNetWorth: [],
  forecast: [],
  loadingNetWorthStatus: LoadingStatus.ready,
};

const state = reactive(defaultState);

function set() {
  persist(namespace, state);
}

function setLoadingNetWorth(status: LoadingStatus = LoadingStatus.loading) {
  state.loadingNetWorthStatus = status;
}

function randomNumber(minLength = 8, maxLength = 50) {
  return ~~(Math.random() * (maxLength - minLength + 1) + minLength);
}

function getRandomDataset(seriesLength: number) {
  const dataset: number[] = [];
  const modifier = randomNumber(1, 10);

  const probability = [-1933, -554, 190, 534, 674, 722, 930, 1687, 2329, 3542].map(x => x * modifier);
  let currentValue = randomNumber(-50000, 100000);

  for (let i = 0; i < seriesLength; i++) {
    const random = randomNumber(1, 10);

    currentValue += probability[random - 1];

    dataset.push(currentValue);
  }

  return dataset;
}

function getDateRange(seriesLength: number) {
  const date = subMonths(new Date(), seriesLength);

  const dates: string[] = [];

  for (let i = 0; i <= seriesLength; i++) {
    const d = formatEndOfMonth(addMonths(date, i).toISOString());
    dates.push(d);
  }

  return dates;
}

function generateNetWorth() {
  const seriesLength = randomNumber();

  const dates = getDateRange(seriesLength);
  const values: number[] = getRandomDataset(seriesLength);

  const result: WorthDate[] = [];

  for (let i = 0; i < seriesLength; i++) {
    const x: WorthDate = {
      date: dates[i],
      worth: values[i],
    };

    if (i !== 0) {
      const { date, worth } = result[i - 1];
      x.previous = { date, worth };
    }

    result.push(x);
  }

  return result;
}

async function loadNetWorth() {
  setLoadingNetWorth();

  const data = generateNetWorth();

  await wait();

  state.monthlyNetWorth = data;
  state.selectedStartDate = data[0].date;
  state.selectedEndDate = data[data.length - 1].date;

  set();

  setLoadingNetWorth(LoadingStatus.complete);
}

const getNetWorth = computed(() => state.monthlyNetWorth);
const selectedStartDate = computed(() => state.selectedStartDate);
const selectedEndDate = computed(() => state.selectedEndDate);

export default function useDummy() {
  return {
    state: readonly(state),
    loadNetWorth,
    getNetWorth,
    selectedStartDate,
    selectedEndDate,
  };
}
