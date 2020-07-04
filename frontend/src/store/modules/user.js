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
    [CREATE]({ commit, dispatch }, data) {
      dispatch(
        `http/${POST}`,
        { url: 'user', data },
        { root: true }
      ).then(res => { // res.data = { message: '', name: '' }
        let name = res.data.name
        if (name) {
          commit(`auth/${SET_NAME}`, name, { route: true })
          router.push('/')
          dispatch(
            `message/${CREATE}`,
            { flash: res.data.message },
            { root: true }
          )
        } else {
          dispatch(
            `message/${CREATE}`,
            { error: res.data.message },
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
