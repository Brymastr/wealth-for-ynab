import { ActionTree } from 'vuex';
import { RootState } from '@/store/types';
import { UserState } from './types';
import router from '../../../router';

const actions: ActionTree<UserState, RootState> = {
  ynabLogin({ commit }, event: MouseEvent) {
    event.preventDefault();
    const uri = `/api/login`;
    commit('setLoginStatus', 'pending');
    location.replace(uri);
  },
  login({ commit }, sessionId: string) {
    commit('setSessionId', sessionId);
    commit('setLoginStatus', 'loggedIn');
    router.push({ name: 'Main' });
  },
  logout({ commit, dispatch }) {
    commit('clear');
    dispatch('ynab/clear', null, { root: true });
    router.push({ name: 'Login' });
  },
};

export default actions;
