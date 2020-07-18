import { index } from '@/store/index.js'
import { SET_TASKS, GET } from '@/store/mutation-types'

describe("SET_TASKS", () => {
  it("dispatches a http GET and commit SET_TASKS", async () => {
    const res = {
      data: {
        tasks: {
          daily: [], weekly: [], monthly: [],
        }
      }
    }
    const dispatch = jest.fn(() => {
      return new Promise((resolve) => {
        resolve(res)
      })
    })
    const commit = jest.fn()

    await index.actions[SET_TASKS]({ commit, dispatch })

    expect(dispatch).toHaveBeenCalledWith(
      `http/${GET}`, { url: 'tasks' }
    )
    expect(commit).toHaveBeenCalledWith(
      `daily/${SET_TASKS}`, res.data.tasks.daily, { root: true }
    )
    expect(commit).toHaveBeenCalledWith(
      `weekly/${SET_TASKS}`, res.data.tasks.weekly, { root: true }
    )
    expect(commit).toHaveBeenCalledWith(
      `monthly/${SET_TASKS}`, res.data.tasks.monthly, { root: true }
    )
  })
})
