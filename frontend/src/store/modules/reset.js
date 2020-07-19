import router from '@/router/index.js'

import {
  CREATE,
  SET_NAME,
  CHECK_TOKEN,
  UPDATE,
  GET,
  POST,
  PATCH,
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
            { flash: message, duration: 4000 },
            { root: true }
          )
          router.push('/login')
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
            { flash: message, duration: 4000 },
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
    [UPDATE]({ commit, dispatch }, data) { // data = { user, email, token }
      dispatch(
        `http/${PATCH}`,
        { url: 'password_reset', data },
        { root: true }
      ).then(res => { // res.data = { message, name } or { errors } or { error }
        if (res.data.name) {
          commit(`auth/${SET_NAME}`, res.data.name, { root: true })
          dispatch(
            `message/${CREATE}`,
            { flash: res.data.message, duration: 4000 },
            { root: true }
          )
          router.push('/')
        } else if (res.data.errors) {
          dispatch(
            `message/${CREATE}`,
            { errors: res.data.errors },
            { root: true }
          )
        } else if (res.data.error) {
          dispatch(
            `message/${CREATE}`,
            { flash: res.data.error, duration: 4000 },
            { root: true }
          )
          router.push('/login')
        }
      }).catch(err => err)
    },
  }
}
