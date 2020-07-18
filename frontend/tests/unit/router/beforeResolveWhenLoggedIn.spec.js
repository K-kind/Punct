import { beforeResolve } from '@/router/index.js'

jest.mock('@/store/index.js', () => {
  return { state: { auth: { userName: 'tester' } } }
})

const next = jest.fn()
afterEach(() => {
  next.mockClear()
})

describe('beforeResolve when logged in', () => {
  it('redirects to root path when a forGuest path is visited', async () => {
    const to = { meta: { forGuest: true } }

    beforeResolve(to, undefined, next)

    expect(next).toHaveBeenCalledWith('/')
  })

  it('fowards to a path when a not forGuest path is visited', async () => {
    const to = { meta: {} }

    beforeResolve(to, undefined, next)

    expect(next).toHaveBeenCalledWith()
  })
})
