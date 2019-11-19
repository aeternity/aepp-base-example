import stampit from '@stamp/it'
import * as R from 'ramda'

function addMethodToQueue(method) {
  return function (...params) {
    if (method === 'address') {
      let address = localStorage.getItem('address')
      return address
        ? Promise.resolve(address)
        : this.addMethodToQueue(method, params)
    }

    return this.addMethodToQueue(method, params)
  }
}

const DeeplinkClient = stampit({
  init() {
    const url = new URL(window.location.href)
    const result = url.searchParams.get('result')

    if (result) {
      localStorage.setItem('result', decodeURIComponent(result))
      window.close()
    } else {
      window.addEventListener('storage', () => {
        if (localStorage.getItem('result')) {
          receive(localStorage.getItem('result'))
        }
      });
    }
    const queue = []
    let waitingForRunningMethod = false

    function receive(data) {
      const result = JSON.parse(data)
      const method = queue.shift()

      if (result !== 'denied') {
        if (method.name === 'address') localStorage.setItem('address', result)
        method.resolve(result)
      } else {
        method.reject(result)
      }

      localStorage.removeItem('result')
      waitingForRunningMethod = false

      if (queue.length) {
        callMethod(queue[0].name, queue[0].params)
      }
    }

    const buildDeeplinkUrl = (method, params) => {
      const url = new URL(`aepp-base:${method}`)
      params.forEach((p, i) => url.searchParams.set(`param${i}`, JSON.stringify(p)))
      url.searchParams.set('callback', window.location.origin)
      return url
    }

    const callMethod = (method, params) => {
      if (!waitingForRunningMethod) {
        waitingForRunningMethod = true
        window.location.href = buildDeeplinkUrl(method, params)
      }
    }

    this.addMethodToQueue = (method, params) => {
      const p = new Promise((resolve, reject) => {
        queue.push({ name: method, params, resolve, reject })
      })

      callMethod(method, params)

      return p
    }
  },
  methods: R.fromPairs(['address', 'sign', 'signTransaction'].map(m => [m, addMethodToQueue(m)])),
})

export default DeeplinkClient
