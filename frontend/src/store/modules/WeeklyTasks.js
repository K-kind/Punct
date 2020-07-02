import {
  SET_TASKS,
  // SET_UPDATED_TASK,
  ADD_NEW_TASK,
  UPDATE_TASK_CONTENT,
  DELETE_TASK_BY_ID,
  UPDATE_TASK_ORDER,
  POST,
  PATCH,
  DELETE
} from '../mutation-types'

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
    weeklyTasks(state) {
      return date => {
        return state.tasks.filter(task =>
          (new Date(task.start_date)).toDateString() === date.toDateString()
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
    [DELETE_TASK_BY_ID](state, taskId) {
      let deletedTask = state.tasks.find(task => task.id === taskId)
      state.tasks = state.tasks.filter(task => task.id !== taskId)

      state.tasks = state.tasks.map(task => {
        if (
          task.startDate === deletedTask.startDate &&
          task.order > deletedTask.order
        ) { task.order-- }

        return task
      })
    },
    [UPDATE_TASK_ORDER](state, { oldIndex, newIndex, startDate }) {
      state.tasks = state.tasks.map(task => {
        if (task.startDate !== startDate) { return task }

        if (oldIndex < newIndex && task.order > oldIndex && task.order <= newIndex) { // 下げた時
          task.order--
        } else if (oldIndex > newIndex && task.order >= newIndex && task.order < oldIndex) { // 上げた時
          task.order++
        } else if (task.order === oldIndex) { // 移動主
          task.order = newIndex
        }
        return task
      })
    },
  },
  actions: {
    [ADD_NEW_TASK]({ commit, dispatch }, payload) {
      return dispatch(
        `http/${POST}`,
        { url: 'weekly_tasks', data: { task: payload } },
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
        { url: `weekly_tasks/${id}`, data: { task } },
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
      dispatch(
        `http/${DELETE}`,
        { url: `weekly_tasks/${taskId}` },
        { root: true }
      ).then(res => {
        commit(SET_TASKS, res.data.tasks)
      })
      .catch(err => err)
    },
    [UPDATE_TASK_ORDER]({ commit }, payload) {
      commit(UPDATE_TASK_ORDER, payload)
    },
  }
}
