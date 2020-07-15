import { beforeEach } from '@/router/index.js'
import { SET_NAME } from '@/store/mutation-types'
import Store from '@/store/index.js'
jest.mock('@/store/index.js')

const next = jest.fn()
jest.spyOn(Store, 'dispatch').mockImplementation(() => {
  return new Promise(resolve => {
    resolve()
  })
})

afterEach(() => {
  next.mockClear()
  Store.dispatch.mockClear()
})

describe('beforeEach', () => {
  it('dispatches SET_NAME when visited directly', async () => {
    const from = { name: null }

    await beforeEach(undefined, from, next)

    expect(Store.dispatch).toHaveBeenCalledWith(`auth/${SET_NAME}`)
    expect(next).toHaveBeenCalled()
  })

  it('does not dispatch SET_NAME when visited via router', async () => {
    const from = { name: 'Login' }

    await beforeEach(undefined, from, next)

    expect(Store.dispatch).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
  })
})
