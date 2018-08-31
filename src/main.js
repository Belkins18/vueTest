import 'bootstrap'
import 'babel-polyfill'
import './scss/style.scss'

import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store/store'
import './registerServiceWorker'

import PageNames from './pageNames'

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  try {
    console.log(store.state.isLoggedIn)
//     console.log(to)
//     console.log(from)
//     if (to.name !== PageNames.SIGN_IN) {
      // const hasUID = JSON.parse(localStorage.getItem('user'));
      // if (!!hasUID && !checkRole()) {
      //     next({
      //         path: `/${PageNames.SIGN_IN}`,
      //     });
      // }
      // $_routeCheckAuth(to, from, next);
    // } else {
      // alert(`PageNames: ${PageNames.SIGN_IN}`)
      // if (JSON.parse(localStorage.getItem('user'))) {
      //     console.log(JSON.parse(localStorage.getItem('user')).email);
      //     console.log(store.getters.isLoggedIn);
      //     next();
      //     // next({
      //     //     path: `/${PageNames.HOME}`,
      //     // });
      // }
      // checkRole();
//       next();
//     }
  } catch (error) {
    next({
      name: PageNames.SIGN_IN,
    });
    throw error;
  }
});



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')