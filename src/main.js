import 'bootstrap'
import 'babel-polyfill'
import './assets/scss/style.scss'

import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store/store'
import {sync} from 'vuex-router-sync';
import './registerServiceWorker'
import PageNames from "./pageNames";

Vue.config.productionTip = false;

sync(store, router);

const USER_LS = 'user';

function checkRole(role) {
    let user = store.state.user || JSON.parse(localStorage.getItem(USER_LS));
    let isAuthFulfilled = store.state.isLoggedIn;

    if (user === null || isAuthFulfilled === false) { return false }
    if (user == Object || isAuthFulfilled === true) { return true }

    if (typeof role === 'string') {
        const { granted } = user;
        if (granted) {
            return granted.findIndex(role_ => role_ === role) !== -1;
        }
        return false;
    }
    return true;
}

router.beforeEach((to, from, next) => {
    try {
        if (to.matched.some(record => record.meta.requiresAuth)) {
            if (!checkRole()) { return next({ name: PageNames.SIGN_IN }) }
            next();
        } else {
            if (JSON.parse(localStorage.getItem(USER_LS)) !== null) { next({name: PageNames.PRODUCTS}) }
            next();
        }
    }
    catch (error) {
        next({name: PageNames.SIGN_IN});
        throw error;
    }
});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');