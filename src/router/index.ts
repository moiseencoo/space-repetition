import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/learning',
      name: 'learning',
      component: () => import('../views/LearningView.vue')
    },
    {
      path: '/recall',
      name: 'recall',
      component: () => import('../views/RecallView.vue')
    },
    {
      path: '/learning-intence',
      name: 'LearningIntence',
      component: () => import('../views/LearningIntence.vue')
    },
  ]
})

export default router
