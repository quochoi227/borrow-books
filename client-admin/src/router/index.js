import { createWebHistory, createRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import NoSidebar from '@/layouts/NoSidebar.vue'
import BookManagement from '@/pages/BookManagement.vue'
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
          component: () => import('@/pages/Dashboard.vue')
        },
        {
          path: 'quan-ly-sach',
          name: 'quan-ly-sach',
          component: BookManagement
        },
        {
          path: 'quan-ly-muon-sach',
          name: 'quan-ly-muon-sach',
          component: () => import('@/pages/Requests.vue')
        },
        {
          path: 'nha-xuat-ban',
          name: 'nha-xuat-ban',
          component: () => import('@/pages/Publishers.vue')
        }
      ]
    },
    {
      path: '/books',
      component: NoSidebar,
      children: [
        {
          path: ':id',
          name: 'book-details',
          component: () => import('@/pages/BookDetails.vue')
        }
      ]
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/pages/Auth.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/Auth.vue')
    },
    // Not found
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/pages/NotFound.vue')
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
