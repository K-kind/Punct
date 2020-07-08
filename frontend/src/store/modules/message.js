import {
  CREATE,
  DESTROY
} from '../mutation-types'

export default {
  namespaced: true,
  state: {
    flash: '',
    errors: [],
  },
  mutations: {
    [CREATE](state, data) {
      if (data.flash) {
        state.flash = data.flash
      } else {
        state.errors = data.errors
      }
    },
    [DESTROY](state) {
      state.flash = ''
      state.errors = []
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
