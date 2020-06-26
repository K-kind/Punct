import {
  SET_TASKS,
  ADD_NEW_TASK,
  UPDATE_TASK_CONTENT,
  DELETE_TASK_BY_ID,
  UPDATE_TASK_ORDER,
  MOVE_TASK_TO_ANOTHER,
  MOVE_TASK_TO_COMPLETED,
  SET_CURRENT_TASK,
  UNSET_CURRENT_TASK,
  START_TASK,
  STOP_TASK,
  COMPLETE_TASK,
  GET,
  POST
} from '../mutation-types'

export default {
  namespaced: true,
  state: {
    tasks: [],
    currentTaskId: null
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
      return state.tasks.find(task => task.id === state.currentTaskId)
    },
  },
  mutations: {
    [SET_TASKS](state, tasks) {
      state.tasks = tasks
    },
    [ADD_NEW_TASK](state, payload) {
      state.tasks.push(payload)
    },
    [UPDATE_TASK_CONTENT](state, payload) {
      let updatedTask = state.tasks.find(task => task.id === payload.id)
      updatedTask.content = payload.content
      updatedTask.expected_time = payload.expected_time
      if ('elapsed_time' in payload) {
        updatedTask.elapsed_time = payload.elapsed_time
      }
    },
    // 全部taskをfilterすると時間がかかるので要改善
    [DELETE_TASK_BY_ID](state, taskId) {
      let deletedTask = state.tasks.find(task => task.id === taskId)
      state.tasks = state.tasks.filter(task => task.id !== taskId)

      if (deletedTask.is_current) {
        state.currentTaskId = null
        return false
      }

      state.tasks = state.tasks.map(task => {
        if (
          task.date === deletedTask.date &&
          task.month === deletedTask.month &&
          task.year === deletedTask.year &&
          task.order > deletedTask.order &&
          task.is_completed === deletedTask.is_completed
        ) { task.order-- }

        return task
      })
    },
    [UPDATE_TASK_ORDER](state, {
      oldIndex, newIndex, fromDate, fromMonth, fromYear, fromCompleted
    }) {
      state.tasks = state.tasks.map(task => {
        if (
          task.date != fromDate ||
          task.month != fromMonth ||
          task.year != fromYear ||
          task.is_completed !== fromCompleted
        ) { return task }

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
    [MOVE_TASK_TO_ANOTHER](state, payload) {
      let oldIndex = payload.oldIndex
      let newIndex = payload.newIndex
      let toCompleted = payload.toCompleted || false

      state.tasks = state.tasks.map(task => {
        if (task.id === payload.taskId) {
          task.order = newIndex
          task.date= Number.parseInt(payload.toDate)
          task.month = Number.parseInt(payload.toMonth)
          task.year = Number.parseInt(payload.toYear)
          if (payload.fromCompleted) { task.is_completed = toCompleted }
        } else if ( // 移動元
          task.date == payload.fromDate &&
          task.month == payload.fromMonth &&
          task.year == payload.fromYear &&
          task.order > oldIndex &&
          task.is_completed === payload.fromCompleted
        ) {
          task.order--
        } else if ( // 移動先
          task.date == payload.toDate &&
          task.month == payload.toMonth &&
          task.year == payload.toYear &&
          task.order >= newIndex &&
          task.is_completed === toCompleted
          ) {
          task.order++
        }
        return task
      })
    },
    [MOVE_TASK_TO_COMPLETED](state, {
      fromYear, fromMonth, fromDate, oldIndex
    }) {
      state.tasks = state.tasks.map(task => {
        if ( // 移動元のみ
          task.date == fromDate &&
          task.month == fromMonth &&
          task.year == fromYear &&
          task.order > oldIndex &&
          !task.is_completed
        ) { task.order-- }
        return task
      })
    },
    [SET_CURRENT_TASK](state, {
      fromYear, fromMonth, fromDate, oldIndex, fromCompleted, taskId
    } = {}) {
      state.currentTaskId = taskId
      state.tasks = state.tasks.map(task => {
        if (
          task.date == fromDate &&
          task.month == fromMonth &&
          task.year == fromYear &&
          task.order > oldIndex &&
          task.is_completed === fromCompleted
        ) {
          task.order--
        } else if (task.id === taskId) {
          task.is_current = true
          task.is_completed = false
          task.year = null
          task.month = null
          task.date = null
        }
        return task
      })
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
    [START_TASK](state) {
      let currentTask = state.tasks.find(task => task.id === state.currentTaskId)
      if (currentTask.on_progress) return false;

      if (currentTask.started_time) {
        currentTask.stopped_time = Date.now()
      } else {
        currentTask.started_time = Date.now()
      }
      currentTask.on_progress = true
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
    [COMPLETE_TASK](state, { taskId, newIndex } = {}) {
      let completedTask = state.tasks.find(task => task.id === taskId)
      let now = new Date

      completedTask.year = now.getFullYear()
      completedTask.month = now.getMonth()
      completedTask.date = now.getDate()
      completedTask.is_completed = true

      if (newIndex >= 0) {
        state.tasks = state.tasks.map(task => {
          if (
            task.date === completedTask.date && // または今日
            task.month === completedTask.month &&
            task.year === completedTask.year &&
            task.order >= newIndex &&
            task.is_completed
          ) { task.order++ }

          if (task.id === taskId) { task.order = newIndex }
          return task
        })
      } else {
        let orders = []
        for (let task of state.tasks) {
          if (
            task.date === completedTask.date &&
            task.month === completedTask.month &&
            task.year === completedTask.year &&
            task.id !== taskId &&
            task.is_completed
          ) { orders.push(task.order) }
        }
        let newOrder = 0
        if (orders.length) { newOrder = Math.max.apply(null, orders) + 1 }
        completedTask.order = newOrder

        state.tasks = state.tasks.concat([]) // リアクティブ対策
        // Vue.set(state.tasks, key, value)
      }
      // Vue.set(completedTask, 'is_completed', true)
    }
  },
  actions: {
    [SET_TASKS]({ commit, dispatch }) {
      dispatch(
        `http/${GET}`,
        { url: 'tasks' },
        { root: true }
      ).then(res => {
        commit(SET_TASKS, res.data.tasks)
      })
       .catch(err => err)
    },
    [ADD_NEW_TASK]({ commit, dispatch }, payload) {
      dispatch(
        `http/${POST}`,
        { url: 'tasks', data: { task: payload } },
        { root: true }
      ).then(res => {
        if (res.data.task) {
          commit(ADD_NEW_TASK, payload)
        } else {
          window.alert(res.data.message)
        }
      })
      .catch(err => err)
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
    [MOVE_TASK_TO_ANOTHER]({ commit }, payload) {
      commit(MOVE_TASK_TO_ANOTHER, payload)
    },
    [MOVE_TASK_TO_COMPLETED]({ commit }, payload) {
      commit(MOVE_TASK_TO_COMPLETED, payload)
    },
    [SET_CURRENT_TASK]({ commit }, payload) {
      commit(SET_CURRENT_TASK, payload)
    },
    [UNSET_CURRENT_TASK]({ commit }, payload) {
      commit(UNSET_CURRENT_TASK, payload)
    },
    [START_TASK]({ commit }, payload) {
      commit(START_TASK, payload)
    },
    [STOP_TASK]({ commit }, payload) {
      commit(STOP_TASK, payload)
    },
    [COMPLETE_TASK]({ commit }, payload) {
      commit(COMPLETE_TASK, payload)
    },
  },
  modules: {
  },
}
