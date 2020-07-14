import _ from 'lodash'
import weeklyStore from '@/store/modules/WeeklyTasks.js'
import {
  SET_TASKS,
  ADD_NEW_TASK,
  UPDATE_TASK_CONTENT,
  DELETE_TASK_BY_ID,
  UPDATE_TASK_ORDER,
  SET_START_DATE,
  GET,
  POST,
  PATCH,
  DELETE
} from '@/store/mutation-types'

const tasks = [
  {
    id: 1,
    content: 'タスク1',
    start_date: '2020-07-13',
    order: 3,
    is_checked: false,
  },
  {
    id: 2,
    content: 'タスク2',
    start_date: '2020-07-13',
    order: 2,
    is_checked: false,
  },
  {
    id: 3,
    content: 'タスク3',
    start_date: '2020-07-13',
    order: 1,
    is_checked: false,
  },
  {
    id: 4,
    content: 'タスク4',
    start_date: '2020-07-20',
    order: 1,
    is_checked: false,
  },
]
const state = { tasks: [] }
const duplicateTasks = () => {
  state.tasks = tasks.map(task => _.cloneDeep(task))
}

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

describe('weeklyTasks getter', () => {
  it('returns sorted tasks of a week', () => {
    const date = new Date('2020-07-13')
    const actual = weeklyStore.getters.weeklyTasks(state)(date)

    expect(actual).toEqual([ tasks[2], tasks[1], tasks[0] ])
  })
})

describe('SET_TASKS mutation', () => {
  it('sets updated tasks', () => {
    const updatedTasks = tasks.slice(0, 2)

    weeklyStore.mutations[SET_TASKS](state, updatedTasks)

    expect(state).toEqual({ tasks: updatedTasks })
  })
})

describe('ADD_NEW_TASK mutation', () => {
  it('adds new task', () => {
    const newTask = {
      id: 5,
      content: 'タスク5',
      date: '2020-07-20',
      order: 2,
      is_checked: false,
    }

    weeklyStore.mutations[ADD_NEW_TASK](state, newTask)

    expect(state).toEqual({ tasks: tasks.concat([newTask]) })
  })
})

describe('UPDATE_TASK_CONTENT mutation', () => {
  it('updates a task content', () => {
    const updatedContents = {
      content: '変更済みタスク',
    }
    const updatedTask = {
      id: 1,
      content: '変更済みタスク',
      start_date: '2020-07-13',
      order: 3,
      is_checked: false,
    }

    weeklyStore.mutations[UPDATE_TASK_CONTENT](
      state, { id: updatedTask.id, task: updatedContents }
    )

    expect(state.tasks[0]).toEqual(updatedTask)
  })

  it('updates a task is_checked', () => {
    const updatedChecked = {
      is_checked: true,
    }
    const updatedTask = {
      id: 1,
      content: 'タスク1',
      start_date: '2020-07-13',
      order: 3,
      is_checked: true,
    }

    weeklyStore.mutations[UPDATE_TASK_CONTENT](
      state, { id: updatedTask.id, task: updatedChecked }
    )

    expect(state.tasks[0]).toEqual(updatedTask)
  })
})

describe('UPDATE_TASK_ORDER mutation', () => {
  it('updates task orders', () => {
    const start_date = '2020-07-13'
    const sortedTasks = [
      {
        id: 1,
        content: 'タスク1',
        start_date: '2020-07-13',
        order: 0,
        is_checked: false,
      },
      {
        id: 2,
        content: 'タスク2',
        start_date: '2020-07-13',
        order: 2,
        is_checked: false,
      },
      {
        id: 3,
        content: 'タスク3',
        start_date: '2020-07-13',
        order: 1,
        is_checked: false,
      }
    ]
    const actual = [state.tasks[3]].concat(sortedTasks)

    weeklyStore.mutations[UPDATE_TASK_ORDER](
      state, { tasks: sortedTasks, start_date }
    )

    expect(state.tasks).toEqual(actual)
  })
})

describe('SET_START_DATE mutation', () => {
  it('updates start_date, fromToday and weekString', () => {
    const startDate = new Date('2020-07-13')
    const weekString = '7/13(月) - 7/19(日)'
    const updatedTimes = {
      fromToday: 7,
      startDate,
      weekString
    }

    weeklyStore.mutations[SET_START_DATE](state, updatedTimes)

    expect(state.fromToday).toBe(7)
    expect(state.startDate).toBe(startDate)
    expect(state.weekString).toBe(weekString) // clearしていない
  })
})

describe('ADD_NEW_TASK action', () => {
  it('calls POST and commits ADD_NEW_TASK successfully', async () => {
    const dispatch = dispatchWithRes({
      data: { task: { content: 'new task' } }
    })
    const taskData = {}
    await weeklyStore.actions[ADD_NEW_TASK]({ commit, dispatch }, taskData)

    expect(dispatch).toHaveBeenCalledWith(
      `http/${POST}`,
      { url: 'weekly_tasks', data: { task: taskData } },
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
    await weeklyStore.actions[ADD_NEW_TASK]({ commit, dispatch }, taskData)

    expect(dispatch).toHaveBeenCalledWith(
      `http/${POST}`,
      { url: 'weekly_tasks', data: { task: taskData } },
      { root: true }
    )
    expect(window.alert).toHaveBeenCalled()
    expect(commit).not.toHaveBeenCalled()
  })
})

describe('UPDATE_TASK_CONTENT action', () => {
  it('calls PATCH and commits UPDATE_TASK_CONTENT successfully', async () => {
    const dispatch = dispatchWithRes({ data: {} })
    const taskData = { id: 1, task: {} }
    await weeklyStore.actions[UPDATE_TASK_CONTENT](
      { commit, dispatch }, taskData
    )

    expect(dispatch).toHaveBeenCalledWith(
      `http/${PATCH}`,
      { url: `weekly_tasks/${taskData.id}`, data: { task: taskData.task } },
      { root: true }
    )
    expect(commit).toHaveBeenCalledWith(
      UPDATE_TASK_CONTENT, taskData
    )
  })

  it('calls PATCH and alerts error with invalid data', async () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    const dispatch = dispatchWithRes({
      data: { error: 'invalid' }
    })
    const taskData = { id: 1, task: {} }
    await weeklyStore.actions[UPDATE_TASK_CONTENT](
      { commit, dispatch }, taskData
    )

    expect(dispatch).toHaveBeenCalledWith(
      `http/${PATCH}`,
      { url: `weekly_tasks/${taskData.id}`, data: { task: taskData.task } },
      { root: true }
    )
    expect(window.alert).toHaveBeenCalled()
    expect(commit).not.toHaveBeenCalled()
  })
})

describe('DELETE_TASK_BY_ID action', () => {
  it('calls DELETE and commits UPDATE_TASK_ORDER', async () => {
    const dispatch = dispatchWithRes({
      data: { tasks: [], start_date: '' }
    })
    const taskId = 1
    await weeklyStore.actions[DELETE_TASK_BY_ID](
      { commit, dispatch }, taskId
    )

    expect(dispatch).toHaveBeenCalledWith(
      `http/${DELETE}`,
      { url: `weekly_tasks/${taskId}` },
      { root: true }
    )
    expect(commit).toHaveBeenCalledWith(
      UPDATE_TASK_ORDER, { tasks: [], start_date: '' }
    )
  })
})

describe('UPDATE_TASK_ORDER action', () => {
  it('calls POST and commits UPDATE_TASK_ORDER', async () => {
    const dispatch = dispatchWithRes({
      data: { tasks: [], start_date: '' }
    })
    const dragData = {}

    await weeklyStore.actions[UPDATE_TASK_ORDER](
      { commit, dispatch }, dragData
    )

    expect(dispatch).toHaveBeenCalledWith(
      `http/${POST}`,
      { url: 'weekly_tasks/order', data: dragData },
      { root: true }
    )
    expect(commit).toHaveBeenCalledWith(
      UPDATE_TASK_ORDER, { tasks: [], start_date: '' }
    )
  })
})

describe('SET_TASKS action', () => {
  it('calls GET and commits SET_TASKS', async () => {
    const dispatch = dispatchWithRes({
      data: { tasks: { daily: ['daily'], weekly: ['weekly'] } }
    })
    const fromToday = 7

    await weeklyStore.actions[SET_TASKS](
      { commit, dispatch }, fromToday
    )

    expect(dispatch).toHaveBeenCalledWith(
      `http/${GET}`,
      { url: 'weekly_tasks', params: { fromToday } },
      { root: true }
    )
    expect(commit).toHaveBeenCalledWith(
      `daily/${SET_TASKS}`, ['daily'], { root: true }
    )
    expect(commit).toHaveBeenCalledWith(SET_TASKS, ['weekly'])
  })
})

describe('SET_START_DATE action', () => {
  it('commits SET_START_DATE', async () => {
    const dispatch = dispatchWithRes({ data: {} })
    const startDate = '2020-07-14'

    await weeklyStore.actions[SET_START_DATE]({ commit }, startDate)

    expect(commit).toHaveBeenCalledWith(
      SET_START_DATE, startDate
    )
  })
})
