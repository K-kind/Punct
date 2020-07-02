import {
  SET_TASKS,
  SET_UPDATED_TASK,
  ADD_NEW_TASK,
  UPDATE_TASK_CONTENT,
  DELETE_TASK_BY_ID,
  UPDATE_TASK_ORDER,
  SET_CURRENT_TASK,
  UNSET_CURRENT_TASK,
  START_TASK,
  STOP_TASK,
  GET,
  POST,
  PATCH,
  DELETE
} from '../mutation-types'

export default {
  namespaced: true,
  state: {
    tasks: []
  },
  getters: {
    dailyTasks(state) {
      return date => {
        // console.log(date.toLocaleDateString().replace(/\//g, '-'))
        return state.tasks.filter(task =>
          // task.date === date.toLocaleDateString().replace(/\//g, '-') &&
          (new Date(task.date)).toDateString() === date.toDateString() &&
          !task.is_current && !task.is_completed
        ).sort((a, b) => {
          if (a.order < b.order) return -1;
          if (a.order > b.order) return 1;
          return 0;
        });
      }
    },
    completedTasks(state) {
      return date => {
        return state.tasks.filter(task =>
          (new Date(task.date)).toDateString() === date.toDateString() &&
          // task.year === date.getFullYear() &&
          // task.month === date.getMonth() &&
          // task.date === date.getDate() &&
          task.is_completed
        ).sort((a, b) => {
          if (a.order < b.order) return -1;
          if (a.order > b.order) return 1;
          return 0;
        });
      }
    },
    remainingTasks(state) {
      let today = (new Date) - (1000 * 60 * 60 * 24) // 昨日の00:00以降
      return state.tasks.filter(task => {
        if (task.is_completed || task.is_current) return false;
        let taskDate = new Date(task.date)
        if (taskDate < today) return task;
      })
    },
    currentTask(state) {
      console.log('currenttaskを更新します')
      return state.tasks.find(task => task.is_current)
    },
  },
  mutations: {
    [SET_TASKS](state, tasks) {
      state.tasks = tasks
    },
    [ADD_NEW_TASK](state, payload) {
      state.tasks.push(payload)
    },
    [UPDATE_TASK_CONTENT](state, { id, task }) {
      let updatedTask = state.tasks.find(task => task.id === id)
      updatedTask.content = task.content
      updatedTask.expected_time = task.expected_time
      if ('elapsed_time' in task) {
        updatedTask.elapsed_time = task.elapsed_time
      }
    },
    [UNSET_CURRENT_TASK](state, { toYear, toMonth, toDate, newIndex, taskId } = {}) {
      state.currentTaskId = null
      if (!toYear) { // リアクティブでない可能性あり
        state.tasks.find(task => task.id === taskId).is_current = false
        return false
      }

      state.tasks = state.tasks.map(task => {
        if (
          task.date == toDate &&
          task.month == toMonth &&
          task.year == toYear &&
          task.order >= newIndex &&
          !task.is_completed
        ) { task.order++ }

        if (task.id === taskId) {
          task.is_current = false
          task.order = newIndex
          task.date = Number.parseInt(toDate)
          task.month = Number.parseInt(toMonth)
          task.year = Number.parseInt(toYear)
        }

        return task
      })
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
    [SET_TASKS]({ commit, dispatch }) {
      dispatch(
        `http/${GET}`,
        { url: 'tasks' },
        { root: true }
      ).then(res => {
        commit(SET_TASKS, res.data.tasks)
      }).catch(err => err)
    },
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
          window.alert(res.data.message)
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
      })
      // .catch(err => err)
    },
    [DELETE_TASK_BY_ID]({ commit, dispatch }, payload) {
      dispatch(
        `http/${DELETE}`,
        { url: `tasks/${payload}` },
        { root: true }
      ).then(res => {
        commit(SET_TASKS, res.data.tasks)
      })
      .catch(err => err)
    },
    [UPDATE_TASK_ORDER]({ commit, dispatch }, payload) {
      if (
        payload.fromDate === payload.toDate &&
        payload.oldIndex === payload.newIndex &&
        payload.fromCompleted === payload.toCompleted
      ) { return false }

      return dispatch(
        `http/${POST}`,
        { url: 'tasks/order', data: payload },
        { root: true }
      ).then(res => {
        commit(SET_TASKS, res.data.tasks)
      }).catch(err => err)
    },
    [SET_CURRENT_TASK]({ commit, dispatch }, payload) {
      return dispatch(
        `http/${POST}`,
        { url: 'tasks/order', data: payload },
        { root: true }
      ).then(res => {
        commit(SET_TASKS, res.data.tasks)
      }).catch(err => err)
    },
    [UNSET_CURRENT_TASK]({ commit, dispatch }, payload) {
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
  modules: {
  },
}
