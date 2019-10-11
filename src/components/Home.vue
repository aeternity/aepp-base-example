<template>
  <div class="w-full p-4 flex flex-col">
    <h1 class="mb-4">Your Aepp</h1>

    <div class="border">
      <div class="bg-green w-full flex flex-row font-mono border border-b">
        <div class="p-2 w-1/4">
          Public Key <small>(from Wallet Aepp)</small>
        </div>
        <div v-if="addressResponse" class="p-2 w-3/4 bg-grey-lightest break-words">
          {{ addressResponse }}
        </div>
        <div v-else class="p-2 w-3/4 bg-grey-lightest break-words text-grey">
          Requesting Public Key from AE Wallet...
        </div>
      </div>
      <div v-if="heightResponse" class="bg-green w-full flex flex-row font-mono border border-b">
        <div class="p-2 w-1/4">
          Height
        </div>
        <div class="p-2 w-3/4 bg-grey-lightest">
          {{heightResponse | responseToString}}
        </div>
      </div>

      <template v-if="nodeInfoResponse">
        <div v-if="nodeInfoResponse.error" class="bg-green w-full flex flex-row font-mono border border-b">
          <div class="p-2 w-1/4">
            NodeInfo error
          </div>
          <div class="p-2 w-3/4 bg-grey-lightest break-words">
            {{nodeInfoResponse.error}}
          </div>
        </div>
        <div
          v-for="(value, name) in nodeInfoResponse.result"
          v-if="['url', 'name', 'nodeNetworkId', 'version'].includes(name)"
          class="bg-green w-full flex flex-row font-mono border border-b"
        >
          <div class="p-2 w-1/4 capitalize">
            {{name.replace('nodeNetworkId', 'NetworkId')}}
          </div>
          <div class="p-2 w-3/4 bg-grey-lightest">
            {{value}}
          </div>
        </div>
      </template>

      <button
        class="w-32 rounded rounded-full bg-purple text-white py-2 px-4 pin-r mr-8 mt-4 text-xs"
        @click="requestAccountAccess"
      >
        Request account access
      </button>
      <button
        class="w-32 rounded rounded-full bg-purple text-white py-2 px-4 pin-r mr-8 mt-4 text-xs"
        @click="clearStorage"
      >
        Clear localStorage
      </button>
      <button
        class="w-32 rounded rounded-full bg-purple text-white py-2 px-4 pin-r mr-8 mt-4 text-xs"
        @click="close"
      >
        Close
      </button>
    </div>

    <h2 class="mt-4">Spend tokens</h2>

    <div class="border mt-4 rounded">
      <div class="bg-grey-lightest w-full flex flex-row font-mono">
        <div class="p-2 w-1/4">
          Recipient address
        </div>
        <div class="p-2 w-3/4 bg-white break-words">
          <input
            class="bg-black text-white border-b border-black p-2 w-full"
            v-model="spendTo"
            placeholder="ak_..."
          />
        </div>
      </div>
      <div class="bg-grey-lightest w-full flex flex-row font-mono">
        <div class="p-2 w-1/4">
          Tokens amount
        </div>
        <div class="p-2 w-3/4 bg-white break-words">
          <input
            class="bg-black text-white border-b border-black p-2 w-full"
            v-model="spendAmount"
          />
        </div>
      </div>
      <div class="bg-grey-lightest w-full flex flex-row font-mono">
        <div class="p-2 w-1/4">
          Payload
        </div>
        <div class="p-2 w-3/4 bg-white break-words">
          <input
            class="bg-black text-white border-b border-black p-2 w-full"
            v-model="spendPayload"
          />
        </div>
      </div>
      <button
        v-if="client && !waitMethod"
        class="w-32 rounded rounded-full bg-purple text-white py-2 px-4 pin-r mr-8 mt-4 text-xs"
        @click="spend"
      >
        Spend
      </button>
      <div
        v-if="waitSpend"
        class="p-2 w-1/4"
      >
        Waiting for spend...
      </div>
    </div>

    <div v-if="spendResponse" class="border mt-4 mb-8 rounded">
      <div class="bg-green w-full flex flex-row font-mono border border-b">
        <div class="p-2 w-1/4">
          Send result
        </div>
        <div
          class="p-2 w-3/4 bg-grey-lightest break-words whitespace-pre-wrap"
        >{{ spendResponse | responseToFormattedJSON }}</div>
      </div>
    </div>

    <h2 class="mt-4">Compile Contract</h2>

    <div class="border mt-4 rounded">
      <div class="bg-grey-lightest w-full flex flex-row font-mono">
        <div class="p-2 w-1/4">
          Contract Code
        </div>
        <div class="p-2 w-3/4 bg-white">
          <textarea class="bg-black text-white border-b border-black p-2 w-full h-64" v-model="contractCode" placeholder="contact code"/>
        </div>
      </div>
      <button v-if="client" class="w-32 rounded rounded-full bg-purple text-white py-2 px-4 pin-r mr-8 mt-4 text-xs" @click="compile">
        Compile
      </button>
    </div>

    <div v-if="compileBytecodeResponse" class="border mt-4 mb-8 rounded">
      <div class="bg-green w-full flex flex-row font-mono border border-b">
        <div class="p-2 w-1/4">
          Compiled Code
        </div>
        <div class="p-2 w-3/4 bg-grey-lightest break-words">
          {{ compileBytecodeResponse | responseToString }}
        </div>
      </div>
    </div>

    <button
      v-if="compileBytecodeResponse && compileBytecodeResponse.result && !waitMethod"
      class="w-32 rounded rounded-full bg-purple text-white py-2 px-4 pin-r mr-8 mt-4 text-xs"
      @click="deploy"
    >
      Deploy
    </button>

    <div
      v-if="waitDeploy"
      class="p-2 w-1/4"
    >
      Waiting for deploy...
    </div>

    <div v-if="deployResponse" class="border mt-4 mb-8 rounded">
      <div class="bg-green w-full flex flex-row font-mono border border-b">
        <div class="p-2 w-1/4">
          Deployed Contract
        </div>
        <div
          class="p-2 w-3/4 bg-grey-lightest break-words whitespace-pre-wrap"
        >{{ deployResponse | responseToFormattedJSON }}</div>
      </div>
    </div>

    <button
      v-if="deployResponse && deployResponse.result && !waitMethod"
      class="w-32 rounded rounded-full bg-purple text-white py-2 px-4 pin-r mr-8 mt-4 text-xs"
      @click="call"
    >
      Call
    </button>

    <div
      v-if="waitCall"
      class="p-2 w-1/4"
    >
      Waiting for call...
    </div>

    <div v-if="callResponse" class="border mt-4 mb-8 rounded">
      <div class="bg-green w-full flex flex-row font-mono border border-b">
        <div class="p-2 w-1/4">
          Call Result
        </div>
        <div
          class="p-2 w-3/4 bg-grey-lightest break-words whitespace-pre-wrap"
        >{{ callResponse | responseToFormattedJSON }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  //  is a webpack alias present in webpack.config.js
  import { Universal } from 'AE_SDK_MODULES'
  import { buildContractId } from 'AE_SDK_MODULES/tx/builder/helpers'
  import * as Crypto from 'AE_SDK_MODULES/utils/crypto'
  import * as RLP from '../lib/rlp'

  const errorAsField = async fn => {
    try {
      return { result: await fn }
    } catch (error) {
      return { error }
    }
  }

  export default {
    data () {
      return {
        query: '',
        runningInFrame: window.parent !== window,
        client: null,
        addressResponse: null,
        heightResponse: null,
        nodeInfoResponse: null,
        spendTo: null,
        spendAmount: null,
        spendPayload: null,
        spendResponse: null,
        contractCode: `contract Identity =
      entrypoint main(x : int) = x`,
        compileBytecodeResponse: null,
        contractInitState: [],
        deployResponse: null,
        callResponse: null,
        waitSpend: false,
        waitDeploy: false,
        waitCall: false,
      }
    },
    filters: {
      responseToString: response => `${response.error ? 'Error: ' : ''}${response.result || response.error}`,
      responseToFormattedJSON: response => response.error
        ? `Error: ${response.error}`
        : JSON.stringify(response.result, null, 4),
    },
    computed: {
      waitMethod() {
        return this.waitSpend || this.waitDeploy || this.waitCall
      }
    },
    methods: {
      async requestAccountAccess() {
        return this.client.address()
      },
      clearStorage() {
        window.localStorage.clear()
        this.$router.push({ name: 'home' })
        window.location.reload()
      },
      close() {
        window.open('aepp-base://')
        window.close()
      },
      async spend () {
        localStorage.setItem('method', 'Spend')
        this.spendResponse = await errorAsField(this.client.spend(
          this.spendAmount,
          this.spendTo, {
            payload: this.spendPayload
          }
        ))
      },
      async compile () {
        this.compileBytecodeResponse = await errorAsField(
          (await this.client.contractCompile(this.contractCode)).bytecode
        )
      },
      async deploy () {
        localStorage.setItem('method', 'Deploy');
        this.deployResponse = await errorAsField(this.client.contractDeploy(
          this.compileBytecodeResponse.result, this.contractCode, this.contractInitState
        ))
      },
      async call (code, method = 'main', returnType = 'int', args = ['5']) {
        localStorage.setItem('method', 'Call');
        this.callResponse = await errorAsField((async () => {
          const result = await this.client.contractCall(
            this.contractCode, this.deployResponse.address, method,  args
          )
          return Object.assign(
            result,
            { decodedRes: await result.decode(returnType) }
          )
        })())
      },
      async getReverseWindow() {
        const iframe = document.createElement('iframe')
        iframe.src = prompt('Enter wallet URL', 'http://localhost:9000')
        iframe.style.display = 'none'
        document.body.appendChild(iframe)
        await new Promise(resolve => {
          const handler = ({ data }) => {
            if (data.method !== 'ready') return
            window.removeEventListener('message', handler)
            resolve()
          }
          window.addEventListener('message', handler)
        })
        return iframe.contentWindow
      }
    },
    async created () {
      this.query = this.$route.query.d
      if (this.query) {
        const rlp = RLP.rlpToStrings(Crypto.decode(Crypto.decodeBase58Check(this.query)))
        if (rlp[RLP.DEEPLINK_RESULT] !== 'denied') {
          localStorage.setItem(rlp[RLP.DEEPLINK_METHOD], rlp[RLP.DEEPLINK_RESULT])
          this.result = { [rlp[RLP.DEEPLINK_METHOD]]: rlp[RLP.DEEPLINK_RESULT] }
        }
      }

      const buildDeeplinkUrl = (method, ...params) => {
        const rlp = Crypto.encodeBase58Check(Crypto.encode([method, window.location.origin, params]))
        const url = new URL('aepp-base://')
        url.searchParams.set('d', rlp)
        return url
      }

      const openWallet = url => {
        console.log(url)
        window.location.href = url
        // window.close()
      }

      this.client = await Universal.compose({
        methods: {
          address: () => {
            const storageAddress = localStorage.getItem('address')
            if (storageAddress) {
              return storageAddress
            }
            openWallet(buildDeeplinkUrl('address'))
          },
          signTransaction: txBase64 => {
            console.log(txBase64)
            openWallet(buildDeeplinkUrl('signTransaction', txBase64))
          }
        },
      })({
        url: 'https://sdk-testnet.aepps.com',
        internalUrl: 'https://sdk-testnet.aepps.com',
        compilerUrl: 'https://compiler.aepps.com',
      })

      const method = localStorage.getItem('method')
      if (method) this[`wait${method}`] = true

      this.addressResponse = localStorage.getItem('address')
      this.heightResponse = await errorAsField(this.client.height())
      this.nodeInfoResponse = await errorAsField(this.client.getNodeInfo())

      const signedTx = localStorage.getItem('signTransaction')
      if (signedTx) {
        const result = await this.client.sendTransaction(signedTx)
        const { hash, rawTx, tx: { nonce } } = result

        switch (method) {
          case 'Spend':
            this.spendResponse = { result }
            break
          case 'Deploy':
            const contractId = buildContractId(this.addressResponse, nonce)

            this.deployResponse = {
              result: await this.client.getTxInfo(hash),
              owner: this.addressResponse,
              transaction: hash,
              rawTx,
              address: contractId,
            }
            break
          case 'Call':
            this.callResponse = {
              hash,
              rawTx,
              result: await this.client.getTxInfo(hash),
            }
            break
          default:
            break
        }

      localStorage.removeItem('signTransaction')
      localStorage.removeItem('method')
      this[`wait${method}`] = false;
      }
    }
  }
</script>
