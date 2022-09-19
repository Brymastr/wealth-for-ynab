import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Landing from '../views/Landing.vue';
import Login from '../views/Login.vue';
import Logout from '../views/Logout.vue';
import Main from '../views/Main.vue';
import useSession from '../composables/session';
import useBackend from '@/composables/backend';
import { BackendType } from '@/composables/types';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Landing',
    component: Landing,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/logout',
    name: 'Logout',
    component: Logout,
  },
  {
    path: '/app',
    component: Main,
    meta: { requiresLogin: true },
    children: [
      {
        path: '/app',
        name: 'Net Worth',
        component: () => import(/* webpackChunkName: "net-worth" */ '../views/NetWorth.vue'),
      },
      {
        path: '/app/test',
        name: 'Testing Page',
        component: () => import(/* webpackChunkName: "testing-page" */ '../views/TestingPage.vue'),
      },
      {
        path: '/app/forecast',
        name: 'Forecast',
        component: () => import(/* webpackChunkName: "forecast" */ '../views/Forecast.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const { quickVerify } = useSession();
  const { activeBackendType, setActiveBackend } = useBackend();

  const validSession = quickVerify();

  if (to.meta.requiresLogin && !validSession) {
    return next('/');
  }

  if (to.meta.requiresLogin && activeBackendType.value === BackendType.none) {
    setActiveBackend(BackendType.ynab);
  }

  // if already logged in and trying to go to /login
  if (to.name === 'Login' && validSession) {
    return next('/app');
  } else {
    return next();
  }
});

export default router;
