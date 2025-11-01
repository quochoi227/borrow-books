import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '@/layouts/LandingPage.vue'
import Auth from '@/pages/Auth.vue'
import Home from '@/pages/Home.vue'
import AllBooks from '@/pages/AllBooks.vue'
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
      component: LandingPage,
      children: [
        {
          path: 'home',
          name: 'home',
          component: Home
        },
        {
          path: 'books/:id',
          name: 'book-details',
          component: () => import('@/pages/BookDetails.vue'),
        },
        {
          path: '/books',
          name: 'books',
          component: AllBooks
        }
      ]
    },
    // {
    //   path: '/',
    //   component: () => import('@/layouts/MainLayout.vue'),
    //   children: [
    //     {
    //       path: '/books',
    //       name: 'books',
    //       component: AllBooks
    //     }
    //   ]
    // },
    {
      path: '/borrowing-history',
      name: 'borrowing-history',
      component: () => import('@/pages/BorrowingHistory.vue'),
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
      component: () => import('@/pages/NotFound.vue')
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
