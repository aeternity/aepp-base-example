<template>
  <div>
    <h2>Base app version</h2>
    <div class="group">
      <div>
        <div>Base app version</div>
        <PromiseRender :promise="baseAppVersionPromise" />
      </div>
    </div>

    <h2>Scan QR code</h2>
    <div class="group">
      <div>
        <div>Scanner title</div>
        <div><input v-model="readQrCodeTitle"></div>
      </div>
      <button
        :disabled="!sdk"
        @click="readQrCode"
      >
        Scan
      </button>
      <div v-if="readQrCodePromise">
        <div>Scanned data</div>
        <PromiseRender :promise="readQrCodePromise" />
      </div>
    </div>

    <h2>Copy to clipboard</h2>
    <div class="group">
      <div>
        <div>Text to copy</div>
        <div><input v-model="copyText"></div>
      </div>
      <button @click="copy">
        Copy
      </button>
      <div v-if="copyPromise">
        <div>Copy result</div>
        <PromiseRender :promise="copyPromise" />
      </div>
    </div>
  </div>
</template>

<script>
import copyToClipboard from 'copy-to-clipboard';
import PromiseRender from '../components/PromiseRender.vue';

export default {
  components: { PromiseRender },
  data: () => ({
    sdk: null,
    baseAppVersionPromise: null,
    readQrCodeTitle: '',
    readQrCodePromise: null,
    copyText: 'Text to copy',
    copyPromise: null,
  }),
  async mounted() {
    this.sdk = await this.$store.state.sdkPromise;
    this.baseAppVersionPromise = this.sdk.baseAppVersion();
  },
  methods: {
    readQrCode() {
      this.readQrCodePromise = this.sdk.readQrCode({ title: this.readQrCodeTitle });
    },
    copy() {
      try {
        this.copyPromise = Promise.resolve(copyToClipboard(this.copyText));
      } catch (error) {
        this.copyPromise = Promise.reject(error);
      }
    },
  },
};
</script>
