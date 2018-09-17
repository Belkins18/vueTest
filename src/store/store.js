import Vue from 'vue'
import Vuex from 'vuex'
import {
    USER_LS,
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAILURE,
    USER_LOGOUT,
    DB_GET_PRODUCTLIST_REQUEST,
    DB_GET_PRODUCTLIST_SUCCESS,
    DB_GET_PRODUCTLIST_FAILURE,
    DB_SET_PRODUCT_REQUEST,
    DB_SET_PRODUCT_SUCCESS,
    DB_SET_PRODUCT_FAILURE,
    DB_REMOVE_PRODUCT_SUCCESS,
    DB_GET_USERKEYS_REQUEST,
    DB_GET_USERKEYS_SUCCESS,
    DB_GET_USERKEYS_FAILURE,
} from "./mutations";

import apiConfig from '../apiConfig';
import firebase from 'firebase';
import 'firebase/firestore';

Vue.use(Vuex);

const state = {
    loading: false,
    isLoggedIn: !!localStorage.getItem(USER_LS),
    user: JSON.parse(localStorage.getItem('user')) || null,
    products: [],
    users: [],
    error: ''
};

const mutations = {
    [USER_LOGIN_REQUEST](state) {
      /**
       * FIXME Безсмысленная конструкция, особенно если учесть что по проекту это нигде не используется
       */
        state.loading = true;
    },
    [USER_LOGIN_SUCCESS](state, payload) {
        state.loading = false;
        state.isLoggedIn = true;
        state.user = payload;
        state.error = '';

        localStorage.setItem(USER_LS, JSON.stringify(payload));
    },
    [USER_LOGIN_FAILURE](state, payload) {
      /**
       * FIXME -/-
       */
        state.loading = false;

        console.log(payload.code);
        console.log(payload.message);
    },
    [USER_LOGOUT](state) {
        state.isLoggedIn = false;
        state.user = null;
        state.users = [];
        state.products = [];

        localStorage.removeItem(USER_LS);
        localStorage.clear();
    },

    [DB_GET_PRODUCTLIST_REQUEST](state) {
      /**
       * FIXME -/-
       */
        state.loading = true;
    },
    [DB_GET_PRODUCTLIST_SUCCESS](state, payload) {
        state.products = payload
    },
    [DB_GET_PRODUCTLIST_FAILURE](state, payload) {
      /**
       * FIXME -/-
       */
        state.loading = false;

        console.log(payload.code);
        console.log(payload.message);
    },

    [DB_SET_PRODUCT_REQUEST](state) {
      /**
       * FIXME -/-
       */
        state.loading = true;
    },
    [DB_SET_PRODUCT_SUCCESS](state, payload) {
        state.products = payload
    },
    [DB_SET_PRODUCT_FAILURE](state, payload) {
      /**
       * FIXME -/-
       */
        state.loading = false;

        console.log(payload.code);
        console.log(payload.message);
    },

    [DB_REMOVE_PRODUCT_SUCCESS](payload) {
        console.log('product: ' + payload + ' removed');
    },

    [DB_GET_USERKEYS_REQUEST](state) {
      /**
       * FIXME -/-
       */
        state.loading = true;
    },
    [DB_GET_USERKEYS_SUCCESS](state, payload) {
        state.users = payload
    },
    [DB_GET_USERKEYS_FAILURE](state, payload) {
      /**
       * FIXME -/-
       */
        state.loading = false;

        console.log(payload.code);
        console.log(payload.message);
    },
};

const actions = {
    // Auth
    initFirebase() {
        firebase.initializeApp(apiConfig.firebase);
        let product = firebase.database().ref('/products');
        console.log(product.child('0'));
        // var auth = firebase.auth();
        // auth.onAuthStateChanged(function (user) {
        //     if (user) {
        //         // User signed in!
        //         let uid = user.uid;
        //         console.log(uid);
        //     } else {
        //         // User logged out
        //     }
        // });
    },

    userAuth({dispatch, commit}, payload) {
      /**
       * FIXME Не нужно оборачивать промис в промис
       */
        return new Promise((resolve, reject) => {
            let auth = firebase.auth();
            // LOGIN_REQUEST
            commit(USER_LOGIN_REQUEST); // show spinner

            auth.signInWithEmailAndPassword(payload.email, payload.password)
                .then((response) => {
                    const settingUser = {
                        email: response.user.email,
                        uid: response.user.uid,
                        status: (response.user.uid === apiConfig.adminKey) ? 'admin' : 'user',
                    };

                    dispatch('getUsersList')
                        .then((data) => {
                            console.log(data);
                        });
                    // LOGIN_SUCCESS
                    commit(USER_LOGIN_SUCCESS, settingUser);
                    resolve(settingUser);
                })
                .catch((error) => {
                    // LOGIN_FAILURE
                    commit(USER_LOGIN_FAILURE, error);
                    reject();
                })
        });
    },
    logout({commit}) {
        commit(USER_LOGOUT);
    },
    getDBListCountElements({commit}) {
      /**
       * FIXME Всегда старайся возвращать промис
       */
        firebase.database().ref(`/products`)
            .on("value", function(snapshot) {
                console.log("There are "+snapshot.numChildren()+" messages");
                commit(DB_REMOVE_PRODUCT_SUCCESS);
                return snapshot.numChildren();
            });
    },
    getProductList({commit}) {
      /**
       * FIXME Не нужно оборачивать промис в промис, можно просто return firebase.dat...
       */
        // PRODUCTLIST_REQUEST
        commit(DB_GET_PRODUCTLIST_REQUEST);
        return new Promise((resolve, reject) => {
            firebase.database().ref('/products').once("value")
                .then((snapshot) => {
                    // PRODUCTLIST_SUCCESS
                    commit(DB_GET_PRODUCTLIST_SUCCESS, snapshot.val());
                    resolve(snapshot.val());
                })
                .catch((error) => {
                    // PRODUCTLIST_FAILURE
                    commit(DB_GET_PRODUCTLIST_FAILURE, error);
                    reject();
                });
        });
    },

    setProtuctToProductList({commit}, payload) {
      /**
       * FIXME Я не уверен, но скорее всего ты получишь две мутации подряд, а вот запрос к firebase отработает асинхронно
       * и собственно ты ничего не узнаешь о его результате
       */
      commit(DB_SET_PRODUCT_REQUEST);
        firebase.database().ref('/products')
            .push()
            .set(payload);
        commit(DB_SET_PRODUCT_SUCCESS, payload);
    },

    editProtuctWithProductList({commit}, payload) {
        commit(DB_SET_PRODUCT_REQUEST);
        firebase.database().ref(`/products/${payload.editElement}`)
            .set(payload.editedResults);
        commit(DB_SET_PRODUCT_SUCCESS, payload);
    },

    removeProtuctWithProductList({commit}, index) {
      /**
       * FIXME ?
       */
        firebase.database().ref('/products')
            .child(index).remove();
        commit(DB_REMOVE_PRODUCT_SUCCESS);
    },

    getUsersList({commit}) {
      /**
       * FIXME Не нужно оборачивать промис в промис, можно просто return firebase.dat...
       */
      // USERKEYS_REQUEST
        commit(DB_GET_USERKEYS_REQUEST);
        return new Promise((resolve, reject) => {
            firebase.database().ref('/users').once("value")
                .then((snapshot) => {
                    // USERKEYS_SUCCESS
                    commit(DB_GET_USERKEYS_SUCCESS, snapshot.val());
                    resolve(snapshot.val());
                })
                .catch((error) => {
                    // USERKEYS_FAILURE
                    commit(DB_GET_USERKEYS_FAILURE, error);
                    reject();
                });
        });
    },
};

export default new Vuex.Store({
    state,
    mutations,
    actions,
});