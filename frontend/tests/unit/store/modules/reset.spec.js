import resetStore from '@/store/modules/reset.js'
import {
  CREATE,
  SET_NAME,
  CHECK_TOKEN,
  UPDATE,
  GET,
  POST,
  PATCH,
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

describe('CHECK_TOKEN action', () => {
  it('calls GET, creates flash and redirects with invalid token', async () => {
    const dispatch = dispatchWithRes({
      data: { error: 'invalid token' }
    })
    const resetParams = { email: 'email', token: 'token' }
    await resetStore.actions[CHECK_TOKEN]({ dispatch }, resetParams)

    expect(dispatch).toHaveBeenCalledWith(
      `http/${GET}`,
      { url: 'password_reset/check', params: resetParams },
      { root: true }
    )
    expect(dispatch).toHaveBeenCalledWith(
      `message/${CREATE}`,
      { flash: 'invalid token' },
      { root: true }
    )
    expect(router.push).toHaveBeenCalledWith('/login')
  })

  it('calls GET but does not redirect with valid token', async () => {
    const dispatch = dispatchWithRes({
      data: ''
    })
    const resetParams = { email: 'email', token: 'token' }
    await resetStore.actions[CHECK_TOKEN]({ dispatch }, resetParams)

    expect(dispatch).toHaveBeenCalledWith(
      `http/${GET}`,
      { url: 'password_reset/check', params: resetParams },
      { root: true }
    )
    expect(dispatch).not.toHaveBeenCalledWith(
      `message/${CREATE}`,
      { flash: 'invalid token' },
      { root: true }
    )
    expect(router.push).not.toHaveBeenCalled()
  })
})

describe('CREATE action', () => {
  it('calls POST and creates flash successfully', async () => {
    const dispatch = dispatchWithRes({
      data: { message: 'email was sent' }
    })
    const resetEmail = { email: 'email' }
    await resetStore.actions[CREATE]({ dispatch }, resetEmail)

    expect(dispatch).toHaveBeenCalledWith(
      `http/${POST}`,
      { url: 'password_reset', data: resetEmail },
      { root: true }
    )
    expect(dispatch).toHaveBeenCalledWith(
      `message/${CREATE}`,
      { flash: 'email was sent' },
      { root: true }
    )
  })

  it('calls POST and creates errors with invalid email', async () => {
    const dispatch = dispatchWithRes({
      data: { errors: ['email not found'] }
    })
    const resetEmail = { email: 'email' }
    await resetStore.actions[CREATE]({ dispatch }, resetEmail)

    expect(dispatch).toHaveBeenCalledWith(
      `http/${POST}`,
      { url: 'password_reset', data: resetEmail },
      { root: true }
    )
    expect(dispatch).toHaveBeenCalledWith(
      `message/${CREATE}`,
      { errors: ['email not found'] },
      { root: true }
    )
  })
})

describe('UPDATE action', () => {
  it('calls PATCH, commits SET_NAME, creates flash and redirectes successfully', async () => {
    const dispatch = dispatchWithRes({
      data: { message: 'password updated', name: 'tester' }
    })
    const resetData = { user: { password: 'pass' }, email: 'email', token: 'token' }
    await resetStore.actions[UPDATE]({ commit, dispatch }, resetData)

    expect(dispatch).toHaveBeenCalledWith(
      `http/${PATCH}`,
      { url: 'password_reset', data: resetData },
      { root: true }
    )
    expect(commit).toHaveBeenCalledWith(
      `auth/${SET_NAME}`, 'tester', { root: true }
    )
    expect(dispatch).toHaveBeenCalledWith(
      `message/${CREATE}`,
      { flash: 'password updated' },
      { root: true }
    )
    expect(router.push).toHaveBeenCalledWith('/')
  })

  it('calls PATCH and creates errors with invalid new password', async () => {
    const dispatch = dispatchWithRes({
      data: { errors: ['invalid password'] }
    })
    const resetData = { user: { password: 'pass' }, email: 'email', token: 'token' }
    await resetStore.actions[UPDATE]({ commit, dispatch }, resetData)

    expect(dispatch).toHaveBeenCalledWith(
      `http/${PATCH}`,
      { url: 'password_reset', data: resetData },
      { root: true }
    )
    expect(commit).not.toHaveBeenCalled()
    expect(dispatch).toHaveBeenCalledWith(
      `message/${CREATE}`,
      { errors: ['invalid password'] },
      { root: true }
    )
    expect(router.push).not.toHaveBeenCalled()
  })

  it('calls PATCH, creates flash and redirects with invalid token', async () => {
    const dispatch = dispatchWithRes({
      data: { error: 'invalid token' }
    })
    const resetData = { user: { password: 'pass' }, email: 'email', token: 'token' }
    await resetStore.actions[UPDATE]({ commit, dispatch }, resetData)

    expect(dispatch).toHaveBeenCalledWith(
      `http/${PATCH}`,
      { url: 'password_reset', data: resetData },
      { root: true }
    )
    expect(commit).not.toHaveBeenCalled()
    expect(dispatch).toHaveBeenCalledWith(
      `message/${CREATE}`,
      { flash: 'invalid token' },
      { root: true }
    )
    expect(router.push).toHaveBeenCalledWith('/login')
  })
})
