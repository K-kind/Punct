import {
  // ADD_NEW_TASK,
  UPDATE_TASK_CONTENT,
  // DELETE_TASK_BY_ID,
  // UPDATE_TASK_ORDER,
  SET_TASKS,
  SET_START_DATE
} from '@/store/mutation-types'
import { Checkbox } from 'element-ui'
import { cloneDeep } from 'lodash'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import WeeklyTasks from '@/components/tasks/WeeklyTasks.vue'
import dayjs from '@/plugins/dayjs.js'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(Checkbox)
localVue.prototype.$dayjs = dayjs

const tasks = [
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
    order: 1,
    is_checked: false,
  },
]
const today = dayjs(new Date)
const getDateString = ({ fromToday, weekday }) => {
  return today.add(fromToday, 'day').weekday(weekday).format('M/D(ddd)')
}

describe('WeeklyTasks.vue', () => {
  let store
  let weeklyStoreMock
  let wrapper

  beforeEach(() => {
    weeklyStoreMock = {
      namespaced: true,
      state: {
        tasks: cloneDeep(tasks)
      },
      actions : {
        [SET_TASKS]: jest.fn(),
        [SET_START_DATE]: jest.fn(),
        [UPDATE_TASK_CONTENT]: jest.fn(),
      },
      getters : {
        weeklyTasks: (state) => {
          return () => {
            return state.tasks
          }
        },
      },
    }
    store = new Vuex.Store({
      modules: {
        weekly: weeklyStoreMock
      }
    })
    wrapper = mount(WeeklyTasks, {
      stubs: {
        draggable: true,
        LongTermForm: true
      },
      store, localVue
    })
  })

  it('has tasks', () => {
    expect(wrapper.findAll('.task-board__task').at(0).text())
      .toMatch(tasks[0].content)
    expect(wrapper.findAll('.task-board__task').at(1).text())
      .toMatch(tasks[1].content)
  })

  it('shows this week', () => {
    const monday = getDateString({ fromToday: 0, weekday: 0 })
    const sunday = getDateString({ fromToday: 0, weekday: 6 })
    const expected = wrapper.find('.task-board__heading').text()

    expect(expected).toMatch(monday)
    expect(expected).toMatch(sunday)
  })

  it('only the right caret is visible initialy', async () => {
    const leftCaret = wrapper.findAll('.task-board__caret').at(0)
    const rightCaret = wrapper.findAll('.task-board__caret').at(1)

    expect(leftCaret.classes()).toContain('disabled')
    expect(rightCaret.classes()).not.toContain('disabled')

    wrapper.setData({ daysFromToday: 7 })
    await wrapper.vm.$nextTick()

    expect(leftCaret.classes()).not.toContain('disabled')
    expect(rightCaret.classes()).not.toContain('disabled')
  })

  it('caret button click dispatches actions and changes the week string', async () => {
    const rightCaret = wrapper.findAll('.task-board__caret').at(1)
    const newFromToday = 7
    const nextMonday = getDateString({ fromToday: newFromToday, weekday: 0 })
    const nextSunday = getDateString({ fromToday: newFromToday, weekday: 6 })
    const nextString = `${nextMonday} - ${nextSunday}`

    rightCaret.trigger('click')
    await wrapper.vm.$nextTick()

    expect(weeklyStoreMock.actions[SET_TASKS]).toBeCalledWith(
      expect.any(Object), newFromToday
    )
    expect(weeklyStoreMock.actions[SET_START_DATE]).toBeCalledWith(
      expect.any(Object),
      {
        fromToday: newFromToday,
        // startDate: today.add(newFromToday, 'day').weekday(0).$d,
        startDate: expect.any(Object),
        weekString: nextString
      }
    )
    expect(wrapper.find('.task-board__heading').text()).toMatch(nextString)
  })

  it('does not have LongTermForm initialy', async () => {
    const firstTask = wrapper.findAll('.task-board__p').at(0)

    expect(wrapper.findAllComponents({ name: 'LongTermForm' }).length)
      .toBe(1) // newFormのみ

    firstTask.trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.findAllComponents({ name: 'LongTermForm' }).length)
      .toBe(2)
  })

  it('a checkbox dispatches UPDATE_TASK_CONTENT', async () => {
    let firstCheckbox = wrapper.find('.el-checkbox')

    expect(firstCheckbox.classes()).not.toContain('is-checked')

    firstCheckbox.trigger('click')
    await wrapper.vm.$nextTick()
    firstCheckbox = wrapper.find('.el-checkbox')

    expect(weeklyStoreMock.state.tasks[0].is_checked).toBe(true)
    expect(firstCheckbox.classes()).toContain('is-checked')
    expect(weeklyStoreMock.actions[UPDATE_TASK_CONTENT]).toBeCalledWith(
      expect.any(Object),
      { id: tasks[0].id, task: { is_checked: true } }
    )
  })
})
