import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './registerServiceWorker';
import './assets/styles/index.css';

import useBase from '@/composables/base';
import useYnab from '@/composables/ynab';
import useSession from '@/composables/session';
import useSettings from '@/composables/settings';
import useBackend from './composables/backend';
const { hydrate } = useBase();
const { reset: resetYnab } = useYnab();
const { reset: resetSession } = useSession();
const { reset: resetSettings } = useSettings();
const { reset: resetBackend } = useBackend();

hydrate();
resetYnab();
resetSession();
resetSettings();
resetBackend();

createApp(App)
  .use(router)
  .mount('#app');
