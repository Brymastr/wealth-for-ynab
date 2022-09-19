import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { BudgetDetail } from 'ynab';
import { apiUrl } from './constants';
import { Budget, WorthDate } from '@/types';

export class YnabDataApi {
  private client: AxiosInstance;
  constructor(token: string) {
    const baseConfig: AxiosRequestConfig = {
      baseURL: `${apiUrl}/ynab`,
      headers: { 'wealth-session-token': token },
    };
    this.client = axios.create(baseConfig);
  }

  private async get<T>(url: string) {
    return this.client.get<T>(url);
  }

  private mapToWealthBudget(budgetDetail: BudgetDetail): Budget {
    const budget: Budget = {
      id: budgetDetail.id,
      name: budgetDetail.name,
      lastModified: budgetDetail.last_modified_on as string,
      firstMonth: budgetDetail.first_month as string,
      lastMonth: budgetDetail.last_month as string,
    };

    return budget;
  }

  public async getBudgets() {
    const budgets = await this.get<BudgetDetail[]>('/budgets');
    const mapped = budgets.data.map(budget => this.mapToWealthBudget(budget));
    return mapped;
  }

  public async getMonthlyNetWorth(budgetId: string) {
    const response = await this.get<WorthDate[]>(`/budgets/${budgetId}/netWorth/month?includePrevious=true`);
    response.data.pop();
    return response.data;
  }
}

export const useYnabDataApi = (sessionToken: string) => new YnabDataApi(sessionToken);

// async function get<T>(url: string): Promise<AxiosResponse<T>> {
//   const { getToken } = useSession();
//   const baseConfig: AxiosRequestConfig = {
//     baseURL: `${apiUrl}/ynab`,
//     headers: { 'wealth-session-token': getToken.value ?? '' },
//   };
//   const ynab = axios.create(baseConfig);
//   return ynab.get<T>(url);
// }

// async function getBudgets(): Promise<BudgetDetail[]> {
//   const response = await get<BudgetDetail[]>('/budgets');
//   await
//   return response.data;
// }

// async function getAccounts(budgetId: string) {
//   const response = await get<Account[]>(`/budgets/${budgetId}/accounts`);
//   return response.data;
// }

// async function getDailyNetWorth(budgetId: string) {
//   const response = await get<WorthDate[]>(`/budgets/${budgetId}/netWorth/day?includePrevious=true`);
//   response.data.pop();
//   return response.data;
// }

// async function getMonthlyNetWorth(budgetId: string) {
//   const response = await get<WorthDate[]>(`/budgets/${budgetId}/netWorth/month?includePrevious=true`);
//   response.data.pop();
//   return response.data;
// }

// async function getAnnualNetWorth(budgetId: string) {
//   const response = await get<WorthDate[]>(`/budgets/${budgetId}/netWorth/year?includePrevious=true`);
//   response.data.pop();
//   return response.data;
// }

// export default function useYnab() {
//   return { getBudgets, getAccounts, getAnnualNetWorth, getMonthlyNetWorth, getDailyNetWorth };
// }
