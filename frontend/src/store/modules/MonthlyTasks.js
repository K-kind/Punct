import {
  SET_TASKS,
  ADD_NEW_TASK,
  UPDATE_TASK_CONTENT,
  DELETE_TASK_BY_ID,
  UPDATE_TASK_ORDER,
  GET,
  POST,
  PATCH,
  DELETE
} from '../mutation-types'
import dayjs from '@/plugins/dayjs.js'

export default {
  namespaced: true,
  state: {
    tasks: [
      // id: Number,
      // start_date: Date,
      // content: String,
      // order: Number,
      // is_checked: Boolean
    ],
  },
  getters: {
    monthlyTasks(state) {
      return date => {
        const dateString = dayjs(date).format('YYYY-MM-DD')
        return state.tasks.filter(task =>
          task.start_date === dateString
        ).sort((a, b) => {
          if (a.order < b.order) return -1;
          if (a.order > b.order) return 1;
          return 0;
        });
      }
    },
  },
  mutations: {
    [SET_TASKS](state, tasks) {
      state.tasks = tasks
    },
    [ADD_NEW_TASK](state, task) {
      state.tasks.push(task)
    },
    [UPDATE_TASK_CONTENT](state, { id, task }) {
      let updatedTask = state.tasks.find(task => task.id === id)
      if (task.content) {
        updatedTask.content = task.content
      } else {
        updatedTask.is_checked = task.is_checked
      }
    },
    [UPDATE_TASK_ORDER](state, { tasks, start_date }) {
      state.tasks = state.tasks.filter(task =>
        task.start_date !== start_date
      )
      state.tasks.push(...tasks)
    },
  },
  actions: {
    [ADD_NEW_TASK]({ commit, dispatch }, payload) {
      return dispatch(
        `http/${POST}`,
        { url: 'monthly_tasks', data: { task: payload } },
        { root: true }
      ).then(res => {
        let task = res.data.task
        if (task) {
          commit(ADD_NEW_TASK, task)
        } else {
          throw new Error(res.data.message)
        }
      }).catch(err => { alert(err) })
    },
    [UPDATE_TASK_CONTENT]({ commit, dispatch }, { id, task }) {
      return dispatch(
        `http/${PATCH}`,
        { url: `monthly_tasks/${id}`, data: { task } },
        { root: true }
      ).then(res => {
        let error = res.data.error
        if (error) {
          throw new Error(error)
        } else {
          commit(UPDATE_TASK_CONTENT, { id, task })
        }
      }).catch(err => { alert(err) })
    },
    [DELETE_TASK_BY_ID]({ commit, dispatch }, taskId) {
      return dispatch(
        `http/${DELETE}`,
        { url: `monthly_tasks/${taskId}` },
        { root: true }
      ).then(res => {
        commit(UPDATE_TASK_ORDER, res.data)
      })
      .catch(err => err)
    },
    [UPDATE_TASK_ORDER]({ commit, dispatch }, payload) {
      return dispatch(
        `http/${POST}`,
        { url: 'monthly_tasks/order', data: payload },
        { root: true }
      ).then(res => {
        commit(UPDATE_TASK_ORDER, res.data)
      }).catch(err => err)
    },
    [SET_TASKS]({ commit, dispatch }, fromToday) {
      dispatch(
        `http/${GET}`,
        { url: 'monthly_tasks', params: { fromToday } },
        { root: true }
      ).then(res => {
        commit(SET_TASKS, res.data.tasks)
      }).catch(err => err)
    },
  }
}
