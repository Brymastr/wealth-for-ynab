import { computed, reactive, readonly } from 'vue';
import useComposition from './base';
const namespace = 'backend';

export enum BackendType {
  ynab = 'ynab',
  dummy = 'dummy',
  none = 'none',
}

interface State {
  active: BackendType;
  previous: BackendType;
}

const defaultState: State = {
  active: BackendType.none,
  previous: BackendType.none,
};

const state = reactive(defaultState);

const { persist, getModule } = useComposition();

const isYnab = computed(() => state.active === BackendType.ynab);
const isDummy = computed(() => state.active === BackendType.dummy);

function setActiveBackend(payload: BackendType) {
  state.previous = state.active;
  state.active = payload;
  set();
}

function setActiveBackendToPrevious() {
  const previous = state.previous;
  state.previous = state.active;
  state.active = previous;
  set();
}

function set() {
  persist(namespace, state);
}

function reset() {
  const x = getModule<State>(namespace);
  if (x?.active !== undefined) state.active = x.active;
  if (x?.previous !== undefined) state.previous = x.previous;
}

export default function useBackend() {
  return {
    state: readonly(state),
    activeBackend: computed(() => state.active),
    setActiveBackend,
    setActiveBackendToPrevious,
    isYnab,
    isDummy,
    reset,
  };
}
