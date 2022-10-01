import { useForecastApi } from '@/api/forecast';
import { formatEndOfMonth, getUnixTime, isAfter } from '@/services/helper';
import { Budget, DateRange, WorthDate } from '@/types';
import { reactive, computed } from 'vue';
import { BackendState } from './backend';
import useComposition from './base';
import { loadingReadyDelay } from './constants';
import { BackendType, LoadingStatus } from './types';

const { persist, getModule } = useComposition();

export default class BaseBackend {
  public readonly name: BackendType;
  private forecastClient = useForecastApi();
  constructor(private readonly namespace: BackendType) {
    this.name = this.namespace;
  }

  private defaultState: BackendState = {
    budgets: [],
    selectedBudgetId: null,
    budgetsUpdatedAt: null,
    netWorthUpdatedAt: null,
    forecastUpdatedAt: null,
    loadingStatus: LoadingStatus.ready,
    loadingBudgetsStatus: LoadingStatus.ready,
    loadingNetWorthStatus: LoadingStatus.ready,
    loadingForecastStatus: LoadingStatus.ready,
  };

  protected state = reactive<BackendState>(this.defaultState);

  private setState() {
    const { budgets, selectedBudgetId, budgetsUpdatedAt, netWorthUpdatedAt, forecastUpdatedAt } = this.state;
    persist(this.namespace, {
      budgets,
      selectedBudgetId,
      budgetsUpdatedAt,
      netWorthUpdatedAt,
      forecastUpdatedAt,
    });
  }
  public clearState() {
    this.state.selectedBudgetId = null;
    this.state.budgets.length = 0;
    this.setBudgetsUpdatedAt(null);
    this.setState();
  }

  protected setLoadingBudgets(status: LoadingStatus = LoadingStatus.loading) {
    this.state.loadingBudgetsStatus = status;

    if (status === LoadingStatus.complete) {
      setTimeout(() => this.setLoadingBudgets(LoadingStatus.ready), loadingReadyDelay);
    }
  }
  protected setLoadingForecast(status: LoadingStatus = LoadingStatus.loading) {
    this.state.loadingForecastStatus = status;

    if (status === LoadingStatus.complete) {
      setTimeout(() => this.setLoadingForecast(LoadingStatus.ready), loadingReadyDelay);
    }
  }
  protected setLoadingNetWorth(status: LoadingStatus = LoadingStatus.loading) {
    this.state.loadingNetWorthStatus = status;

    if (status === LoadingStatus.complete) {
      setTimeout(() => this.setLoadingNetWorth(LoadingStatus.ready), loadingReadyDelay);
    }
  }
  protected setBudgetsUpdatedAt(date: number | null = getUnixTime()) {
    this.state.budgetsUpdatedAt = date;
    this.setState();
  }
  protected setNetWorthUpdatedAt(date: number | null = getUnixTime()) {
    this.state.netWorthUpdatedAt = date;
    this.setState();
  }
  protected setForecastUpdatedAt(date: number | null = getUnixTime()) {
    this.state.forecastUpdatedAt = date;
    this.setState();
  }
  public setSelectedBudget(budget: Budget) {
    this.state.selectedBudgetId = budget.id;
    this.setState();
  }

  protected getBudgetById(budgetId?: string) {
    const id = budgetId ?? this.state.selectedBudgetId;
    return this.state.budgets.find(budget => budget.id === id);
  }

  public isThereASelectedBudget = computed(() => this.state.selectedBudgetId !== null);
  public budgets = computed(() => this.state.budgets);
  private budget = computed(() => this.getBudgetById());
  public selectedBudgetId = computed(() => this.state.selectedBudgetId);
  public selectedBudgetName = computed(() => this.budget.value?.name);
  public dateList = computed(() => this.budget.value?.dateList);
  public netWorth = computed(() => this.budget.value?.monthlyNetWorth);
  public forecast = computed(() => this.budget.value?.forecast);
  public selectedStartIndex = computed(() =>
    this.dateList.value?.indexOf(this.selectedStartDate.value as string),
  );
  public selectedEndIndex = computed(() =>
    this.dateList.value?.indexOf(this.selectedEndDate.value as string),
  );
  public selectedStartDate = computed(() => this.budget.value?.selectedStartDate);
  public selectedEndDate = computed(() => this.budget.value?.selectedEndDate);
  public selectedForecastStartDate = computed(() => this.budget.value?.selectedForecastStartDate);
  public selectedForecastEndDate = computed(() => this.budget.value?.selectedForecastEndDate);
  public selectedForecastStartIndex = computed(() =>
    this.dateList.value?.indexOf(this.selectedForecastStartDate.value as string),
  );
  public selectedForecastEndIndex = computed(() =>
    this.dateList.value?.indexOf(this.selectedForecastEndDate.value as string),
  );
  public sortedBudgets = computed(() =>
    this.budgets.value?.sort((a, b) => {
      const aDate = new Date(a.lastModified ?? '');
      const bDate = new Date(b.lastModified ?? '');
      return isAfter(aDate, bDate) ? -1 : 1;
    }),
  );
  public loadingBudgetsStatus = computed(() => this.state.loadingBudgetsStatus);
  public loadingNetWorthStatus = computed(() => this.state.loadingNetWorthStatus);
  public loadingForecastStatus = computed(() => this.state.loadingForecastStatus);

  protected createOrUpdateBudget(input: Budget) {
    const index = this.budgets.value.findIndex(({ id }) => id === input.id);
    if (index > -1) this.state.budgets.splice(index, 1);

    const budget = Object.assign({}, input);

    if (budget.monthlyNetWorth === undefined) budget.monthlyNetWorth = [];
    if (budget.forecast === undefined) budget.forecast = [];
    budget.firstMonth = formatEndOfMonth(budget.firstMonth);
    budget.lastMonth = formatEndOfMonth(budget.lastMonth);

    this.state.budgets.push(budget);
    this.setState();
  }

  public async loadForecast() {
    this.setLoadingForecast();

    const budget = this.budget.value as Budget;
    const monthlyNetWorth = budget.monthlyNetWorth as WorthDate[];

    const forecast = await this.forecastClient.getForecast(monthlyNetWorth);

    const updatedBudget = Object.assign({}, budget, { forecast });

    this.createOrUpdateBudget(updatedBudget);

    this.setLoadingForecast(LoadingStatus.complete);

    this.setForecastUpdatedAt();

    setTimeout(() => this.setLoadingForecast(LoadingStatus.ready), 2000);
  }

  public setBudgetDateRange(dateRange: DateRange) {
    const budget = this.budget.value as Budget;
    budget.selectedStartDate = dateRange.startDate;
    budget.selectedEndDate = dateRange.endDate;
    this.setState();
  }

  public setForecastDateRange(dateRange: DateRange) {
    const budget = this.budget.value as Budget;
    budget.selectedForecastStartDate = dateRange.startDate;
    budget.selectedForecastEndDate = dateRange.endDate;
  }

  public reset() {
    const x = getModule<BackendState | undefined>(this.namespace);
    if (x === undefined) return;
    if (x.budgets !== undefined) this.state.budgets = x.budgets;
    if (x.selectedBudgetId !== undefined) this.state.selectedBudgetId = x.selectedBudgetId;
    if (x.budgetsUpdatedAt !== undefined) this.state.budgetsUpdatedAt = x.budgetsUpdatedAt;
    if (x.netWorthUpdatedAt !== undefined) this.state.netWorthUpdatedAt = x.netWorthUpdatedAt;
    if (x.forecastUpdatedAt !== undefined) this.state.forecastUpdatedAt = x.forecastUpdatedAt;
  }
}
