import 'bootstrap'
import 'babel-polyfill'
import './scss/style.scss'

import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store/store'
import './registerServiceWorker'

// import PageNames from './pageNames'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
