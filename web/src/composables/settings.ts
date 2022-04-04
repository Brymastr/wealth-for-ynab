import { computed, reactive, readonly } from 'vue';
import useComposition from './base';
import useBackend, { BackendType } from './backend';
const namespace = 'settings';

const { persist, getModule } = useComposition();
const { setActiveBackend, setActiveBackendToPrevious } = useBackend();

interface State {
  brynab: boolean;
  dummy: boolean;
}

const defaultState: State = {
  brynab: false,
  dummy: false,
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

function reset() {
  const x = getModule<State>(namespace);
  if (x?.brynab !== undefined) state.brynab = x?.brynab;
  if (x?.dummy !== undefined) state.dummy = x?.dummy;
}

export default function useSettings() {
  return { state: readonly(state), setBrynab, getBrynab, reset, isDummy, setDummy };
}
