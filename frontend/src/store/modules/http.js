import {
  REQUEST,
  GET,
  POST,
  PATCH,
  DELETE,
  // CREATE
} from '../mutation-types'
import axios from 'axios'

export default {
  namespaced: true,
  actions: {
    async [REQUEST] (context, { method, url, data, params }) {
    // async [REQUEST] ({ dispatch, rootState }, { method, url, data, error }) {
      const headers = {}
      // headers['Content-Type'] = 'application/json'
      // headers['Access-Control-Allow-Origin'] = '*' // 開発のみ
      // headers['Access-Control-Allow-Origin'] = 'localhost:3000' // 開発のみ
      // if (rootState.auth.token) {
        // headers['Authorization'] = `Token ${rootState.auth.token}`
        // headers['User-Id'] = rootState.auth.userId // なくて良い
      // }

      const options = {
        method,
        url: `http://localhost/api/${url}`,
        // url: `${process.env.API_URL}${url}`,
        withCredentials: true, // 開発のみ
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
