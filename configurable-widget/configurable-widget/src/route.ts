import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
// import Home from '../views/Home.vue'

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "about" */ './index.vue'),
  },
  {
    path: '/list-info',
    component: () => import('./list/info.vue')
  },
  {
    path: '/form-info',
    component: () => import('./form/info/info.vue')
  },
];

export default new VueRouter({ routes });