import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import useInfo from "@/pinia/index"


const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/loginView.vue')
    }
  ]
})
router.beforeEach((to, from) => {
  const info = useInfo()
  if (to.path !== '/login') {
    if (info.token == undefined) {
      ElMessage({
        message: 'token过期,请重新登录',
        type: 'warning',
      })
      return {
        name: "login"
      }
    }
  }
})
export default router
