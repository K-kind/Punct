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
let redirectedPath = ''
jest.mock('@/router/index.js')
// router.push.mockImplementation(() => {})
// jest.mock('@/router/index.js', () => {
//   return {
//     push: (_path) => {
//       redirectedPath = _path
//     }
//   }
// })
// jest.mock('@/router/index.js', () => {
//   return {
//     push: jest.fn()
//   }
// })
// import router from '@/router/index.js'
// jest.mock('@/router/index.js', () => {
//   return {
//     router: jest.fn().mockImplementation(() => {
//       return {
//         push: jest.fn()
//       }
//     }),
//   };
// })
// let options = {}
// let mockError = false

// jest.mock('axios', () => {
//   return (_options) => {
//     return new Promise(resolve => {
//       if (mockError) throw Error();

//       options = _options
//       resolve(true)
//     })
//   }
// })

describe('SET_NAME mutation', () => {
  it('updates the userName state', () => {
    const userName = 'tester'
    const state = { userName: '' }

    auth.mutations[SET_NAME](state, userName)

    expect(state).toEqual({ userName: 'tester' })
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
  const dispatchWithRes = res => {
    return jest.fn(() => {
      return new Promise(resolve => {
        resolve(res)
      })
    })
  }
  const commit = jest.fn()
  // jest.spyOn(router, 'push').mockImplementation(() => {})
  // const pushSpy = jest.spyOn(router, 'push').mockImplementation(() => {})
  // jest.spyOn(router, 'push')

  it('commits SET_NAME, creates flash and redirects', async () => {
    const dispatch = dispatchWithRes({
      data: { message: 'success', name: 'tester' }
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
      { flash: 'success' },
      { root: true }
    )
    // expect(redirectedPath).toBe('/')
    expect(router.push).toHaveBeenCalled()
    // expect(router).toHaveBeenCalled()
    // console.log(router)
  })

})
