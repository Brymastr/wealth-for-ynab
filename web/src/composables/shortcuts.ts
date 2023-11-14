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
  console.log('shortcut: hello');
}

function resetTyped() {
  console.log('shortcut: reset');
}

function clearTyped() {
  console.log('shortcut: clearing net worth data');
  clearNetWorthData();
  clearBackend();
}

function debugTyped() {
  console.log('shortcut: debug');
  setDebug();
}

function brynabTyped() {
  console.log('shortcut: brynab');
  setBrynab();
}

function dummyTyped() {
  console.log('shortcut: dummy');
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
