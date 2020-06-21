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
    [CREATE](state, data) { // data: { error: error, err }
      state.error = data.error
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
