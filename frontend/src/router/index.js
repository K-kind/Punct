import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Store from '@/store/index.js'
import { SET_NAME } from '@/store/mutation-types'

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
    component: () => import('@/views/Archives.vue')
  },
  {
    path: '/mypage',
    name: 'MyPage',
    component: () => import('@/views/MyPage.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      isPublic: true,
      forGuest: true
    }
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: () => import('@/views/SignUp.vue'),
    meta: {
      isPublic: true,
      forGuest: true
    }
  },
  {
    path: '/oauth',
    name: 'Oauth',
    component: () => import('@/views/Oauth.vue'),
    meta: {
      isPublic: true
    }
  },
  {
    path: '/reset',
    name: 'Reset',
    component: () => import('@/views/Reset.vue'),
    meta: {
      isPublic: true,
      forGuest: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (!from.name) {
    Store.dispatch(`auth/${SET_NAME}`).then(() => {
      next()
    })
  } else {
    next()
  }
})

router.beforeResolve((to, from, next) => {
  let userName = Store.state.auth.userName
  if (to.meta.forGuest && userName) {
    next('/') // ログイン済み
  } else if (to.meta.isPublic || userName) {
    next()
  } else {
    next('/login')
  }
})

export default router
