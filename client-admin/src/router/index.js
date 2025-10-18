import { createWebHistory, createRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import BookManagement from '@/pages/BookManagement.vue'
import Requests from '@/pages/Requests.vue'
import Dashboard from '@/pages/Dashboard.vue'
import Sources from '@/pages/Publishers.vue'
import NotFound from '@/pages/NotFound.vue'
import Auth from '@/pages/Auth.vue'
import { useAdminStore } from '@/stores/adminStore'
import { PROTECTED_ROUTES } from '@/utils/constants'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/quan-ly-sach'
    },
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: Dashboard
        },
        {
          path: 'quan-ly-sach',
          name: 'quan-ly-sach',
          component: BookManagement
        },
        {
          path: 'quan-ly-muon-sach',
          name: 'quan-ly-muon-sach',
          component: Requests
        },
        {
          path: 'nha-xuat-ban',
          name: 'nha-xuat-ban',
          component: Sources
        }
      ]
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
  ]
})

router.beforeEach((to, from, next) => {
  if (PROTECTED_ROUTES.includes(to.name)) {
    const adminStore = useAdminStore()
    if (!adminStore.currentActiveAdmin) {
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
