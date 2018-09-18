import Vue from 'vue'
import Router from 'vue-router'

import MainLayout from '../components/MainLayout'
// import Home from '../views/Home'
import Products from '../views/Products'
import Orders from '../views/Orders'
import SignIn from '../views/SignIn'

import PageNames from '../pageNames'

Vue.use(Router);

const routes = [
    {
        path: PageNames.MAIN_LAYOUT,
        component: MainLayout,
        meta: {
            requiresAuth: true
        },
        redirect: '/products',
        children: [
            {
                path: '/products',
                name: PageNames.PRODUCTS,
                component: Products,
            },
            {
                path: '/orders',
                name: PageNames.ORDERS,
                component: Orders,
            },
        ]
    },
    {
        path: `/signIn`,
        name: PageNames.SIGN_IN,
        component: SignIn,
    }
];

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})