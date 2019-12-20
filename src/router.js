import Vue from 'vue';
import VueRouter from 'vue-router';
import Basic from './views/Basic.vue';
import Contracts from './views/Contracts.vue';
import BaseAepp from './views/BaseAepp.vue';

Vue.use(VueRouter);

export default new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
    path: '/',
    name: 'basic',
    component: Basic,
  }, {
    path: '/contracts',
    name: 'contracts',
    component: Contracts,
  }, {
    path: '/base-aepp',
    name: 'base-aepp',
    component: BaseAepp,
  }],
});
