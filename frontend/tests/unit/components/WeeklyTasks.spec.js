import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import WeeklyTasks from '@/components/tasks/WeeklyTasks.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

// const weekRange()
describe('WeeklyTasks.vue', () => {
  let store
  let weeklyStoreMock
  let wrapper

  beforeEach(() => {
    weeklyStoreMock = {
      namespaced: true,
      state: {
        tasks: [
          {
            id: 1,
            content: 'タスク今週1',
            start_date: '2020-07-13',
            order: 0,
            is_checked: false,
          },
          {
            id: 2,
            content: 'タスク今週2',
            start_date: '2020-07-13',
            order: 1,
            is_checked: false,
          },
          {
            id: 3,
            content: 'タスク来週1',
            start_date: '2020-07-13',
            order: 0,
            is_checked: false,
          },
          {
            id: 4,
            content: 'タスク来週2',
            start_date: '2020-07-13',
            order: 2,
            is_checked: false,
          },
        ]
      },
      actions : {
        increment: jest.fn(),
      },
      getters : {
        weeklyTasks: (state) => {
          return date => {
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
    wrapper = shallowMount(WeeklyTasks, {
      stubs: {
        elCheckbox: true
      },
      store, localVue
    })
  })

  it('renders the correct markup', () => {
      console.log(wrapper.html())
  //   expect(wrapper.html()).toContain('<span class="count">0</span>')
  })

  // it('has a count label', () => {
  //   expect(wrapper.contains('.count')).toBe(true)
  // })

  // it('button click should increment call', () => {
  //   expect(countStoreMock.actions.increment).not.toBeCalled()
  //   const button = wrapper.find('button')
  //   button.trigger('click')
  //   expect(countStoreMock.actions.increment).toBeCalled()
  // })

})
