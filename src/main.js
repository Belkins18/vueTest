import 'bootstrap'
import 'babel-polyfill'
import './assets/scss/style.scss'

import Vue from 'vue'
import App from './components/App.vue'
import router from './router/router'
import store from './store/store'
import {sync} from 'vuex-router-sync';
import PageNames from "./configs/pageNames";
import VeeValidate from 'vee-validate';

Vue.config.productionTip = false;

sync(store, router);
Vue.use(VeeValidate);


const USER_LS = 'user';

function checkRole() {
    let user = store.state.user || JSON.parse(localStorage.getItem(USER_LS));

    if (user === null) {
        return false
    }

    if (user === Object) {
        return true
    }

    return true;
}

router.beforeEach((to, from, next) => {
    try {
        if (to.matched.some(record => record.meta.requiresAuth)) {
            if (!checkRole()) {
                return next({ name: PageNames.SIGN_IN })
            }

            next();
        } else {
            if (JSON.parse(localStorage.getItem(USER_LS)) !== null) {
                next({name: PageNames.PRODUCTS})
            }

            next();
        }
    } catch (error) {
        next({name: PageNames.SIGN_IN});
        throw error;
    }
});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');