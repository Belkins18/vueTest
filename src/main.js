import 'bootstrap'
import 'babel-polyfill'
import './scss/style.scss'

import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store/store'
import './registerServiceWorker'
import PageNames from "./pageNames";


// import PageNames from './pageNames'

Vue.config.productionTip = false;


router.beforeEach((to, from, next) => {
    // const user = JSON.parse(localStorage.getItem('user'));
    // console.log(to);
    // console.log(user);
    // console.log(!user);
    // console.log(!!user);
    // console.log(store.state.isLoggedIn);
    // if (store.state.isLoggedIn === false) {
    //     debugger;
    //     next({path: PageNames.SIGN_IN});
    // } else if (store.state.isLoggedIn === true){
    //     debugger;
    //     next({path: PageNames.HOME});
    // } else {
    //     next();
    // }


    try {
        // if (to.matched.some(record => record.meta.requiresAuth)) {
        //     // этот путь требует авторизации, проверяем залогинен ли
        //     // пользователь, и если нет, перенаправляем на страницу логина
        //     if (!store.state.isLoggedIn && store.state.user === null) {
        //         debugger;
        //         next({
        //             path: '/signIn',
        //         })
        //     } else {
        //         next()
        //     }
        // } else if (store.state.user !== null) {
        //     debugger;
        //     next({
        //         path: '/home',
        //     })
        // } else {
        //     next() // всегда так или иначе нужно вызвать next()!
        // }

        if (to.name !== PageNames.SIGN_IN) {
            // if (to.matched.some(record => record.meta.requiresAuth)) {
            if (store.state.user === null) {
                next({
                    path: '/signIn',
                })
            } else {
                next();
            }
        } else {
            next();
        }
        // } else {
        //     debugger;
        //     next();
        // }
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
}).$mount('#app');