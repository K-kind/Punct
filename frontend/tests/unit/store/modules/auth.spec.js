import auth from '@/store/modules/auth.js'
import {
  CREATE,
  DESTROY,
  SET_NAME,
  GET,
  POST,
  DELETE,
} from '@/store/mutation-types'

import router from '@/router/index.js'
jest.mock('@/router/index.js')

const dispatchWithRes = res => {
  return jest.fn(() => {
    return new Promise(resolve => {
      resolve(res)
    })
  })
}
const commit = jest.fn()

afterEach(() => {
  router.push.mockClear()
  commit.mockClear()
})

describe('SET_NAME mutation', () => {
  it('updates the userName state', () => {
    const userName = { name: 'tester', is_test: false }
    const state = { userName: {} }

    auth.mutations[SET_NAME](state, userName)

    expect(state).toEqual({ userName: userName })
  })
})

describe('DESTROY mutation', () => {
  it('destroys userName state', async () => {
    const state = { userName: 'tester' }

    auth.mutations[DESTROY](state)

    expect(state).toEqual({ userName: '' })
  })
})

describe('CREATE action', () => {
  it('calls POST, commits SET_NAME, creates flash and redirects successfully', async () => {
    const dispatch = dispatchWithRes({
      data: { message: 'login', name: 'tester' }
    })
    const authData = { email: 'email' }
    await auth.actions[CREATE]({ commit, dispatch }, authData)

    expect(dispatch).toHaveBeenCalledWith(
      `http/${POST}`,
      { url: 'auth', data: authData },
      { root: true }
    )
    expect(commit).toHaveBeenCalledWith(
      SET_NAME, 'tester'
    )
    expect(dispatch).toHaveBeenCalledWith(
      `message/${CREATE}`,
      { flash: 'login' },
      { root: true }
    )
    expect(router.push).toHaveBeenCalledWith('/')
  })

  it('calls POST and creates errors when data is invalid', async () => {
    const dispatch = dispatchWithRes({
      data: { errors: ['invalid'] }
    })
    const authData = { email: 'invalid email' }
    await auth.actions[CREATE]({ commit, dispatch }, authData)

    expect(dispatch).toHaveBeenCalledWith(
      `http/${POST}`,
      { url: 'auth', data: authData },
      { root: true }
    )
    expect(commit).not.toHaveBeenCalledWith(SET_NAME, 'tester')
    expect(dispatch).toHaveBeenCalledWith(
      `message/${CREATE}`,
      { errors: ['invalid'] },
      { root: true }
    )
    expect(router.push).not.toHaveBeenCalledWith('/')
  })
})

describe('DESTROY action', () => {
  it('calls DELETE, commits DESTROY, creates flash and redirects successfully', async () => {
    const dispatch = dispatchWithRes({
      data: { message: 'logout' }
    })
    await auth.actions[DESTROY]({ commit, dispatch })

    expect(dispatch).toHaveBeenCalledWith(
      `http/${DELETE}`,
      { url: 'auth' },
      { root: true }
    )
    expect(commit).toHaveBeenCalledWith(DESTROY)
    expect(dispatch).toHaveBeenCalledWith(
      `message/${CREATE}`,
      { flash: 'logout' },
      { root: true }
    )
    expect(router.push).toHaveBeenCalledWith('/login')
  })
})

describe('SET_NAME action', () => {
  it('calls GET and commits SET_NAME', async () => {
    const dispatch = dispatchWithRes({
      data: { name: 'tester' }
    })
    await auth.actions[SET_NAME]({ commit, dispatch })

    expect(dispatch).toHaveBeenCalledWith(
      `http/${GET}`,
      { url: 'auth/name' },
      { root: true }
    )
    expect(commit).toHaveBeenCalledWith(SET_NAME, 'tester')
  })
})
