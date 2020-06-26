import {
  CREATE,
  DESTROY
} from '../mutation-types'

export default {
  namespaced: true,
  state: {
    flash: '',
    error: '',
  },
  mutations: {
    [CREATE](state, data) {
      if (data.flash) {
        state.flash = data.flash
      } else {
        state.error = data.error
      }
    },
    [DESTROY](state) {
      state.flash = ''
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
