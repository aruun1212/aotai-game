import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'season-select',
      component: () => import('@/views/SeasonSelectView.vue'),
    },
    {
      path: '/loadout',
      name: 'loadout',
      component: () => import('@/views/LoadoutView.vue'),
    },
    {
      path: '/game',
      name: 'game',
      component: () => import('@/views/GameView.vue'),
    },
    {
      path: '/ending',
      name: 'ending',
      component: () => import('@/views/EndingView.vue'),
    },
  ],
})

export default router
