import http from '@/store/modules/http.js'
import {
  REQUEST,
  GET,
  POST,
  PATCH,
  DELETE,
} from '@/store/mutation-types'


let options = {}
let mockError = false

jest.mock('axios', () => {
  return (_options) => {
    return new Promise(resolve => {
      if (mockError) throw Error();

      options = _options
      resolve(true)
    })
  }
})

describe('REQUEST actions', () => {
  const requests = { method: 'post', url: 'tasks', data: true }
  jest.spyOn(window, 'alert').mockImplementation(() => {});

  it('calls axios and receives a success response', async () => {
    await http.actions[REQUEST](null, requests)

    expect(options.method).toBe(requests.method)
    expect(options.data).toBe(requests.data)
    expect(options.url).toBe(
      `${process.env.VUE_APP_API_URL}${requests.url}`
    )
    expect(window.alert).not.toHaveBeenCalled()
  })

  it('calls axios and throw error', async () => {
    // jest.spyOn(window, 'alert').mockImplementation(() => {});
    mockError = true
    await http.actions[REQUEST](null, requests)

    expect(window.alert).toHaveBeenCalled()
  })
})

describe('HTTP methods actions', () => {
  const dispatch = jest.fn()
  const requests = { url: '', data: '', params: '' }

  it('GET dispatches REQUEST action with options', async () => {
    await http.actions[GET]({ dispatch }, requests)

    expect(dispatch).toHaveBeenCalledWith(
      REQUEST, { url: '', data: '', params: '', method: 'get' }
    )
  })

  it('POST dispatches REQUEST action with options', async () => {
    await http.actions[POST]({ dispatch }, requests)

    expect(dispatch).toHaveBeenCalledWith(
      REQUEST, { url: '', data: '', params: '', method: 'post' }
    )
  })

  it('PATCH dispatches REQUEST action with options', async () => {
    await http.actions[PATCH]({ dispatch }, requests)

    expect(dispatch).toHaveBeenCalledWith(
      REQUEST, { url: '', data: '', params: '', method: 'patch' }
    )
  })

  it('DELETE dispatches REQUEST action with options', async () => {
    await http.actions[DELETE]({ dispatch }, requests)

    expect(dispatch).toHaveBeenCalledWith(
      REQUEST, { url: '', data: '', params: '', method: 'delete' }
    )
  })
})
