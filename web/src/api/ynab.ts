import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { BudgetDetail, Account } from 'ynab';
import { WorthDate } from '@/composables/types';
import { ref } from 'vue';
import useSession from '@/composables/session';

async function get<T>(url: string): Promise<AxiosResponse<T>> {
  const { getToken } = useSession();
  const baseConfig = ref<AxiosRequestConfig>({
    baseURL: `${process.env.VUE_APP_API}/ynab`,
    headers: { 'wealth-session-token': getToken.value },
  });
  const ynab = axios.create(baseConfig.value);
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

async function getMonthlyNetWorth(budgetId: string) {
  const response = await get<WorthDate[]>(`/budgets/${budgetId}/monthlyNetWorth`);
  response.data.pop();
  return response.data;
}

async function getForecast(netWorth: WorthDate[]) {
  const response = await axios.post<WorthDate[]>(`${process.env.VUE_APP_API}/forecast`, netWorth);
  return response.data;
}

export default function useYnab() {
  return { getBudgets, getAccounts, getMonthlyNetWorth, getForecast };
}
