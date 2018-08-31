import Vue from 'vue'
import Router from 'vue-router'

import Main from '../components/Main'
import Home from '../views/Home'
import Products from '../views/Products'
import Orders from '../views/Orders'
import SignIn from '../views/SignIn'

import PageNames from '../pageNames'

Vue.use(Router)

const routes = [
  {
    path: `/`,
    redirect: `/${PageNames.HOME}`,
    component: Home, 
    meta: {
      auth: true
    },
  },
  {
    path: `${PageNames.MAIN}:id`,
    name: `${PageNames.MAIN}/`,
    component: Main,
    meta: {
      auth: true
    },
    children: [
      {
        path: `/${PageNames.HOME}`,
        name: PageNames.HOME,
        component: Home,
        // component: () => import('./views/Products.vue')
      },
      {
        path: `/${PageNames.PRODUCTS}`,
        name: PageNames.PRODUCTS,
        component: Products
        // component: () => import('./views/Products.vue')
      },
      {
        path: `/${PageNames.ORDERS}`,
        name: PageNames.ORDERS,
        component: Orders,
        // component: () => import('./views/Products.vue')
      },
    ]
  },
  {
    path: `/${PageNames.SIGN_IN}`,
    name: PageNames.SIGN_IN,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: SignIn
  }
]
export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})