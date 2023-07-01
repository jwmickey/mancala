import { createRouter, createWebHistory } from 'vue-router'
import GameView from '../views/GameView.vue'
import AboutView from '../views/AboutView.vue';
import AppPreferences from '../views/AppPreferences.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Play',
      component: GameView
    },
    {
      path: '/about',
      name: 'About',
      component: AboutView
    },
    {
      path: '/preferences',
      name: 'Preferences',
      component: AppPreferences
    }
  ]
})

export default router
