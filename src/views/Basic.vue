<template>
  <div>
    <h2>General information</h2>
    <div class="group">
      <div>
        <div>Address</div>
        <PromiseRender :promise="addressPromise" />
      </div>
      <div>
        <div>Height</div>
        <PromiseRender :promise="heightPromise" />
      </div>
      <div>
        <div>Node info</div>
        <PromiseRender :promise="nodeInfoPromise" />
      </div>
    </div>

    <h2>Spend tokens</h2>
    <div class="group">
      <div>
        <div>Recipient address</div>
        <div>
          <input
            v-model="spendTo"
            placeholder="ak_..."
          >
        </div>
      </div>
      <div>
        <div>Tokens amount</div>
        <div><input v-model="spendAmount"></div>
      </div>
      <div>
        <div>Payload</div>
        <div><input v-model="spendPayload"></div>
      </div>
      <button
        :disabled="!sdk"
        @click="spend"
      >
        Spend
      </button>
      <div v-if="spendPromise">
        <div>Spend result</div>
        <PromiseRender :promise="spendPromise" />
      </div>
    </div>
  </div>
</template>

<script>
import PromiseRender from '../components/PromiseRender.vue';

export default {
  components: { PromiseRender },
  data: () => ({
    sdk: null,
    addressPromise: null,
    heightPromise: null,
    nodeInfoPromise: null,
    spendTo: '',
    spendAmount: '',
    spendPayload: '',
    spendPromise: null,
  }),
  async mounted() {
    this.sdk = await this.$store.state.sdkPromise;
    this.addressPromise = this.sdk.address();
    this.heightPromise = this.sdk.height();
    this.nodeInfoPromise = this.sdk.getNodeInfo();
  },
  methods: {
    spend() {
      this.spendPromise = this.sdk.spend(
        this.spendAmount,
        this.spendTo, {
          payload: this.spendPayload,
        },
      );
    },
  },
};
</script>
