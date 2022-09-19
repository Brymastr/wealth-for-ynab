import { Budget, DateRange, WorthDate } from '@/types';
import { computed, ComputedRef, reactive, readonly } from 'vue';
import useComposition from './base';
import { DummyBackend } from './DummyBackend';
import { BackendType, LoadingStatus } from './types';
import { YnabBackend } from './YnabBackend';
const namespace = 'backend';

export interface IBackend {
  name: BackendType;
  loadBudgets(): Promise<void>;
  loadNetWorth(): Promise<void>;
  loadForecast(): Promise<void>;
  setSelectedBudget(budget: Budget): void;
  budgets: ComputedRef<Budget[]>;
  isThereASelectedBudget: ComputedRef<boolean>;
  selectedBudgetId: ComputedRef<string | null>;
  selectedBudgetName: ComputedRef<string | undefined>;
  dateList: ComputedRef<string[] | undefined>;
  netWorth: ComputedRef<WorthDate[] | undefined>;
  forecast: ComputedRef<WorthDate[] | undefined>;
  selectedStartDate: ComputedRef<string | undefined>;
  selectedEndDate: ComputedRef<string | undefined>;
  selectedStartIndex: ComputedRef<number | undefined>;
  selectedEndIndex: ComputedRef<number | undefined>;
  selectedForecastStartDate: ComputedRef<string | undefined>;
  selectedForecastEndDate: ComputedRef<string | undefined>;
  sortedBudgets: ComputedRef<Budget[] | undefined>;
  loadingBudgetsStatus: ComputedRef<LoadingStatus>;
  loadingNetWorthStatus: ComputedRef<LoadingStatus>;
  loadingForecastStatus: ComputedRef<LoadingStatus>;
  setBudgetDateRange(dateRange: DateRange): void;
  setForecastDateRange(dateRange: DateRange): void;
  clearState(): void;
  reset(): void;
}

export interface BackendState {
  selectedBudgetId: string | null;
  budgets: Budget[];
  loadingStatus: LoadingStatus;
  loadingBudgetsStatus: LoadingStatus;
  loadingNetWorthStatus: LoadingStatus;
  loadingForecastStatus: LoadingStatus;
  budgetsUpdatedAt: number | null;
  netWorthUpdatedAt: number | null;
  forecastUpdatedAt: number | null;
}

interface State {
  active: BackendType;
  previous: BackendType;
}

const defaultState: State = {
  active: BackendType.none,
  previous: BackendType.none,
};

const state = reactive(defaultState);

const { persist, getModule } = useComposition();

const backends: Record<BackendType, IBackend | null> = {
  ynab: null,
  dummy: null,
  none: null,
};

const activeBackendType = computed(() => state.active);
const activeBackend = computed(() => backends[state.active] as IBackend);

function setActiveBackend(backendType: BackendType) {
  if (state.active !== backendType) {
    state.previous = state.active;
    state.active = backendType;
  }

  if (backendType === BackendType.ynab) {
    if (backends[BackendType.ynab] === null) backends[BackendType.ynab] = new YnabBackend();
  } else if (backendType === BackendType.dummy) {
    if (backends[BackendType.dummy] === null) backends[BackendType.dummy] = new DummyBackend();
  }

  set();
}

function setActiveBackendToPrevious() {
  const previous = state.previous;
  state.previous = state.active;
  state.active = previous;
  set();
}

function set() {
  persist(namespace, state);
}

function reset() {
  const x = getModule<State | undefined>(namespace);
  if (x === undefined) return;

  if (x.active !== undefined) {
    state.active = x.active;
    setActiveBackend(x.active);
  }
  if (x.previous !== undefined) state.previous = x.previous;

  Object.values(backends).forEach(backend => backend !== null && backend.reset());
}

function clearState() {
  Object.values(backends).forEach(backend => backend !== null && backend.clearState());
  state.active = BackendType.none;
  state.previous = BackendType.none;
  set();
}

export default function useBackend() {
  return {
    state: readonly(state),
    activeBackendType,
    activeBackend,
    setActiveBackend,
    setActiveBackendToPrevious,
    reset,
    clearState,
  };
}