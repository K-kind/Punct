import {
  CREATE,
  DESTROY
} from '../mutation-types'

export default {
  namespaced: true,
  state: {
    error: '',
  },
  mutations: {
    [CREATE](state, data) {
      state.error = data || '通信エラーが発生しました。'
    },
    [DESTROY](state) {
      state.error = ''
    }
  },
  actions: {
    [CREATE]({ commit }, payload) {
      commit(CREATE, payload)
    },
    [DESTROY]({ commit }) {
      commit(DESTROY)
    },
  }
}
