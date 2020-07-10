import router from '@/router/index.js'

import {
  CREATE,
  DESTROY,
  SET_NAME,
  CHECK_TOKEN,
  // RESET,
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
          ).then(() => {
            router.push('/')
          })
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
        ).then(() => {
          router.push('/login')
        })
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
    [CHECK_TOKEN]({ dispatch }, params) { // params = { email, token }
      return dispatch(
        `http/${GET}`,
        { url: 'password_reset/check', params },
        { root: true }
      ).then(res => { // res.data = { error }
        let message = res.data.error
        if (message) {
          dispatch(
            `message/${CREATE}`,
            { flash: message },
            { root: true }
          ).then(() => {
            router.push('/login')
          })
        }
      }).catch(err => err)
    },
    // [RESET]({ commit, dispatch }, data) { // data = { user, email, token }
    //   dispatch(
    //     `http/${PATCH}`,
    //     { url: 'authpassword_reset' },
    //     { root: true }
    //   ).then(res => { // res.data = { message, name } or { errors }
    //     let name = res.data.name
    //     if (name) {
    //       commit(SET_NAME, name)
    //       dispatch(
    //         `message/${CREATE}`,
    //         { flash: res.data.message },
    //         { root: true }
    //       )
    //       router.push('/')
    //     } else {
    //       dispatch(
    //         `message/${CREATE}`,
    //         { errors: res.data.errors },
    //         { root: true }
    //       )
    //     }
    //   }).catch(err => err)
    // },
  }
}
