import router from '@/router/index.js'

import {
  CREATE,
  DESTROY,
  SET_NAME,
  GET,
  POST,
  DELETE,
} from '../mutation-types'

export default {
  namespaced: true,
  state: {
    userName: '',
  },
  mutations: {
    [SET_NAME](state, userName) {
      state.userName = userName
    },
    [DESTROY](state) {
      state.userName = ''
    }
  },
  actions: {
    [CREATE]({ commit, dispatch }, data) {
      dispatch(
        `http/${POST}`,
        { url: 'auth', data },
        { root: true }
      ).then(res => { // res.data = { message: '', name: '' }
        commit(SET_NAME, res.data.name) // message flashにする
        router.push('/')
      })
       .catch(err => err) // window.alertでもいいかも
    },
    [DESTROY]({ commit, dispatch }) {
      dispatch(
        `http/${DELETE}`,
        { url: 'auth' },
        { root: true }
      ).then(res => {
        commit(DESTROY)
        console.log(res.data.message) // flashにする
        router.push('/login')
      })
       .catch(err => err)
      //  .finally(() => commit(DESTROY))
    },
    [SET_NAME]({ commit, dispatch }) {
      dispatch(
        `http/${GET}`,
        { url: 'auth/name' },
        { root: true }
      ).then(res => {
        let userName = res.data.name
        if (userName) { commit(SET_NAME, userName) }
      })
       .catch(err => err)
    },
  }
}
