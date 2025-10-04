import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import Auth from '@/pages/Auth.vue'
import Home from '@/pages/Home.vue'
import BorrowingHistory from '@/pages/BorrowingHistory.vue'
import BookDetails from '@/pages/BookDetails.vue'
import NotFound from '@/pages/NotFound.vue'
import ProtectedRoute from '@/pages/ProtectedRoute.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/',
      component: ProtectedRoute,
      children: [
        {
          path: '',
          component: MainLayout,
          children: [
            {
              path: 'home',
              component: Home
            }
          ]
        },
        {
          path: 'books/:id',
          component: BookDetails
        },
        {
          path: 'borrowing-history',
          component: BorrowingHistory
        }
      ]
    },
    {
      path: '/register',
      component: Auth
    },
    {
      path: '/login',
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

export default router
