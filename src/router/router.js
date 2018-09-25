import Vue from 'vue'
import Router from 'vue-router'

import Dashboard from '../components/pages/Dashboard'
import Products from '../components/products/Products'
import Orders from '../components/orders/Orders'
import SignIn from '../components/pages/SignIn'

import PageNames from '../configs/pageNames'

Vue.use(Router);

const routes = [
    {
        path: '/',
        component: Dashboard,
        meta: {
            requiresAuth: true
        },
        redirect: '/products',
        children: [
            {
                path: 'products',
                name: PageNames.PRODUCTS,
                component: Products,
            },
            {
                path: 'orders',
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