import { MutationTree, Mutation } from 'vuex';
import { YnabState, AccountsPayload, Budget, LoadingStatus } from './types';

const createOrUpdateBudget: Mutation<YnabState> = function(state, budget: Budget) {
  const index = state.budgets.findIndex(b => b.id === budget.id);

  if (index !== -1) state.budgets.splice(index, 1);

  state.budgets.push(budget);
};

const createOrUpdateAccounts: Mutation<YnabState> = function(state, payload: AccountsPayload) {
  const budget = state.budgets.find(budget => budget.id === payload.budgetId);

  if (budget === undefined) return null;

  const budgetAccounts = budget.accounts;
  if (budgetAccounts === null || budgetAccounts === undefined) return null;

  budgetAccounts.length = 0;
  payload.accounts.forEach(account => budgetAccounts.push(account));
};

const mutations: MutationTree<YnabState> = {
  createOrUpdateBudget,
  createOrUpdateAccounts,
  setSelectedBudget(state, budgetId: string) {
    state.selectedBudgetId = budgetId;
  },
  setLoadingBudgets(state, status: LoadingStatus) {
    state.loadingBudgetsStatus = status;
  },
  setLoadingAccounts(state, status) {
    state.loadingAccountsStatus = status;
  },
  setLoadingNetWorth(state, status) {
    state.loadingNetWorthStatus = status;
  },
  clear(state) {
    state.budgets.length = 0;
    state.selectedBudgetId = null;
    state.loadingAccountsStatus = 'ready';
    state.loadingBudgetsStatus = 'ready';
    state.loadingNetWorthStatus = 'ready';
  },
};

export default mutations;
