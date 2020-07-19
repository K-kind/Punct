import router from '@/router/index.js'

import {
  CREATE,
  DESTROY,
  SET_NAME,
  CLEAR,
  UPDATE,
  GET,
  POST,
  PATCH,
  DELETE,
} from '../mutation-types'

export default {
  namespaced: true,
  state: {
    user: {}
  },
  mutations: {
    [GET](state, user) {
      state.user = user
    },
    [CLEAR](state) {
      state.user = {}
    },
  },
  actions: {
    [CREATE]({ commit, dispatch }, params) {
      return dispatch(
        `http/${POST}`,
        { url: 'user', data: { user: params } },
        { root: true }
      ).then(res => { // res.data = { message, name } or { errors }
        let name = res.data.name
        if (name) {
          commit(`auth/${SET_NAME}`, name, { root: true })
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
    [GET]({ commit, dispatch }) {
      return dispatch(
        `http/${GET}`,
        { url: 'user' },
        { root: true }
      ).then(res => { // res.data = { user }
        commit(GET, res.data.user)
      }).catch(err => err)
    },
    [CLEAR]({ commit }) {
      commit(CLEAR)
    },
    [UPDATE]({ commit, dispatch }, params) {
      return dispatch(
        `http/${PATCH}`,
        { url: 'user', data: { user: params } },
        { root: true }
      ).then(res => { // res.data = { message, user, name } or { errors }
        let user = res.data.user
        if (user) {
          commit(GET, user)
          commit(`auth/${SET_NAME}`, res.data.name, { root: true })
          dispatch(
            `message/${CREATE}`,
            { flash: res.data.message },
            { root: true }
          )
        } else {
          dispatch(
            `message/${CREATE}`,
            { errors: res.data.errors },
            { root: true }
          )
        }
      }).catch(err => err)
    },
    [DESTROY]({ commit, dispatch }) {
      return dispatch(
        `http/${DELETE}`,
        { url: 'user' },
        { root: true }
      ).then(res => {
        commit(`auth/${DESTROY}`, null, { root: true })
        commit(CLEAR)
        dispatch(
          `message/${CREATE}`,
          { flash: res.data.message },
          { root: true }
        )
        router.push('/login')
      }).catch(err => err)
    },
  }
}
