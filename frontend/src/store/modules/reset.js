import router from '@/router/index.js'

import {
  CREATE,
  // SET_NAME,
  CHECK_TOKEN,
  // UPDATE,
  GET,
  POST,
} from '../mutation-types'

export default {
  namespaced: true,
  actions: {
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
    [CREATE]({ dispatch }, data) {
      return dispatch(
        `http/${POST}`,
        { url: 'password_reset', data },
        { root: true }
      ).then(res => { // res.data = { message } or { errors }
        let message = res.data.message
        if (message) {
          dispatch(
            `message/${CREATE}`,
            { flash: message },
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
