import {
  SET_TASKS,
  SET_UPDATED_TASK,
  ADD_NEW_TASK,
  UPDATE_TASK_CONTENT,
  DELETE_TASK_BY_ID,
  UPDATE_TASK_ORDER,
  START_TASK,
  STOP_TASK,
  POST,
  PATCH,
  DELETE
} from '../mutation-types'
import dayjs from '@/plugins/dayjs.js'

export default {
  namespaced: true,
  state: {
    tasks: []
  },
  getters: {
    dailyTasks(state) {
      return date => {
        const dateString = dayjs(date).format('YYYY-MM-DD')
        return state.tasks.filter(task =>
          task.date === dateString &&
          !task.is_current &&
          !task.is_completed
        ).sort((a, b) => {
          if (a.order < b.order) return -1;
          if (a.order > b.order) return 1;
          return 0;
        });
      }
    },
    completedTasks(state) {
      return date => {
        const dateString = dayjs(date).format('YYYY-MM-DD')
        return state.tasks.filter(task =>
          task.date === dateString &&
          task.is_completed
        ).sort((a, b) => {
          if (a.order < b.order) return -1;
          if (a.order > b.order) return 1;
          return 0;
        });
      }
    },
    remainingTasks(state) {
      const today = dayjs((new Date).toLocaleDateString())
      return state.tasks.filter(task =>
        !task.is_completed &&
        !task.is_current &&
        today.isAfter(task.date)
      )
    },
    currentTask(state) {
      return state.tasks.find(task => task.is_current)
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
      updatedTask.content = task.content
      updatedTask.expected_time = task.expected_time
      if ('elapsed_time' in task) {
        updatedTask.elapsed_time = task.elapsed_time
      }
    },
    [SET_UPDATED_TASK](state, { task }) {
      let currentTask = state.tasks.find(t => t.id === task.id)
      currentTask.elapsed_time = task.elapsed_time
      currentTask.started_time = task.started_time
      currentTask.stopped_time = task.stopped_time
      currentTask.on_progress = task.on_progress
    },
  },
  actions: {
    [ADD_NEW_TASK]({ commit, dispatch }, payload) {
      dispatch(
        `http/${POST}`,
        { url: 'tasks', data: { task: payload } },
        { root: true }
      ).then(res => {
        let task = res.data.task
        if (task) {
          commit(ADD_NEW_TASK, task)
        } else {
          window.alert(res.data.error)
        }
      }).catch(err => err)
    },
    [UPDATE_TASK_CONTENT]({ commit, dispatch }, { id, task }) {
      // payload = { id, task: { content, expected_time, elapsed_time } }
      dispatch(
        `http/${PATCH}`,
        { url: `tasks/${id}`, data: { task } },
        { root: true }
      ).then(res => {
        let error = res.data.error
        if (error) {
          window.alert(error)
        } else {
          commit(UPDATE_TASK_CONTENT, { id, task })
        }
      }).catch(err => err)
    },
    [DELETE_TASK_BY_ID]({ commit, dispatch, rootState }, tadkId) {
      let fromToday = rootState.weekly.fromToday
      return dispatch(
        `http/${DELETE}`,
        { url: `tasks/${tadkId}`, data: { fromToday } },
        { root: true }
      ).then(res => {
        commit(SET_TASKS, res.data.tasks)
      })
      .catch(err => err)
    },
    [UPDATE_TASK_ORDER]({ commit, dispatch, rootState }, payload) {
      if (
        payload.fromDate === payload.toDate &&
        payload.oldIndex === payload.newIndex &&
        payload.fromCompleted === payload.toCompleted &&
        payload.fromDate
      ) { return false }

      let fromToday = rootState.weekly.fromToday
      Object.assign(payload, { fromToday })
      return dispatch(
        `http/${POST}`,
        { url: 'tasks/order', data: payload },
        { root: true }
      ).then(res => {
        commit(SET_TASKS, res.data.tasks)
      }).catch(err => err)
    },
    [START_TASK]({ commit, dispatch }, { taskId }) {
      return dispatch(
        `http/${PATCH}`,
        { url: `tasks/${taskId}/start` },
        { root: true }
      ).then(res => {
        commit(SET_UPDATED_TASK, { task: res.data.task })
      }).catch(err => err)
    },
    [STOP_TASK]({ commit, dispatch }, { taskId }) {
      return dispatch(
        `http/${PATCH}`,
        { url: `tasks/${taskId}/stop` },
        { root: true }
      ).then(res => {
        commit(SET_UPDATED_TASK, { task: res.data.task })
      }).catch(err => err)
    },
  },
}
