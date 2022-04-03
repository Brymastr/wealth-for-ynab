import { computed, reactive, readonly } from 'vue';
import { BudgetDetail, Account } from 'ynab';
import { getUnixTime, isAfter } from 'date-fns';
import numeral from 'numeral';
import { LoadingStatus, WorthDate } from './types';
import useYnabApi from '@/api/ynab';
import { formatEndOfMonth, isBetween, createDateList } from '@/services/helper';
import useComposition from './base';
const namespace = 'ynab';

const { persist, getModule } = useComposition();
const { getBudgets, getAccounts, getMonthlyNetWorth } = useYnabApi();

interface AccountsPayload {
  budgetId: string;
  accounts: Account[];
}

export interface Budget extends BudgetDetail {
  monthlyNetWorth?: WorthDate[];
  forecast?: WorthDate[];
  selectedStartDate?: string;
  selectedEndDate?: string;
  dateList?: string[];
}

interface State {
  selectedBudgetId: string | null;
  selectedBudgetName: string | null;
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

const defaultState: State = {
  budgets: [],
  selectedBudgetId: null,
  selectedBudgetName: null,
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

const state = reactive(defaultState);

function getBudgetById(budgetId?: string) {
  const id = budgetId ?? state.selectedBudgetId;
  return state.budgets.find(budget => budget.id === id);
}
const getNetWorth = computed(() => {
  const budget = getBudgetById();
  return budget?.monthlyNetWorth ?? [];
});
const getForecast = computed(() => {
  const budget = getBudgetById();
  return budget?.forecast ?? [];
});
const getCombined = computed((budgetId?: string) => {
  const budget = getBudgetById(budgetId);
  return budget?.monthlyNetWorth?.concat(...(budget.forecast ?? [])) ?? [];
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
const getFilteredDateRange = (data: WorthDate[]) => {
  const start = getSelectedStartDate.value;
  const end = getSelectedEndDate.value;
  if (!start || !end) return null;

  return data.filter(({ date }) => isBetween(new Date(date), new Date(start), new Date(end)));
};

function setLoadingBudgets(status: LoadingStatus = LoadingStatus.loading) {
  state.loadingBudgetsStatus = status;
}
function setLoadingAccounts(status: LoadingStatus = LoadingStatus.loading) {
  state.loadingAccountsStatus = status;
}
// function setLoadingForecast(status: LoadingStatus) {
//   state.loadingForecastStatus = status;
// }
function setLoadingNetWorth(status: LoadingStatus = LoadingStatus.loading) {
  state.loadingNetWorthStatus = status;
}
function setBudgetsUpdatedAt(date: number | null) {
  state.budgetsUpdatedAt = date;
  set();
}

interface BudgetDates {
  selectedStartDate: string;
  selectedEndDate: string;
  id: string | null;
}
function setBudgetStartDate(payload: BudgetDates) {
  const budget = state.budgets.find(x => x.id === payload.id);
  if (!budget) return;
  budget.selectedStartDate = payload.selectedStartDate;
  set();
}
function setBudgetEndDate(payload: BudgetDates) {
  const budget = state.budgets.find(x => x.id === payload.id);
  if (!budget) return;
  budget.selectedEndDate = payload.selectedEndDate;
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
// function setForecastUpdatedAt(date: number) {
//   state.forecastUpdatedAt = date;
//   set();
// }

function createOrUpdateBudget(input: Budget) {
  const index = state.budgets.findIndex(x => x.id === input.id);

  if (index !== -1) state.budgets.splice(index, 1);

  const budget: Budget = Object.assign({}, input);

  if (budget.monthlyNetWorth === undefined || budget.monthlyNetWorth.length === 0)
    budget.monthlyNetWorth = [];
  if (budget.forecast === undefined || budget.forecast.length === 0) budget.forecast = [];

  budget.first_month = formatEndOfMonth(input.first_month);
  console.log(input.first_month, budget.first_month);
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

async function loadAccounts() {
  setLoadingAccounts(LoadingStatus.loading);

  const budgetId = state.selectedBudgetId;

  if (!budgetId) return null;

  const remoteAccounts = await getAccounts(budgetId);

  const accountsPayload = { budgetId, accounts: remoteAccounts };

  createOrUpdateAccounts(accountsPayload);

  setLoadingAccounts(LoadingStatus.complete);

  setAccountsUpdatedAt(getUnixTime(Date.now()));

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

  setNetWorthUpdatedAt(getUnixTime(Date.now()));

  setTimeout(() => setLoadingNetWorth(LoadingStatus.ready), 2000);
}

// async function loadForecast() {
//   setLoadingAccounts(LoadingStatus.loading);

//   const budgetId = state.selectedBudgetId;

//   if (!budgetId) return null;

//   const budget = getBudgetById(budgetId);
//   if (!budget) {
//     setLoadingForecast(LoadingStatus.complete);
//     setTimeout(() => setLoadingForecast(LoadingStatus.ready), 2000);
//     return;
//   }

//   const netWorth = budget.monthlyNetWorth;
//   if (netWorth === undefined) {
//     setLoadingForecast(LoadingStatus.complete);
//     setTimeout(() => setLoadingForecast(LoadingStatus.ready), 2000);
//     return;
//   }

//   const forecast = await getRemoteForecast(netWorth);

//   const updatedBudget = Object.assign({}, budget, { forecast });

//   createOrUpdateBudget(updatedBudget);

//   setLoadingForecast(LoadingStatus.complete);

//   setForecastUpdatedAt(getUnixTime(Date.now()));

//   setTimeout(() => setLoadingForecast(LoadingStatus.ready), 2000);
// }

function loadMonthlyData() {
  loadNetWorth();
}

function setSelectedBudget(budget: Budget) {
  state.selectedBudgetId = budget.id;
  state.selectedBudgetName = budget.name;
  set();
}

function budgetSelected(budget: Budget) {
  if (budget.id === state.selectedBudgetId) return;
  setSelectedBudget(budget);

  numeral.locale(budget.currency_format?.iso_code);
  const netWorth = getNetWorth.value;
  if (netWorth.length === 0) loadMonthlyData();
}

function clearState() {
  state.selectedBudgetId = null;
  state.selectedBudgetName = null;
  state.budgets.length = 0;
  setBudgetsUpdatedAt(null);
  set();
}

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
  setBudgetsUpdatedAt(getUnixTime(Date.now()));

  setTimeout(() => setLoadingBudgets(LoadingStatus.ready), 2000);
}

const sortedBudgets = computed(() => {
  return state.budgets.sort((a, b) => {
    const aDate = new Date(a.last_modified_on ?? '');
    const bDate = new Date(b.last_modified_on ?? '');

    return isAfter(aDate, bDate) ? -1 : 1;
  });
});

function set() {
  persist(namespace, {
    budgets: state.budgets,
    selectedBudgetId: state.selectedBudgetId,
    selectedBudgetName: state.selectedBudgetName,
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
  if (x?.selectedBudgetName !== undefined) state.selectedBudgetName = x.selectedBudgetName;
  if (x?.budgetsUpdatedAt !== undefined) state.budgetsUpdatedAt = x.budgetsUpdatedAt;
  if (x?.accountsUpdatedAt !== undefined) state.accountsUpdatedAt = x.accountsUpdatedAt;
  if (x?.netWorthUpdatedAt !== undefined) state.netWorthUpdatedAt = x.netWorthUpdatedAt;
  if (x?.forecastUpdatedAt !== undefined) state.forecastUpdatedAt = x.forecastUpdatedAt;
}

export default function useYnab() {
  return {
    state: readonly(state),
    selectedBudgetId: computed(() => state.selectedBudgetId),
    sortedBudgets,
    getNetWorth,
    getForecast,
    getCombined,
    getSelectedStartDate,
    getSelectedEndDate,
    createDateList,
    getBudgetById,
    loadBudgets,
    loadAccounts,
    loadNetWorth,
    setBudgetStartDate,
    setBudgetEndDate,
    getFilteredDateRange,
    loadMonthlyData,
    budgetSelected,
    clearState,
    reset,
  };
}
