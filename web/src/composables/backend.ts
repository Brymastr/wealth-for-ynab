import type { Budget, DateRangeIndices, WorthDate } from '@/types';
import { computed, type ComputedRef, reactive, readonly, nextTick } from 'vue';
import useComposition from './base';
import { DummyBackend } from './DummyBackend';
import { noneBackend } from './NoneBackend';
import { BackendType, LoadingStatus } from './types';
import { YnabBackend } from './YnabBackend';
const namespace = 'backend';

export interface IBackend {
  // base
  name: BackendType;
  loadingBudgetsStatus: ComputedRef<LoadingStatus>;
  loadingNetWorthStatus: ComputedRef<LoadingStatus>;
  loadingForecastStatus: ComputedRef<LoadingStatus>;
  loadBudgets(): Promise<void>;
  loadNetWorth(): Promise<void>;
  loadForecast(): Promise<void>;

  // budgets
  budgets: ComputedRef<Budget[]>;
  sortedBudgets: ComputedRef<Budget[] | undefined>;
  isThereASelectedBudget: ComputedRef<boolean>;
  selectedBudgetId: ComputedRef<string | null>;
  selectedBudgetName: ComputedRef<string | undefined>;
  setSelectedBudget(budget: Budget): void;

  // data
  dateList: ComputedRef<string[] | undefined>;
  netWorth: ComputedRef<WorthDate[] | undefined>;
  forecast: ComputedRef<WorthDate[] | undefined>;

  // dates
  selectedStartIndex: ComputedRef<number | undefined>;
  selectedEndIndex: ComputedRef<number | undefined>;
  selectedStartDate: ComputedRef<string | undefined>;
  selectedEndDate: ComputedRef<string | undefined>;
  selectedForecastStartIndex: ComputedRef<number | undefined>;
  selectedForecastEndIndex: ComputedRef<number | undefined>;
  setBudgetDateRange(dateRange: DateRangeIndices): void;
  setForecastDateRange(dateRange: DateRangeIndices): void;

  clearState(): void;
  clearNetWorthData(): void;
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
  none: noneBackend,
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

  nextTick(() => {
    if (activeBackend?.value?.budgets.value.length === 0) {
      activeBackend?.value?.loadBudgets()
    }
  })
}

function setActiveBackendToPrevious() {
  const previous = state.previous ?? BackendType.ynab;
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

function clearNetWorthData() {
  activeBackend.value;
}

function budgetSelected(budget: Budget) {
  activeBackend.value.setSelectedBudget(budget);
  if (activeBackend.value?.netWorth.value?.length === 0) {
    activeBackend.value.loadNetWorth();
  }
}

export default function useBackend() {
  return {
    state: readonly(state),
    activeBackendType,
    activeBackend,
    setActiveBackend,
    setActiveBackendToPrevious,
    reset,
    budgetSelected,
    clearState,
    clearNetWorthData,
  };
}
