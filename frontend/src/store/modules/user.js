import router from '@/router/index.js'

import {
  CREATE,
  // DESTROY,
  SET_NAME,
  // GET,
  POST,
  // DELETE,
} from '../mutation-types'

export default {
  namespaced: true,
  state: {
    user: []
  },
  mutations: {
    // [DESTROY](state) {
    //   state.userName = ''
    // }
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
    // [DESTROY]({ commit, dispatch }) {
    //   dispatch(
    //     `http/${DELETE}`,
    //     { url: 'auth' },
    //     { root: true }
    //   ).then(res => {
    //     commit(DESTROY)
    //     dispatch(
    //       `message/${CREATE}`,
    //       { flash: res.data.message },
    //       { root: true }
    //     )
    //     router.push('/login')
    //   })
    //    .catch(err => err)
    // },
  }
}
