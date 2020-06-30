import {
  SET_TASKS,
  ADD_NEW_TASK,
  UPDATE_TASK_CONTENT,
  DELETE_TASK_BY_ID,
  UPDATE_TASK_ORDER,
  SET_CURRENT_TASK,
  UNSET_CURRENT_TASK,
  UPDATE_TIMER,
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
    [UPDATE_TIMER](state, { taskId, isStarting }) {
      let currentTask = state.tasks.find(task => task.id === taskId)
      if (isStarting) {
        currentTask.on_progress = true
      }
    },
    [STOP_TASK](state) {
      let currentTask = state.tasks.find(task => task.id === state.currentTaskId)
      if (!currentTask.on_progress) return false;

      currentTask.on_progress = false
      let stoppedTime = currentTask.stopped_time
      let fromTime = stoppedTime || currentTask.started_time
      currentTask.elapsed_time += (Date.now() - fromTime)
      currentTask.stopped_time = Date.now()
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

      dispatch(
        `http/${POST}`,
        { url: 'tasks/order', data: payload },
        { root: true }
      ).then(res => {
        commit(SET_TASKS, res.data.tasks)
      }).catch(err => err)
    },
    [UPDATE_TIMER]({ commit, dispatch }, { taskId, isStarting }) {
      dispatch(
        `http/${PATCH}`,
        { url: `tasks/${taskId}/timer`, data: { isStarting } },
        { root: true }
      ).then(
        commit(UPDATE_TIMER, { taskId, isStarting })
      ).catch(err => err)
    },
    [SET_CURRENT_TASK]({ commit, dispatch }, payload) {
      Object.assign(payload, { current: { isSetting: true } })
      dispatch(
        `http/${POST}`,
        { url: 'tasks/order', data: payload },
        { root: true }
      ).then(res => {
        commit(SET_TASKS, res.data.tasks)
      }).catch(err => err)
    },
    [UNSET_CURRENT_TASK]({ commit }, payload) {
      commit(UNSET_CURRENT_TASK, payload)
    },
    // [UPDATE_TIMER]({ commit, dispatch }, { taskId, isStarting }) {
    //   console.log('settimer')
    //   dispatch(
    //     `http/${PATCH}`,
    //     { utl: `tasks/${taskId}/timer`, data: { isStarting } },
    //     { root: true }
    //   ).then(
    //     commit(UPDATE_TIMER, { taskId, isStarting })
    //   ).catch(err => err)
    // },
    [STOP_TASK]({ commit }, payload) {
      commit(STOP_TASK, payload)
    },
  },
  modules: {
  },
}
