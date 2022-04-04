import { wait } from '@/services/helper';
import { DateRange, LoadingStatus, WorthDate } from '@/composables/types';
import { computed, reactive, readonly } from 'vue';
import useForecastApi from '@/api/forecast';
import useDummyApi from '@/api/dummy';
import useComposition from './base';
const namespace = 'dummy';

const { persist } = useComposition();
const { generateNetWorth } = useDummyApi();
const { getForecast: getRemoteForecast } = useForecastApi();

////////////////
// Interfaces //
////////////////
interface State {
  netWorth: WorthDate[];
  forecast: WorthDate[];
  loadingNetWorthStatus: LoadingStatus;
  loadingForecastStatus: LoadingStatus;
  selectedStartDate?: string;
  selectedEndDate?: string;
  selectedForecastStartDate?: string;
  selectedForecastEndDate?: string;
}

////////////////
//    State   //
////////////////
const defaultState: State = {
  netWorth: [],
  forecast: [],
  loadingNetWorthStatus: LoadingStatus.ready,
  loadingForecastStatus: LoadingStatus.ready,
};

const state = reactive(defaultState);

function set() {
  persist(namespace, state);
}

////////////////
//   Getters  //
////////////////
const getNetWorth = computed(() => state.netWorth);
const getForecast = computed(() => state.forecast);
const selectedStartDate = computed(() => state.selectedStartDate);
const selectedEndDate = computed(() => state.selectedEndDate);
const selectedForecastStartDate = computed(() => state.selectedForecastStartDate);
const selectedForecastEndDate = computed(() => state.selectedForecastEndDate);

////////////////
//   Setters  //
////////////////
function setLoadingNetWorth(status: LoadingStatus = LoadingStatus.loading) {
  state.loadingNetWorthStatus = status;
}
function setLoadingForecast(status: LoadingStatus = LoadingStatus.loading) {
  state.loadingForecastStatus = status;
}
function setDateRange(payload: DateRange) {
  if (payload.startDate) state.selectedStartDate = payload.startDate;
  if (payload.endDate) state.selectedEndDate = payload.endDate;
  set();
}
function setForecastDateRange(payload: DateRange) {
  if (payload.startDate) state.selectedForecastStartDate = payload.startDate;
  if (payload.endDate) state.selectedForecastEndDate = payload.endDate;
  set();
}

////////////////
//   Loaders  //
////////////////
async function loadNetWorth() {
  setLoadingNetWorth();

  const data = generateNetWorth();

  await wait();

  state.netWorth = data;
  state.selectedStartDate = data[0].date;
  state.selectedEndDate = data[data.length - 1].date;

  set();

  setLoadingNetWorth(LoadingStatus.complete);
}
async function loadForecast() {
  setLoadingForecast();

  const netWorth = state.netWorth;
  if (netWorth === undefined) {
    setLoadingForecast(LoadingStatus.complete);
    setTimeout(() => setLoadingForecast(LoadingStatus.ready), 2000);
    return;
  }

  const forecast = await getRemoteForecast(netWorth);

  state.forecast = forecast;

  const firstDate = netWorth[0].date;
  const lastDate = forecast[forecast.length - 1].date;
  const dateRange: DateRange = { startDate: firstDate, endDate: lastDate };
  setForecastDateRange(dateRange);

  setLoadingForecast(LoadingStatus.complete);

  setTimeout(() => setLoadingForecast(LoadingStatus.ready), 2000);
}

export default function useDummy() {
  return {
    state: readonly(state),
    loadNetWorth,
    loadForecast,
    setDateRange,
    setForecastDateRange,
    getNetWorth,
    getForecast,
    selectedStartDate,
    selectedEndDate,
    selectedForecastStartDate,
    selectedForecastEndDate,
  };
}
