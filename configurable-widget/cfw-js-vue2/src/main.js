import Vue from 'vue';
import App from './App.vue'
import hello from '@ajaxjs/configurable-widget-vue2';
import AjaxjsWidget from '@ajaxjs/widgets';
import '@ajaxjs/widgets/dist/@ajaxjs/widgets.css';

Vue.config.productionTip = false;

Vue.use(hello);
Vue.use(AjaxjsWidget);

new Vue({
  render: h => h(App),
}).$mount('#app')
