import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import Auth from '@/pages/Auth.vue'
import Home from '@/pages/Home.vue'
import BorrowingHistory from '@/pages/BorrowingHistory.vue'
import BookDetails from '@/pages/BookDetails.vue'
import NotFound from '@/pages/NotFound.vue'
import { PROTECTED_ROUTES } from '@/utils/constants'
import { useUserStore } from '@/stores/userStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: 'home',
          name: 'home',
          component: Home
        },
        {
          path: 'books/:id',
          component: BookDetails
        }
      ]
    },
    {
      path: '/borrowing-history',
      name: 'borrowing-history',
      component: BorrowingHistory
    },
    {
      path: '/register',
      name: 'register',
      component: Auth
    },
    {
      path: '/login',
      name: 'login',
      component: Auth
    },
    // Not found
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound
    }
  ],
})

router.beforeEach((to, from, next) => {
  if (PROTECTED_ROUTES.includes(to.name)) {
    const userStore = useUserStore()
    if (!userStore.currentActiveUser) {
      next({
        name: 'login'
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
