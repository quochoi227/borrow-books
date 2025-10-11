import { createWebHistory, createRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import BookManagement from '@/pages/BookManagement.vue'
import Requests from '@/pages/Requests.vue'
import Dashboard from '@/pages/Dashboard.vue'
import Sources from '@/pages/Publishers.vue'
import NotFound from '@/pages/NotFound.vue'
import Auth from '@/pages/Auth.vue'
import ProtectedRoute from '@/pages/ProtectedRoute.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/quan-ly-sach'
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
              path: 'dashboard',
              component: Dashboard
            },
            {
              path: 'quan-ly-sach',
              component: BookManagement
            },
            {
              path: 'quan-ly-muon-sach',
              component: Requests
            },
            {
              path: 'nha-xuat-ban',
              component: Sources
            }
          ]
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
  ]
})

export default router
