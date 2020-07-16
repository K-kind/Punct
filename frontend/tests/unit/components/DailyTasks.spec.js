import {
  // ADD_NEW_TASK,
  // UPDATE_TASK_CONTENT,
  UPDATE_TASK_ORDER,
  START_TASK,
} from '@/store/mutation-types'
import { cloneDeep } from 'lodash'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import DailyTasks from '@/components/tasks/DailyTasks.vue'
import dayjs from '@/plugins/dayjs.js'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.prototype.$dayjs = dayjs

const tasks = [
  {
    id: 1,
    content: 'タスク1',
    expected_time: 30 * 60 * 1000,
    elapsed_time: 0,
    order: 0,
    started_time: 1594077139298,
    stopped_time: 1594078221735,
    date: '2020-07-12',
    on_progress: false,
    is_current: false,
    is_completed: false
  },
  {
    id: 2,
    content: 'タスク2',
    expected_time: 45 * 60 * 1000,
    elapsed_time: 0,
    order: 1,
    started_time: 1594077139298,
    stopped_time: 1594078221735,
    date: '2020-07-12',
    on_progress: false,
    is_current: false,
    is_completed: false
  },
]

describe('DailyTasks.vue', () => {
  let store
  let dailyStoreMock
  let wrapper

  beforeEach(() => {
    dailyStoreMock = {
      namespaced: true,
      state: {
        tasks: cloneDeep(tasks)
      },
      actions : {
        [UPDATE_TASK_ORDER]: jest.fn(),
        [START_TASK]: jest.fn(),
      },
      getters : {
        dailyTasks: state => {
          return () => {
            return state.tasks
          }
        },
        currentTask: () => {
          return null
        }
      },
    }
    store = new Vuex.Store({
      modules: {
        daily: dailyStoreMock
      }
    })
    wrapper = shallowMount(DailyTasks, {
      propsData: {
        date: new Date,
        forToday: false
      },
      store, localVue
    })
  })

  it('has tasks', () => {
    const firstTask = wrapper.findAll('.task-board__task').at(0)
    const secondTask = wrapper.findAll('.task-board__task').at(1)

    expect(firstTask.text()).toMatch(tasks[0].content)
    expect(firstTask.text()).toMatch('30分')
    expect(secondTask.text()).toMatch(tasks[1].content)
    expect(secondTask.text()).toMatch('45分')
  })

  it('shows date and total time', () => {
    const today = dayjs().format('M/D(ddd)')
    const header = wrapper.find('.task-board__header')

    expect(header.text()).toMatch(today)
    expect(header.text()).toMatch('1時間15分')
  })

  it('does not have taskUpdateForm initialy', async () => {
    const firstTask = wrapper.findAll('.task-board__task').at(0)

    expect(wrapper.findAllComponents({ name: 'TaskForm' }).length)
      .toBe(1) // newFormのみ

    firstTask.trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.findAllComponents({ name: 'TaskForm' }).length)
      .toBe(2)
  })

  it('task-update icons appear when forToday prop is given', async () => {
    const taskClass = '.task-board__task'
    const iconClass = '.task-board__with-icon--left'

    expect(wrapper.find(taskClass).classes()).not.toContain('todayTask')
    expect(wrapper.find(iconClass).exists()).toBe(false)

    wrapper.setProps({ forToday: true })
    await wrapper.vm.$nextTick()

    expect(wrapper.find(taskClass).classes()).toContain('todayTask')
    expect(wrapper.findAll(iconClass).length).toBe(2)
  })

  it('task-upload icons appear when forToday prop is given', async () => {
    const taskClass = '.task-board__task'
    const iconClass = '.task-board__with-icon--left'

    expect(wrapper.find(taskClass).classes()).not.toContain('todayTask')
    expect(wrapper.find(iconClass).exists()).toBe(false)

    wrapper.setProps({ forToday: true })
    await wrapper.vm.$nextTick()

    expect(wrapper.find(taskClass).classes()).toContain('todayTask')
    expect(wrapper.findAll(iconClass).length).toBe(2)

    expect(wrapper.find(iconClass).find('a.disabled').exists()).toBe(false)
  })

  it('task-upload icons dispatch UPDATE_TASK_ORDER and START_TASK', async () => {
    wrapper.setProps({ forToday: true })
    await wrapper.vm.$nextTick()
    const firstIcon = wrapper.find('.task-board__with-icon--left a')
    await firstIcon.trigger('click')

    expect(dailyStoreMock.actions[START_TASK]).toBeCalledWith(
      expect.any(Object),
      { taskId: tasks[0].id }
    )

    expect(dailyStoreMock.actions[UPDATE_TASK_ORDER]).toBeCalledWith(
      expect.any(Object),
      {
        fromDate: tasks[0].date,
        oldIndex: tasks[0].order,
        newIndex: 0,
        fromCompleted: false,
        toCompleted: false,
        taskId: tasks[0].id,
        isCurrent: true
      }
    )
  })
})
