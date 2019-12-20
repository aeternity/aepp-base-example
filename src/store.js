import Vue from 'vue';
import Vuex from 'vuex';
import { Aepp } from '@aeternity/aepp-sdk/es';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    sdkPromise: Aepp.compose({
      deepConfiguration: { Ae: { methods: ['readQrCode', 'baseAppVersion'] } },
    })(),
  },
});
