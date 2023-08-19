import { reactive } from 'vue';
import useBackend from './backend';
import useSettings from './settings';

export interface State {
  keylog: string[];
}

const defaultState: State = {
  keylog: [],
};

const state = reactive(defaultState);

const { setBrynab, setDummy, setDebug } = useSettings();
const { clearNetWorthData, clearState: clearBackend } = useBackend();

function helloTyped() {
  console.log('hello');
}

function resetTyped() {
  console.log('reset typed');
}

function clearTyped() {
  console.log('clearing net worth data');
  clearNetWorthData();
}

function debugTyped() {
  console.log('debug');
  setDebug();
}

function brynabTyped() {
  setBrynab();
}

function dummyTyped() {
  setDummy();
}

function updateKeylog(key: string) {
  if (state.keylog.length > 20) state.keylog.shift();
  state.keylog.push(key.toLowerCase());

  const joined = state.keylog.join('');

  if (joined.slice(-5) === 'reset') {
    resetTyped();
  } else if (joined.slice(-5) === 'hello') {
    helloTyped();
  } else if (joined.slice(-6) === 'brynab') {
    brynabTyped();
  } else if (joined.slice(-5) === 'dummy') {
    dummyTyped();
  } else if (joined.slice(-5) === 'clear') {
    clearTyped();
  } else if (joined.slice(-5) === 'debug') {
    debugTyped();
  }
}

export default function useShortcuts() {
  window.addEventListener('keypress', e => updateKeylog(e.key));
}
