import { YnabDataApi, useYnabDataApi } from '@/api/YnabDataApi';
import { createDateList, formatEndOfMonth } from '@/services/helper';
import type { Budget } from '@/types';
import type { IBackend } from './backend';
import BaseBackend from './BaseBackend';
import useSession from './session';
import { BackendType, LoadingStatus } from './types';

export class YnabBackend extends BaseBackend implements IBackend {
  private client: YnabDataApi;
  constructor() {
    super(BackendType.ynab);
    const { getToken } = useSession();
    this.client = useYnabDataApi(getToken.value as string);
  }

  public async loadBudgets(): Promise<void> {
    this.setLoadingBudgets();
    const budgets = await this.client.getBudgets();

    for (const budget of budgets) {
      const stateBudget = this.getBudgetById(budget.id);
      const updatedBudget = Object.assign({}, stateBudget, budget);
      this.createOrUpdateBudget(updatedBudget);
    }

    this.setLoadingBudgets(LoadingStatus.complete);
    this.setBudgetsUpdatedAt();
  }

  public async loadNetWorth(): Promise<void> {
    this.setLoadingNetWorth();

    const budgetId = this.state.selectedBudgetId as string;

    const monthlyNetWorth = await this.client.getMonthlyNetWorth(budgetId);

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
