import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
// import Store from '@/store/index.js'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/archives',
    name: 'Archives',
    component: () => import('../views/Archives.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: {
      isPublic: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  // if (to.matched.some(page => page.meta.isPublic) || Store.state.auth.token) {
  // if (to.meta.isPublic || Store.state.auth.token) {
  //   next()
  // } else {
  //   next('/login')
  // }
  next()
})

export default router
