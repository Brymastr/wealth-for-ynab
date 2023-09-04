import './assets/styles/index.css';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
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

const app = createApp(App)
app.use(router)
app.mount('#app')
