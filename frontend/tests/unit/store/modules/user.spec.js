import userStore from '@/store/modules/user.js'
import {
  CREATE,
  DESTROY,
  SET_NAME,
  CLEAR,
  UPDATE,
  GET,
  POST,
  PATCH,
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

describe('GET mutation', () => {
  it('sets the user state', () => {
    const user = { name: 'tester', email: 'email' }
    const state = { user: {} }

    userStore.mutations[GET](state, user)

    expect(state).toEqual({ user })
  })
})

describe('CLEAR mutation', () => {
  it('clears the user state', () => {
    const state = { user: { name: 'tester', email: 'email' } }

    userStore.mutations[CLEAR](state)

    expect(state).toEqual({ user: {} })
  })
})

describe('CREATE action', () => {
  it('calls POST, commits SET_NAME, creates flash and redirects successfully', async () => {
    const dispatch = dispatchWithRes({
      data: { message: 'signed up', name: 'tester' }
    })
    const userParams = { email: 'email' }
    await userStore.actions[CREATE]({ commit, dispatch }, userParams)

    expect(dispatch).toHaveBeenCalledWith(
      `http/${POST}`,
      { url: 'user', data: { user: userParams } },
      { root: true }
    )
    expect(commit).toHaveBeenCalledWith(
      `auth/${SET_NAME}`, 'tester', { root: true }
    )
    expect(dispatch).toHaveBeenCalledWith(
      `message/${CREATE}`,
      { flash: 'signed up', duration: 4000 },
      { root: true }
    )
    expect(router.push).toHaveBeenCalledWith('/')
  })

  it('calls POST and creates errors when data is invalid', async () => {
    const dispatch = dispatchWithRes({
      data: { errors: ['invalid'] }
    })
    const userParams = { email: 'invalid email' }
    await userStore.actions[CREATE]({ commit, dispatch }, userParams)

    expect(dispatch).toHaveBeenCalledWith(
      `http/${POST}`,
      { url: 'user', data: { user: userParams } },
      { root: true }
    )
    expect(commit).not.toHaveBeenCalled()
    expect(dispatch).toHaveBeenCalledWith(
      `message/${CREATE}`,
      { errors: ['invalid'] },
      { root: true }
    )
    expect(router.push).not.toHaveBeenCalledWith('/')
  })
})

describe('GET action', () => {
  it('calls GET and commits GET', async () => {
    const dispatch = dispatchWithRes({
      data: { user: { name: 'tester' } }
    })
    await userStore.actions[GET]({ commit, dispatch })

    expect(dispatch).toHaveBeenCalledWith(
      `http/${GET}`,
      { url: 'user' },
      { root: true }
    )
    expect(commit).toHaveBeenCalledWith(GET, { name: 'tester' })
  })
})

describe('CLEAR action', () => {
  it('commits CLEAR', () => {
    userStore.actions[CLEAR]({ commit })

    expect(commit).toHaveBeenCalledWith(CLEAR)
  })
})

describe('UPDATE action', () => {
  it('calls PATCH, commits GET & SET_NAME and creates flash successfully', async () => {
    const dispatch = dispatchWithRes({
      data: { message: 'user updated', user: { name: 'tester' } }
    })
    const userParams = { email: 'email' }
    await userStore.actions[UPDATE]({ commit, dispatch }, userParams)

    expect(dispatch).toHaveBeenCalledWith(
      `http/${PATCH}`,
      { url: 'user', data: { user: userParams } },
      { root: true }
    )
    expect(commit).toHaveBeenCalledWith(GET, { name: 'tester' })
    expect(commit).toHaveBeenCalledWith(
      `auth/${SET_NAME}`, 'tester', { root: true }
    )
    expect(dispatch).toHaveBeenCalledWith(
      `message/${CREATE}`,
      { flash: 'user updated' },
      { root: true }
    )
  })

  it('calls POST and creates errors when data is invalid', async () => {
    const dispatch = dispatchWithRes({
      data: { errors: ['invalid'] }
    })
    const userParams = { email: 'invalid email' }
    await userStore.actions[UPDATE]({ commit, dispatch }, userParams)

    expect(dispatch).toHaveBeenCalledWith(
      `http/${PATCH}`,
      { url: 'user', data: { user: userParams } },
      { root: true }
    )
    expect(commit).not.toHaveBeenCalled()
    expect(dispatch).toHaveBeenCalledWith(
      `message/${CREATE}`,
      { errors: ['invalid'] },
      { root: true }
    )
  })
})

describe('DESTROY action', () => {
  it('calls DELETE, commits DESTROY & CLEAR, creates flash and redirects', async () => {
    const dispatch = dispatchWithRes({
      data: { message: 'Resigned' }
    })
    await userStore.actions[DESTROY]({ commit, dispatch })

    expect(dispatch).toHaveBeenCalledWith(
      `http/${DELETE}`,
      { url: 'user' },
      { root: true }
    )
    expect(commit).toHaveBeenCalledWith(
      `auth/${DESTROY}`, null, { root: true }
    )
    expect(commit).toHaveBeenCalledWith(CLEAR)
    expect(dispatch).toHaveBeenCalledWith(
      `message/${CREATE}`,
      { flash: 'Resigned', duration: 4000 },
      { root: true }
    )
    expect(router.push).toHaveBeenCalledWith('/login')
  })
})
