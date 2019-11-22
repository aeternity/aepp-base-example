/* global localStorage */

import stampit from '@stamp/it'
import * as R from 'ramda'

let cachedAddress

const genProxyMethod = method => function (...params) {
  if (method === 'address' && cachedAddress) return Promise.resolve(cachedAddress)
  return this.addRequestToQueue(method, params)
}

const localStorageKey = 'UrlSchemeRpcClientResponse'

export default stampit({
  init () {
    const url = new URL(window.location.href)
    const result = url.searchParams.get('result')
    const error = url.searchParams.get('error')

    if (result || error) {
      localStorage.setItem(
        localStorageKey,
        JSON.stringify({
          [error ? 'error' : 'result']: JSON.parse(decodeURIComponent(error || result))
        })
      )
      window.close()
    }

    window.addEventListener('storage', () => {
      const response = localStorage[localStorageKey]
      if (response) {
        handleResponse(JSON.parse(response))
        localStorage.removeItem(localStorageKey)
      }
    })

    const requestQueue = []
    let waitingForResponse = false

    const handleResponse = ({ result, error }) => {
      const request = requestQueue.shift()
      if (result && request.name === 'address') cachedAddress = result
      if (result) request.resolve(result)
      else request.reject(error)
      waitingForResponse = false
      callMethodFromQueue()
    }

    const buildRequestUrl = (method, params) => {
      const url = new URL(`aepp-base:${method}`)
      params.forEach((p, i) => url.searchParams.set(`param${i}`, JSON.stringify(p)))
      url.searchParams.set('callback', window.location.origin)
      return url
    }

    const callMethodFromQueue = () => {
      if (!waitingForResponse && requestQueue.length) {
        const { name, params } = requestQueue[0]
        waitingForResponse = true
        window.location.href = buildRequestUrl(name, params)
      }
    }

    this.addRequestToQueue = (name, params) => {
      const p = new Promise((resolve, reject) => {
        requestQueue.push({ name, params, resolve, reject })
      })
      callMethodFromQueue()
      return p
    }
  },
  methods: R.fromPairs(['address', 'sign', 'signTransaction'].map(m => [m, genProxyMethod(m)]))
})
