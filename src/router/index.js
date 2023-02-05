import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Main',
    component: () => import(/* webpackChunkName: "main" */ '@/views/Main'),
  },
  {
    path: '/workflow',
    name: 'Workflow',
    component: () =>
      import(/* webpackChunkName: "workflow" */ '@/views/Workflow'),
  },
  {
    path: '/system',
    name: 'System',
    component: () => import(/* webpackChunkName: "system" */ '@/views/System'),
  },
  {
    path: '/odbc',
    name: 'ODBC',
    component: () => import(/* webpackChunkName: "odbc" */ '@/views/ODBC'),
  },
  {
    path: '/sql',
    name: 'SQL',
    component: () => import(/* webpackChunkName: "sql" */ '@/views/SQL'),
  },
  {
    path: '/speedtest',
    name: 'SpeedTest',
    component: () =>
      import(/* webpackChunkName: "speedtest" */ '@/views/SpeedTest'),
  },
  {
    path: '*',
    redirect: '/',
  },
];

const router = new VueRouter({
  mode: process.env.IS_ELECTRON ? 'hash' : 'history',
  routes,
});

export default router;
