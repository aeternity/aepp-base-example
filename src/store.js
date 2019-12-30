import Vue from 'vue';
import Vuex from 'vuex';
import { Universal } from '@aeternity/aepp-sdk/es';
import walletConnector, { providers } from 'aepp-wallet-connector/dist/aeppWalletConnector.common';
import { storeResponse } from 'aepp-wallet-connector/src/DeeplinkClient';

Vue.use(Vuex);
storeResponse();

export default new Vuex.Store({
  state: {
    sdkPromise: walletConnector(providers.default, [Universal]),
  },
});
