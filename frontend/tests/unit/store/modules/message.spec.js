import message from '@/store/modules/message.js'
import {
  CREATE,
  DESTROY,
} from '@/store/mutation-types'

const commit = jest.fn()
afterEach(() => {
  commit.mockClear()
})

describe('CREATE mutation', () => {
  it('creates a flash', () => {
    const state = { flash: '', errors: [] }
    const data = { flash: 'flash message' }

    message.mutations[CREATE](state, data)

    expect(state).toEqual({ flash: 'flash message', errors: [] })
  })

  it('creates errors', () => {
    const state = { flash: '', errors: [] }
    const data = { errors: ['error1', 'error2'] }

    message.mutations[CREATE](state, data)

    expect(state).toEqual({ flash: '', errors: ['error1', 'error2'] })
  })
})

describe('DESTROY mutation', () => {
  it('destroys a flash and errors', () => {
    const state = { flash: 'flash message', duration: 4000, errors: ['error1', 'error2'] }

    message.mutations[DESTROY](state)

    expect(state).toEqual({ flash: '', duration: 2500, errors: [] })
  })
})

describe('CREATE action', () => {
  it('commits CREATE', () => {
    const data = { flash: 'flash message' }
    message.actions[CREATE]({ commit }, data)

    expect(commit).toHaveBeenCalledWith(CREATE, data)
  })
})

describe('DESTROY action', () => {
  it('commits DESTROY', () => {
    message.actions[DESTROY]({ commit })

    expect(commit).toHaveBeenCalledWith(DESTROY)
  })
})
