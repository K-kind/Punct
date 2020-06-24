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
    // [DESTROY](state) {
      // state.tenant = ''
      // state.userId = ''
      // state.token = ''
      // state.isLoggedIn = false
    // }
  },
  actions: {
    [CREATE]({ dispatch }, data) {
      dispatch(
        `http/${POST}`,
        { url: 'auth', data },
        { root: true }
      ).then( () => { router.push('/') })
       .catch(err => err) // コンソールログでもいいかも
    },
    [DESTROY]({ commit, dispatch }, data) {
      dispatch(
        `http/${DELETE}`,
        { url: 'auth', data },
        { root: true }
      ).then(res => commit(CREATE, res.data))
       .catch(err => err)
        // logout anyway ...
      //  .finally(res => commit(DESTROY))
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
