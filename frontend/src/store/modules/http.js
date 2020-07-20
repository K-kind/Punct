import {
  REQUEST,
  GET,
  POST,
  PATCH,
  DELETE,
} from '../mutation-types'
import axios from 'axios'

export default {
  namespaced: true,
  actions: {
    async [REQUEST] (context, { method, url, data, params }) {
      const headers = {
        'X-Requested-With': 'XMLHttpRequest',
      }

      const options = {
        method,
        url: `${process.env.VUE_APP_API_URL}${url}`,
        withCredentials: true, // Cross Originの時のみ必要
        headers,
        data,
        params,
        timeout: 15000
      }

      return axios(options)
        .then(res => res)
        .catch(() => {
          window.alert('通信エラーが発生しました。ページリロード後、再度お試しください。')
        })
    },
    async [GET] ({ dispatch }, requests) {
      requests.method = 'get'
      return dispatch(REQUEST, requests)
    },
    async [POST] ({ dispatch }, requests) {
      requests.method = 'post'
      return dispatch(REQUEST, requests)
    },
    async [PATCH] ({ dispatch }, requests) {
      requests.method = 'patch'
      return dispatch(REQUEST, requests)
    },
    async [DELETE] ({ dispatch }, requests) {
      requests.method = 'delete'
      return dispatch('request', requests)
    }
  }
}
