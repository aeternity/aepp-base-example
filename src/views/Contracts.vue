<template>
  <div>
    <h2>Compile Contract</h2>
    <div class="group">
      <div>
        <div>Contract Code</div>
        <div>
          <textarea
            v-model="contractCode"
            placeholder="Contact code"
          />
        </div>
      </div>
      <button
        :disabled="!sdk"
        @click="compile"
      >
        Compile
      </button>
      <div v-if="compileBytecodePromise">
        <div>Compiled Code</div>
        <PromiseRender :promise="compileBytecodePromise" />
      </div>
    </div>

    <template v-if="compileBytecodePromise">
      <h2>Deploy Contract</h2>
      <div class="group">
        <button @click="deploy">
          Deploy
        </button>
        <div v-if="deployPromise">
          <div>Deployed Contract</div>
          <PromiseRender :promise="deployPromise" />
        </div>
      </div>
    </template>

    <template v-if="deployPromise">
      <h2>Call Contract</h2>
      <div class="group">
        <button @click="call">
          Call
        </button>
        <div v-if="callPromise">
          <div>Call Result</div>
          <PromiseRender :promise="callPromise" />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import PromiseRender from '../components/PromiseRender.vue';

export default {
  components: { PromiseRender },
  data: () => ({
    sdk: null,
    contractCode: `contract Identity =
      entrypoint main(x : int) = x`,
    compileBytecodePromise: null,
    deployPromise: null,
    callPromise: null,
  }),
  async mounted() {
    this.sdk = await this.$store.state.sdkPromise;
  },
  methods: {
    compile() {
      this.compileBytecodePromise = this.sdk
        .contractCompile(this.contractCode)
        .then(({ bytecode }) => bytecode);
    },
    deploy() {
      this.deployPromise = this.compileBytecodePromise
        .then(bytecode => this.sdk.contractDeploy(bytecode, this.contractCode, []));
    },
    call() {
      this.callPromise = this.deployPromise
        .then(({ address }) => this.sdk.contractCall(this.contractCode, address, 'main', ['5']))
        .then(result => result.decode('int')
          .then(decodedRes => ({ ...result, decodedRes })));
    },
  },
};
</script>
