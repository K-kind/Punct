import _ from 'lodash'
import dailyStore from '@/store/modules/DailyTasks.js'
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
} from '@/store/mutation-types'

const tasks = [
  {
    id: 1,
    content: 'タスク1',
    date: '2020-07-14',
    order: 3,
    is_current: false,
    is_completed: false
  },
  {
    id: 2,
    content: 'タスク2',
    date: '2020-07-14',
    order: 2,
    is_current: false,
    is_completed: false
  },
  {
    id: 3,
    content: 'タスク3',
    date: '2020-07-14',
    order: 1,
    is_current: false,
    is_completed: false
  },
  {
    id: 4,
    content: 'タスク4',
    date: '2020-07-14',
    order: 3,
    is_current: false,
    is_completed: true
  },
  {
    id: 5,
    content: 'タスク5',
    date: '2020-07-14',
    order: 2,
    is_current: false,
    is_completed: true
  },
  {
    id: 6,
    content: 'タスク6',
    date: '2020-07-14',
    order: 1,
    is_current: false,
    is_completed: true
  },
  {
    id: 7,
    content: 'タスク7',
    date: '2020-07-13',
    order: 3,
    is_current: false,
    is_completed: false
  },
  {
    id: 8,
    content: 'タスク8',
    date: '2020-07-13',
    order: 2,
    is_current: false,
    is_completed: false
  },
  {
    id: 9,
    content: 'タスク9',
    date: '2020-07-13',
    order: 1,
    is_current: false,
    is_completed: false
  },
  {
    id: 10,
    content: 'タスク10',
    date: '2020-07-14',
    order: 0,
    is_current: true,
    is_completed: false
  },
]
const state = { tasks: [] }
const duplicateTasks = () => {
  state.tasks = tasks.map(task => _.cloneDeep(task))
}
const rootState = { weekly: { fromToday: 0 } }

const dispatchWithRes = res => {
  return jest.fn(() => {
    return new Promise(resolve => {
      resolve(res)
    })
  })
}
const commit = jest.fn()
beforeEach(() => {
  duplicateTasks()
})
afterEach(() => {
  commit.mockClear()
})

describe('dailyTasks getter', () => {
  it('returns sorted tasks of a date', () => {
    const date = new Date('2020-07-14')
    const actual = dailyStore.getters.dailyTasks(state)(date)

    expect(actual).toEqual([ tasks[2], tasks[1], tasks[0] ])
  })
})

describe('completedTasks getter', () => {
  it('returns sorted completed tasks of a date', () => {
    const date = new Date('2020-07-14')
    const actual = dailyStore.getters.completedTasks(state)(date)

    expect(actual).toEqual([ tasks[5], tasks[4], tasks[3] ])
  })
})

describe('remainingTasks getter', () => {
  it('returns remaining tasks', () => {
    const actual = dailyStore.getters.remainingTasks(state)

    expect(actual).toEqual([ tasks[6], tasks[7], tasks[8] ])
  })
})

describe('currentTask getter', () => {
  it('returns a currentTask', () => {
    const actual = dailyStore.getters.currentTask(state)

    expect(actual).toEqual(tasks[9])
  })
})

describe('SET_TASKS mutation', () => {
  it('sets updated tasks', () => {
    const updatedTasks = tasks.slice(0, 3)

    dailyStore.mutations[SET_TASKS](state, updatedTasks)

    expect(state).toEqual({ tasks: updatedTasks })
  })
})

describe('ADD_NEW_TASK mutation', () => {
  it('adds new task', () => {
    const newTask = {
      id: 11,
      content: 'タスク11',
      date: '2020-07-14',
      order: 3,
      is_current: false,
      is_completed: false
    }

    dailyStore.mutations[ADD_NEW_TASK](state, newTask)

    expect(state).toEqual({ tasks: tasks.concat([newTask]) })
  })
})

describe('UPDATE_TASK_CONTENT mutation', () => {
  it('adds new task', () => {
    const updatedContents = {
      content: '変更済みタスク',
      expected_time: '6000',
      elapsed_time: '7000',
    }
    const updatedTask = {
      id: 1,
      content: '変更済みタスク',
      date: '2020-07-14',
      order: 3,
      is_current: false,
      is_completed: false,
      expected_time: '6000',
      elapsed_time: '7000',
    }

    dailyStore.mutations[UPDATE_TASK_CONTENT](
      state, { id: updatedTask.id, task: updatedContents }
    )

    expect(state.tasks[0]).toEqual(updatedTask)
  })
})

describe('SET_UPDATED_TASK mutation', () => {
  it('updates times of a task', () => {
    const updatedTimes = {
      id: 10,
      elapsed_time: '7000',
      started_time: '70000000',
      stopped_time: '70050000',
      on_progress: true
    }
    const updatedTask = {
      id: 10,
      content: 'タスク10',
      date: '2020-07-14',
      order: 0,
      is_current: true,
      is_completed: false,
      elapsed_time: '7000',
      started_time: '70000000',
      stopped_time: '70050000',
      on_progress: true
    }

    dailyStore.mutations[SET_UPDATED_TASK](state, { task: updatedTimes })

    expect(state.tasks[9]).toEqual(updatedTask)
  })
})

describe('ADD_NEW_TASK action', () => {
  it('calls POST and commits ADD_NEW_TASK successfully', async () => {
    const dispatch = dispatchWithRes({
      data: { task: { content: 'new task' } }
    })
    const taskData = {}
    await dailyStore.actions[ADD_NEW_TASK]({ commit, dispatch }, taskData)

    expect(dispatch).toHaveBeenCalledWith(
      `http/${POST}`,
      { url: 'tasks', data: { task: taskData } },
      { root: true }
    )
    expect(commit).toHaveBeenCalledWith(ADD_NEW_TASK, { content: 'new task' })
  })

  it('calls POST and alerts error with invalid data', async () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    const dispatch = dispatchWithRes({
      data: { error: 'invalid' }
    })
    const taskData = {}
    await dailyStore.actions[ADD_NEW_TASK]({ commit, dispatch }, taskData)

    expect(dispatch).toHaveBeenCalledWith(
      `http/${POST}`,
      { url: 'tasks', data: { task: taskData } },
      { root: true }
    )
    expect(window.alert).toHaveBeenCalledWith('invalid')
    expect(commit).not.toHaveBeenCalled()
  })
})

describe('DELETE_TASK_BY_ID action', () => {
  it('calls DELETE and commits SET_TASKS successfully', async () => {
    const dispatch = dispatchWithRes({
      data: { tasks: [{ content: 'updated task' }] }
    })
    const taskId = 1
    await dailyStore.actions[DELETE_TASK_BY_ID](
      { commit, dispatch, rootState }, taskId
    )

    expect(dispatch).toHaveBeenCalledWith(
      `http/${DELETE}`,
      { url: `tasks/${taskId}`,
        data: { fromToday: rootState.weekly.fromToday } },
      { root: true }
    )
    expect(commit).toHaveBeenCalledWith(
      SET_TASKS, [{ content: 'updated task' }]
    )
  })
})

describe('UPDATE_TASK_ORDER action', () => {
  it('calls POST and commits SET_TASKS', async () => {
    const dispatch = dispatchWithRes({
      data: { tasks: [{ content: 'updated task' }] }
    })
    const dragData = {
      fromDate: '2020-07-14',
      toDate: '2020-07-15',
      oldIndex: 1,
      newIndex: 1,
      fromCompleted: true,
      toCompleted: true,
    }
    const fromToday = rootState.weekly.fromToday

    await dailyStore.actions[UPDATE_TASK_ORDER](
      { commit, dispatch, rootState }, dragData
    )

    expect(dispatch).toHaveBeenCalledWith(
      `http/${POST}`,
      { url: 'tasks/order',
        data: Object.assign(dragData, { fromToday }) },
      { root: true }
    )
    expect(commit).toHaveBeenCalledWith(
      SET_TASKS, [{ content: 'updated task' }]
    )
  })

  it('does not call POST when tasks are not sorted', async () => {
    const dispatch = dispatchWithRes({
      data: { tasks: [{ content: 'updated task' }] }
    })
    const dragData = {
      fromDate: '2020-07-14',
      toDate: '2020-07-14',
      oldIndex: 1,
      newIndex: 1,
      fromCompleted: true,
      toCompleted: true,
    }

    await dailyStore.actions[UPDATE_TASK_ORDER](
      { commit, dispatch, rootState }, dragData
    )

    expect(dispatch).not.toHaveBeenCalled()
    expect(commit).not.toHaveBeenCalled()
  })
})

describe('START_TASK action', () => {
  it('calls PATCH and commits SET_UPDATED_TASK', async () => {
    const dispatch = dispatchWithRes({
      data: { task: { content: 'updated task' } }
    })
    const taskId = 10

    await dailyStore.actions[START_TASK](
      { commit, dispatch }, { taskId }
    )

    expect(dispatch).toHaveBeenCalledWith(
      `http/${PATCH}`,
      { url: `tasks/${taskId}/start` },
      { root: true }
    )
    expect(commit).toHaveBeenCalledWith(
      SET_UPDATED_TASK, { task: { content: 'updated task' } }
    )
  })
})

describe('STOP_TASK action', () => {
  it('calls PATCH and commits SET_UPDATED_TASK', async () => {
    const dispatch = dispatchWithRes({
      data: { task: { content: 'updated task' } }
    })
    const taskId = 10

    await dailyStore.actions[STOP_TASK](
      { commit, dispatch }, { taskId }
    )

    expect(dispatch).toHaveBeenCalledWith(
      `http/${PATCH}`,
      { url: `tasks/${taskId}/stop` },
      { root: true }
    )
    expect(commit).toHaveBeenCalledWith(
      SET_UPDATED_TASK, { task: { content: 'updated task' } }
    )
  })
})
