import { beforeResolve } from '@/router/index.js'

jest.mock('@/store/index.js', () => {
  return { state: { auth: { userName: '' } } }
})

const next = jest.fn()
afterEach(() => {
  next.mockClear()
})

describe('beforeResolve as a guest', () => {
  it('doest not redirect to root path when a forGuest path is visited', async () => {
    const to = { meta: { forGuest: true } }

    beforeResolve(to, undefined, next)

    expect(next).not.toHaveBeenCalledWith('/')
  })

  it('fowards to a path when a public path is visited', async () => {
    const to = { meta: { isPublic: true } }

    beforeResolve(to, undefined, next)

    expect(next).toHaveBeenCalledWith()
  })

  it('redirects to login path when a not public path is visited', async () => {
    const to = { meta: {} }

    beforeResolve(to, undefined, next)

    expect(next).toHaveBeenCalledWith('/login')
  })
})
