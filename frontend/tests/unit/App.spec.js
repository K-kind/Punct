import { shallowMount } from '@vue/test-utils'
import App from '@/App.vue'

describe('App.vue', () => {
  const wrapper = shallowMount(App, {
    mocks: {
      $store: {
        state: { auth: { userName: '山田太郎' } }
      }
    },
    stubs: {
      routerView: true,
    }
  })

  it('shows userName', () => {
    expect(wrapper.text()).toMatch('山田太郎')
  })
})
