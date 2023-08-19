import { useDummyDataApi, DummyDataApi } from '@/api/DummyDataApi';
import { createDateList, formatEndOfMonth, wait } from '@/services/helper';
import { Budget } from '@/types';
import { IBackend } from './backend';
import BaseBackend from './BaseBackend';
import { BackendType, LoadingStatus } from './types';

export class DummyBackend extends BaseBackend implements IBackend {
  private client: DummyDataApi;
  constructor() {
    super(BackendType.dummy);
    this.client = useDummyDataApi();
  }

  public async loadBudgets(): Promise<void> {
    this.setLoadingBudgets();

    const budgets: Budget[] = [
      {
        id: '123',
        name: 'Dummy Budget #1',
        lastModified: new Date(Date.now() - 10000).toISOString(),
        firstMonth: '2018-01-01',
        lastMonth: '2020-10-01',
      },
      {
        id: '456',
        name: 'Dummy Budget #2',
        lastModified: new Date(Date.now() - 10000).toISOString(),
        firstMonth: '2018-01-01',
        lastMonth: '2020-10-01',
      },
    ];

    await wait(2000);

    this.createOrUpdateBudget(budgets[0]);
    this.createOrUpdateBudget(budgets[1]);

    this.setBudgetsUpdatedAt();
    this.setLoadingBudgets(LoadingStatus.complete);
  }

  public async loadNetWorth(): Promise<void> {
    this.setLoadingNetWorth();

    const budgetId = this.state.selectedBudgetId as string;

    const monthlyNetWorth = this.client.generateNetWorth();

    const budget = this.getBudgetById(budgetId) as Budget;
    const dateList = createDateList(monthlyNetWorth);
    const defaultStartDate = new Date(budget.firstMonth);
    const lastDayOfBudget = new Date(dateList[dateList.length - 1]);
    const today = new Date();
    const defaultEndDate = lastDayOfBudget.getTime() < today.getTime() ? lastDayOfBudget : today;

    const selectedStartDate = budget.selectedStartDate ?? formatEndOfMonth(defaultStartDate.toISOString());
    const selectedEndDate = budget.selectedEndDate ?? formatEndOfMonth(defaultEndDate.toISOString());
    const selectedStartIndex = budget.selectedStartIndex ?? 0;
    const selectedEndIndex = budget.selectedEndIndex ?? dateList.length - 1;

    const updatedBudget = Object.assign({}, budget, {
      monthlyNetWorth,
      selectedStartIndex,
      selectedEndIndex,
      selectedStartDate,
      selectedEndDate,
      dateList,
    });

    this.createOrUpdateBudget(updatedBudget);
    this.setLoadingNetWorth(LoadingStatus.complete);
    this.setNetWorthUpdatedAt();
  }
}

export const dummyBackend = new DummyBackend();
