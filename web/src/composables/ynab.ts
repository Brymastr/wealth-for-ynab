import { computed, reactive, readonly } from 'vue';
import { BudgetDetail, Account } from 'ynab';
import numeral from 'numeral';
import { DateRange, LoadingStatus, WorthDate } from './types';
import useYnabApi from '@/api/ynab';
import useForecastApi from '@/api/forecast';
import { formatEndOfMonth, createDateList, getUnixTime, isAfter } from '@/services/helper';
import useComposition from './base';
const namespace = 'ynab';

const { persist, getModule } = useComposition();
const { getBudgets, getAccounts, getMonthlyNetWorth } = useYnabApi();
const { getForecast: getRemoteForecast } = useForecastApi();

////////////////
// Interfaces //
////////////////
interface AccountsPayload {
  budgetId: string;
  accounts: Account[];
}

export interface Budget extends BudgetDetail {
  monthlyNetWorth?: WorthDate[];
  forecast?: WorthDate[];
  selectedStartDate?: string;
  selectedEndDate?: string;
  selectedForecastStartDate?: string;
  selectedForecastEndDate?: string;
  dateList?: string[];
}

interface State {
  selectedBudgetId: string | null;
  budgets: Budget[];
  loadingStatus: LoadingStatus;
  loadingBudgetsStatus: LoadingStatus;
  loadingAccountsStatus: LoadingStatus;
  loadingNetWorthStatus: LoadingStatus;
  loadingForecastStatus: LoadingStatus;
  budgetsUpdatedAt: number | null;
  accountsUpdatedAt: number | null;
  netWorthUpdatedAt: number | null;
  forecastUpdatedAt: number | null;
}

////////////////
//    State   //
////////////////
const defaultState: State = {
  budgets: [],
  selectedBudgetId: null,
  budgetsUpdatedAt: null,
  accountsUpdatedAt: null,
  netWorthUpdatedAt: null,
  forecastUpdatedAt: null,
  loadingStatus: LoadingStatus.ready,
  loadingAccountsStatus: LoadingStatus.ready,
  loadingBudgetsStatus: LoadingStatus.ready,
  loadingNetWorthStatus: LoadingStatus.ready,
  loadingForecastStatus: LoadingStatus.ready,
};

const state = reactive<State>(defaultState);

function clearState() {
  state.selectedBudgetId = null;
  state.budgets.length = 0;
  setBudgetsUpdatedAt(null);
  set();
}
function set() {
  persist(namespace, {
    budgets: state.budgets,
    selectedBudgetId: state.selectedBudgetId,
    budgetsUpdatedAt: state.budgetsUpdatedAt,
    accountsUpdatedAt: state.accountsUpdatedAt,
    netWorthUpdatedAt: state.netWorthUpdatedAt,
    forecastUpdatedAt: state.forecastUpdatedAt,
  });
}
function reset() {
  const x = getModule<State>(namespace);
  if (x?.budgets !== undefined) state.budgets = x.budgets;
  if (x?.selectedBudgetId !== undefined) state.selectedBudgetId = x.selectedBudgetId;
  if (x?.budgetsUpdatedAt !== undefined) state.budgetsUpdatedAt = x.budgetsUpdatedAt;
  if (x?.accountsUpdatedAt !== undefined) state.accountsUpdatedAt = x.accountsUpdatedAt;
  if (x?.netWorthUpdatedAt !== undefined) state.netWorthUpdatedAt = x.netWorthUpdatedAt;
  if (x?.forecastUpdatedAt !== undefined) state.forecastUpdatedAt = x.forecastUpdatedAt;
}

////////////////
//   Getters  //
////////////////
function getBudgetById(budgetId?: string) {
  const id = budgetId ?? state.selectedBudgetId;
  return state.budgets.find(budget => budget.id === id);
}
const getSelectedBudgetName = computed(() => {
  const budget = getBudgetById();
  return budget?.name;
});
const getNetWorth = computed(() => {
  const budget = getBudgetById();
  return budget?.monthlyNetWorth ?? [];
});
const getForecast = computed(() => {
  const budget = getBudgetById();
  return budget?.forecast ?? [];
});
const getSelectedStartDate = computed(() => {
  const budget = getBudgetById();
  if (!budget) return null;
  return budget.selectedStartDate;
});
const getSelectedEndDate = computed(() => {
  const budget = getBudgetById();
  if (!budget) return null;
  return budget.selectedEndDate;
});
const getSelectedForecastStartDate = computed(() => {
  const budget = getBudgetById();
  if (!budget) return null;
  return budget.selectedForecastStartDate;
});
const getSelectedForecastEndDate = computed(() => {
  const budget = getBudgetById();
  if (!budget) return null;
  return budget.selectedForecastEndDate;
});
const getSortedBudgets = computed(() => {
  return state.budgets.sort((a, b) => {
    const aDate = new Date(a.last_modified_on ?? '');
    const bDate = new Date(b.last_modified_on ?? '');

    return isAfter(aDate, bDate) ? -1 : 1;
  });
});

////////////////
//   Setters  //
////////////////
function setLoadingBudgets(status: LoadingStatus = LoadingStatus.loading) {
  state.loadingBudgetsStatus = status;
}
function setLoadingAccounts(status: LoadingStatus = LoadingStatus.loading) {
  state.loadingAccountsStatus = status;
}
function setLoadingForecast(status: LoadingStatus = LoadingStatus.loading) {
  state.loadingForecastStatus = status;
}
function setLoadingNetWorth(status: LoadingStatus = LoadingStatus.loading) {
  state.loadingNetWorthStatus = status;
}
function setBudgetsUpdatedAt(date: number | null) {
  state.budgetsUpdatedAt = date;
  set();
}
function setSelectedBudget(budget: Budget) {
  state.selectedBudgetId = budget.id;
  set();
}
function setBudgetDateRange(payload: DateRange) {
  const budget = getBudgetById();
  if (!budget) return;
  if (payload.startDate) budget.selectedStartDate = payload.startDate;
  if (payload.endDate) budget.selectedEndDate = payload.endDate;
  set();
}
function setForecastDateRange(payload: DateRange) {
  const budget = getBudgetById();
  if (!budget) return;
  if (payload.startDate) budget.selectedForecastStartDate = payload.startDate;
  if (payload.endDate) budget.selectedForecastEndDate = payload.endDate;
  set();
}
function setAccountsUpdatedAt(date: number) {
  state.accountsUpdatedAt = date;
  set();
}
function setNetWorthUpdatedAt(date: number) {
  state.netWorthUpdatedAt = date;
  set();
}
function setForecastUpdatedAt(date: number) {
  state.forecastUpdatedAt = date;
  set();
}
function createOrUpdateBudget(input: Budget) {
  const index = state.budgets.findIndex(x => x.id === input.id);

  if (index !== -1) state.budgets.splice(index, 1);

  const budget: Budget = Object.assign({}, input);

  if (budget.monthlyNetWorth === undefined || budget.monthlyNetWorth.length === 0)
    budget.monthlyNetWorth = [];
  if (budget.forecast === undefined || budget.forecast.length === 0) budget.forecast = [];

  budget.first_month = formatEndOfMonth(input.first_month);
  budget.last_month = formatEndOfMonth(input.last_month);

  state.budgets.push(budget);

  set();
}
function createOrUpdateAccounts(payload: AccountsPayload) {
  const budget = state.budgets.find(budget => budget.id === payload.budgetId);

  if (budget === undefined) return null;

  const budgetAccounts = budget.accounts;
  if (budgetAccounts === null || budgetAccounts === undefined) return null;

  budgetAccounts.length = 0;
  payload.accounts.forEach(account => budgetAccounts.push(account));
  set();
}

////////////////
//   Loaders  //
////////////////
async function loadBudgets() {
  setLoadingBudgets(LoadingStatus.loading);
  const remoteBudgets = await getBudgets();

  for (const remoteBudget of remoteBudgets) {
    const existingBudget = state.budgets.find(b => b.id === remoteBudget.id);
    if (existingBudget !== undefined) {
      const updatedBudget = Object.assign({}, existingBudget, remoteBudget);
      createOrUpdateBudget(updatedBudget);
    } else {
      createOrUpdateBudget(remoteBudget);
    }
  }

  setLoadingBudgets(LoadingStatus.complete);
  setBudgetsUpdatedAt(getUnixTime());

  setTimeout(() => setLoadingBudgets(LoadingStatus.ready), 2000);
}
async function loadAccounts() {
  setLoadingAccounts(LoadingStatus.loading);

  const budgetId = state.selectedBudgetId;

  if (!budgetId) return null;

  const remoteAccounts = await getAccounts(budgetId);

  const accountsPayload = { budgetId, accounts: remoteAccounts };

  createOrUpdateAccounts(accountsPayload);

  setLoadingAccounts(LoadingStatus.complete);

  setAccountsUpdatedAt(getUnixTime());

  setTimeout(() => setLoadingAccounts(LoadingStatus.ready), 2000);
}
async function loadNetWorth() {
  setLoadingNetWorth(LoadingStatus.loading);

  const budgetId = state.selectedBudgetId;

  if (!budgetId) return null;

  const monthlyNetWorth = await getMonthlyNetWorth(budgetId);

  const budget = state.budgets.find(b => b.id === budgetId);
  if (!budget) return;

  const dateList = createDateList(monthlyNetWorth);
  const selectedStartDate = new Date(budget.first_month ?? '');
  const lastDay = new Date(dateList[dateList.length - 1]);
  const today = new Date();
  const selectedEndDate = lastDay.getTime() < today.getTime() ? lastDay : today;

  const updatedBudget = Object.assign({}, budget, {
    monthlyNetWorth,
    selectedStartDate: budget.selectedStartDate ?? formatEndOfMonth(selectedStartDate.toISOString()),
    selectedEndDate: budget.selectedEndDate ?? formatEndOfMonth(selectedEndDate.toISOString()),
  });

  createOrUpdateBudget(updatedBudget);

  setLoadingNetWorth(LoadingStatus.complete);

  setNetWorthUpdatedAt(getUnixTime());

  setTimeout(() => setLoadingNetWorth(LoadingStatus.ready), 2000);
}
async function loadForecast() {
  setLoadingForecast();

  const budgetId = state.selectedBudgetId;

  if (!budgetId) return null;

  const budget = getBudgetById(budgetId);
  if (!budget) {
    setLoadingForecast(LoadingStatus.complete);
    setTimeout(() => setLoadingForecast(LoadingStatus.ready), 2000);
    return;
  }

  const netWorth = budget.monthlyNetWorth;
  if (netWorth === undefined) {
    setLoadingForecast(LoadingStatus.complete);
    setTimeout(() => setLoadingForecast(LoadingStatus.ready), 2000);
    return;
  }

  const forecast = await getRemoteForecast(netWorth);

  const updatedBudget = Object.assign({}, budget, { forecast });

  createOrUpdateBudget(updatedBudget);

  const firstDate = netWorth[0].date;
  const lastDate = forecast[forecast.length - 1].date;
  const dateRange: DateRange = { startDate: firstDate, endDate: lastDate };
  setForecastDateRange(dateRange);

  setLoadingForecast(LoadingStatus.complete);

  setForecastUpdatedAt(getUnixTime());

  setTimeout(() => setLoadingForecast(LoadingStatus.ready), 2000);
}
function budgetSelected(budget: Budget) {
  if (budget.id === state.selectedBudgetId) return;
  setSelectedBudget(budget);

  numeral.locale(budget.currency_format?.iso_code);
  const netWorth = getNetWorth.value;
  if (netWorth.length === 0) loadNetWorth();
}

export default function useYnab() {
  return {
    state: readonly(state),
    selectedBudgetId: computed(() => state.selectedBudgetId),
    getNetWorth,
    getForecast,
    getSortedBudgets,
    getSelectedBudgetName,
    getSelectedStartDate,
    getSelectedEndDate,
    getSelectedForecastStartDate,
    getSelectedForecastEndDate,
    createDateList,
    getBudgetById,
    loadBudgets,
    loadAccounts,
    loadNetWorth,
    loadForecast,
    setBudgetDateRange,
    setForecastDateRange,
    budgetSelected,
    clearState,
    reset,
  };
}
