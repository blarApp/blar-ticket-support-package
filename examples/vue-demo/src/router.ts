import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('./views/HomePage.vue')
  },
  {
    path: '/test-modal',
    name: 'TestModal',
    component: () => import('./views/TestModal.vue')
  },
  {
    path: '/test-hook',
    name: 'TestHook',
    component: () => import('./views/TestHook.vue')
  },
  {
    path: '/test-error',
    name: 'TestError',
    component: () => import('./views/TestError.vue')
  },
  {
    path: '/test-styles',
    name: 'TestStyles',
    component: () => import('./views/TestStyles.vue')
  },
  {
    path: '/demo-dashboard',
    name: 'DemoDashboard',
    component: () => import('./views/DemoDashboard.vue')
  },
  {
    path: '/demo-dashboard/integrations',
    name: 'DemoDashboardIntegrations',
    component: () => import('./views/DemoDashboardIntegrations.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
