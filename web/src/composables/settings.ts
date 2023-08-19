import { computed, reactive, readonly } from 'vue';
import useComposition from './base';
import useBackend from './backend';
import { BackendType } from './types';
const namespace = 'settings';

const { persist, getModule } = useComposition();
const { setActiveBackend, setActiveBackendToPrevious } = useBackend();

interface State {
  brynab: boolean;
  dummy: boolean;
  debug: boolean;
}

const defaultState: State = {
  brynab: false,
  dummy: false,
  debug: false,
};

const state = reactive(defaultState);

function set() {
  persist(namespace, state);
}

const getBrynab = computed(() => state.brynab);

function setBrynab(payload?: boolean) {
  state.brynab = payload ?? !state.brynab;
  set();
}

const isDummy = computed(() => state.dummy);

function setDummy(payload?: boolean) {
  const newState = payload ?? !state.dummy;
  state.dummy = newState;
  if (newState === true) setActiveBackend(BackendType.dummy);
  else setActiveBackendToPrevious();
  set();
}

const isDebug = computed(() => state.debug);

function setDebug(payload?: boolean) {
  const newState = payload ?? !state.debug;
  state.debug = newState;
  set();
}

function reset() {
  const x = getModule<State>(namespace);
  if (x?.brynab !== undefined) state.brynab = x?.brynab;
  if (x?.dummy !== undefined) state.dummy = x?.dummy;
  if (x?.debug !== undefined) state.debug = x?.debug;
}

export default function useSettings() {
  return { state: readonly(state), setBrynab, getBrynab, reset, isDummy, setDummy, isDebug, setDebug };
}
