import {
  CREATE,
  DESTROY,
  POST,
  DELETE
} from '../mutation-types'

export default {
  namespaced: true,
  state: {
    tenant: '',
    userId: '',
    token: ''
  },
  mutations: {
    [CREATE](state, data) {
      state.tenant = ''
      state.token = data.token
      state.userId = data.user_id
    },
    [DESTROY](state) {
      state.tenant = ''
      state.userId = ''
      state.token = ''
    }
  },
  actions: {
    [CREATE]({ commit, dispatch }, data) {
      dispatch(
        'http/' + POST,
        { url: '/auth', data, error: 'メールアドレスまたはパスワードが正しくありません。' },
        // { url: '/auth', data, error: 'message.unauthorized' },
        { root: true }
      ).then(res => commit(CREATE, res.data))
       .catch(err => err)
    },
    [DESTROY]({ commit, dispatch }, data) {
      dispatch(
        'http/' + DELETE,
        { url: '/auth', data },
        { root: true }
      ).then(res => commit(CREATE, res.data))
       .catch(err => err)
        // logout anyway ...
      //  .finally(res => commit(DESTROY))
    }
  }
}
