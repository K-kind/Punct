import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'

export default [
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
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue'),
    meta: {
      isPublic: true,
      forGuest: true
    }
  }
]
