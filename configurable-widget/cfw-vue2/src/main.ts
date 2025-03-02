import Vue from 'vue'
import App from '../examples/App.vue'
import 'view-design/dist/styles/iview.css';
import ViewUI from 'view-design';

Vue.use(ViewUI);
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');