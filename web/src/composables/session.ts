import { computed, reactive, readonly } from 'vue';
import SessionManager from '@/api/SessionManager';
import useComposition from './base';
import { isBefore } from '@/services/helper';
const namespace = 'session';

const { persist, getModule } = useComposition();

const sessionManager = new SessionManager();

interface State {
  token: string | null;
  expiration: number | null;
}

const defaultState: State = {
  token: null,
  expiration: null,
};

const state = reactive(defaultState);

function set() {
  persist(namespace, state);
}

const getToken = computed(() => state.token);
const getExpiration = computed(() => state.expiration);

function setToken(token: string | null) {
  state.token = token;
  set();
}

function setExpiration(expiration: number | null) {
  state.expiration = expiration;
  set();
}

function quickVerify() {
  const { token, expiration } = state;
  if (token === null || expiration === null) return false;

  const validExpiration = isBefore(new Date(), new Date(expiration));
  if (!validExpiration) return false;

  return true;
}

async function verify() {
  // token and expiration exist
  const { token, expiration } = state;
  if (token === null || expiration === null) return false;

  // local expiration is valid
  const validExpiration = isBefore(new Date(), new Date(expiration));
  if (!validExpiration) return false;

  // check session against server
  const validToken = await sessionManager.verifySession(token);

  return validToken;
}

function clearState() {
  setToken(null);
  setExpiration(null);
}

function reset() {
  const x = getModule<State>(namespace);
  if (x?.token !== undefined) state.token = x.token;
  if (x?.expiration !== undefined) state.expiration = x.expiration;
}

export default function useSession() {
  return {
    state: readonly(state),
    getToken,
    getExpiration,
    verify,
    quickVerify,
    clearState,
    setToken,
    setExpiration,
    reset,
  };
}
