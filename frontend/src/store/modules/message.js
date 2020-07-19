import {
  CREATE,
  DESTROY
} from '../mutation-types'

export default {
  namespaced: true,
  state: {
    flash: '',
    duration: 2500,
    errors: [],
  },
  mutations: {
    [CREATE](state, { flash, duration, errors }) {
      state.flash = flash || state.flash
      state.duration = duration || state.duration
      state.errors = errors || state.errors
    },
    [DESTROY](state) {
      state.flash = ''
      state.duration = 2500
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
