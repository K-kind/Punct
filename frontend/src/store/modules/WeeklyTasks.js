import {
  ADD_NEW_TASK,
  UPDATE_TASK_CONTENT,
  DELETE_TASK_BY_ID,
  UPDATE_TASK_ORDER,
  COMPLETE_TASK
} from '../mutation-types'

export default {
  namespaced: true,
  state: {
    tasks: [
      // id: Number,
      // startDate: Date,
      // content: String,
      // order: Number,
      // isChecked: Boolean
    ],
  },
  getters: {
    weeklyTasks(state) {
      return date => {
        return state.tasks.filter(task =>
          task.startDate === date.toISOString()
        ).sort((a, b) => {
          if (a.order < b.order) return -1;
          if (a.order > b.order) return 1;
          return 0;
        });
      }
    },
  },
  mutations: {
    [ADD_NEW_TASK](state, payload) {
      state.tasks.push(payload)
    },
    [UPDATE_TASK_CONTENT](state, payload) { // { content, id }
      let updatedTask = state.tasks.find(task => task.id === payload.id)
      updatedTask.content = payload.content
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
    [COMPLETE_TASK](state, { taskId, taskIsChecked }) {
      state.tasks = state.tasks.map(task => {
        if (task.id === taskId) {
          task.taskIsChecked = taskIsChecked
        }
        return task
      })
    }
  },
  actions: {
    [ADD_NEW_TASK]({ commit }, payload) {
      commit(ADD_NEW_TASK, payload)
    },
    [UPDATE_TASK_CONTENT]({ commit }, payload) {
      commit(UPDATE_TASK_CONTENT, payload)
    },
    [DELETE_TASK_BY_ID]({ commit }, payload) {
      commit(DELETE_TASK_BY_ID, payload)
    },
    [UPDATE_TASK_ORDER]({ commit }, payload) {
      commit(UPDATE_TASK_ORDER, payload)
    },
    [COMPLETE_TASK]({ commit }, payload) {
      commit(COMPLETE_TASK, payload)
    },
  }
}
