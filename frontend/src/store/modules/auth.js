import router from '@/router/index.js'

import {
  CREATE,
  DESTROY,
  SET_NAME,
  OAUTH,
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
      ).then(res => { // res.data = { message, name } or { errors }
        let name = res.data.name
        if (name) {
          commit(SET_NAME, name)
          dispatch(
            `message/${CREATE}`,
            { flash: res.data.message },
            { root: true }
          )
          router.push('/')
        } else {
          dispatch(
            `message/${CREATE}`,
            { errors: res.data.errors },
            { root: true }
          )
        }
      }).catch(err => err)
    },
    [OAUTH]({ dispatch }) {
      dispatch(
        `http/${GET}`,
        { url: 'auth/google_oauth2' },
        { root: true }
      )
    },
    [DESTROY]({ commit, dispatch }) {
      dispatch(
        `http/${DELETE}`,
        { url: 'auth' },
        { root: true }
      ).then(res => {
        commit(DESTROY)
        dispatch(
          `message/${CREATE}`,
          { flash: res.data.message },
          { root: true }
        )
        router.push('/login')
      }).catch(err => err)
    },
    [SET_NAME]({ commit, dispatch }) {
      return dispatch(
        `http/${GET}`,
        { url: 'auth/name' },
        { root: true }
      ).then(res => {
        let userName = res.data.name
        if (userName) { commit(SET_NAME, userName) }
      }).catch(err => err)
    },
  }
}
