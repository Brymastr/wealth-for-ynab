import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { BudgetDetail, Account } from 'ynab';
import { WorthDate } from '@/composables/types';
import useSession from '@/composables/session';
import { apiUrl } from './constants';

async function get<T>(url: string): Promise<AxiosResponse<T>> {
  const { getToken } = useSession();
  const baseConfig: AxiosRequestConfig = {
    baseURL: `${apiUrl}/ynab`,
    headers: { 'wealth-session-token': getToken.value ?? '' },
  };
  const ynab = axios.create(baseConfig);
  return ynab.get<T>(url);
}

async function getBudgets(): Promise<BudgetDetail[]> {
  const response = await get<BudgetDetail[]>('/budgets');
  return response.data;
}

async function getAccounts(budgetId: string) {
  const response = await get<Account[]>(`/budgets/${budgetId}/accounts`);
  return response.data;
}

async function getDailyNetWorth(budgetId: string) {
  const response = await get<WorthDate[]>(`/budgets/${budgetId}/netWorth/day?includePrevious=true`);
  response.data.pop();
  return response.data;
}

async function getMonthlyNetWorth(budgetId: string) {
  const response = await get<WorthDate[]>(`/budgets/${budgetId}/netWorth/month?includePrevious=true`);
  response.data.pop();
  return response.data;
}

async function getAnnualNetWorth(budgetId: string) {
  const response = await get<WorthDate[]>(`/budgets/${budgetId}/netWorth/year?includePrevious=true`);
  response.data.pop();
  return response.data;
}

export default function useYnab() {
  return { getBudgets, getAccounts, getAnnualNetWorth, getMonthlyNetWorth, getDailyNetWorth };
}
