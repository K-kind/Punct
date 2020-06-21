import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import DailyTasks from './modules/DailyTasks'
import WeeklyTasks from './modules/WeeklyTasks'
import MonthlyTasks from './modules/MonthlyTasks'
import auth from './modules/auth'
import http from './modules/http'
import message from './modules/message'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    daily: DailyTasks,
    weekly: WeeklyTasks,
    monthly: MonthlyTasks,
    auth,
    http,
    message
  },
  plugins: [createPersistedState({
    key: 'todo',
    storage: localStorage
  })]
})
