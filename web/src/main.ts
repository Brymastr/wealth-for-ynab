import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './registerServiceWorker';
import './assets/styles/index.css';
import locales from './locales';

import useBase from '@/composables/base';
import useSession from '@/composables/session';
import useSettings from '@/composables/settings';
import useBackend from './composables/backend';
const { hydrate } = useBase();
const { reset: resetSession } = useSession();
const { reset: resetSettings } = useSettings();
const { reset: resetBackend } = useBackend();
locales();

hydrate();
resetSession();
resetSettings();
resetBackend();

createApp(App).use(router).mount('#app');
