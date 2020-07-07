import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/fontAwesome.js'
import './plugins/element.js'
import './plugins/validation.js'
require('@/assets/sass/main.scss')

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
