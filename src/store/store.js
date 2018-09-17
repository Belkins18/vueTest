import Vue from 'vue'
import Vuex from 'vuex'

import apiConfig from '../apiConfig';
import firebase from 'firebase';
import 'firebase/firestore';

Vue.use(Vuex);

const USER_LS = "user";
const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS';
const USER_LOGOUT = "LOGOUT";
const DB_GET_USERKEYS_SUCCESS = "DB_GET_USERKEYS_SUCCESS";
const DB_GET_PRODUCTLIST_SUCCESS = "DB_GET_PRODUCTLIST_SUCCESS";
const DB_SET_PRODUCT_REQUEST = "DB_SET_PRODUCT_REQUEST";
const DB_SET_PRODUCT_SUCCESS = "DB_SET_PRODUCT_SUCCESS";
const DB_REMOVE_PRODUCT_SUCCESS = "DB_REMOVE_PRODUCT_SUCCESS";

const state = {
    isLoggedIn: !!localStorage.getItem(USER_LS),
    user: JSON.parse(localStorage.getItem('user')) || null,
    products: [],
    users: [],
    error: ''
};

const mutations = {
    [USER_LOGIN_SUCCESS](state, payload) {
        state.loading = false;
        state.isLoggedIn = true;
        state.user = payload;
        state.error = '';

        localStorage.setItem(USER_LS, JSON.stringify(payload));
    },
    [USER_LOGOUT](state) {
        state.isLoggedIn = false;
        state.user = null;
        state.users = [];
        state.products = [];

        localStorage.removeItem(USER_LS);
        localStorage.clear();
    },


    [DB_GET_PRODUCTLIST_SUCCESS](state, payload) {
        state.products = payload
    },

    [DB_SET_PRODUCT_SUCCESS](state) {
        console.log('product: ' + state + ' removed');
        // state.products = payload
    },

    [DB_REMOVE_PRODUCT_SUCCESS](payload) {
        console.log('product: ' + payload + ' removed');
    },

    [DB_GET_USERKEYS_SUCCESS](state, payload) {
        state.users = payload
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
        return new firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
            .then((response) => {
                const settingUser = {
                    email: response.user.email,
                    uid: response.user.uid,
                    status: (response.user.uid === apiConfig.adminKey) ? 'admin' : 'user',
                };

                commit(USER_LOGIN_SUCCESS, settingUser);
                return settingUser;
            })
            .then(() => {
                dispatch('getUsersList')
            })
            .catch((error) => error);
    },
    logout({commit}) {
        commit(USER_LOGOUT);
    },
    getDBListCountElements({commit}) {
        /**
         * FIXME Всегда старайся возвращать промис
         */
        firebase.database().ref(`/products`)
            .on("value", function (snapshot) {
                console.log("There are " + snapshot.numChildren() + " messages");
                commit(DB_REMOVE_PRODUCT_SUCCESS);
                return snapshot.numChildren();
            });
    },
    getProductList({commit}) {
        return new firebase.database().ref('/products').once("value")
            .then((snapshot) => {

                commit(DB_GET_PRODUCTLIST_SUCCESS, snapshot.val());
                return snapshot.val();
            })
            .catch((error) => error);
    },

    setProtuctToProductList({commit}, payload) {
        return new firebase.database().ref('/products')
            .push()
            .set(payload)
            .then(() => {
                commit(DB_SET_PRODUCT_SUCCESS, payload);
            })
            .then(()=>{
                console.log(this);
                // this.once("value")
                //     .then((snapshot) => {
                //
                //         commit(DB_GET_PRODUCTLIST_SUCCESS, snapshot.val());
                //         return snapshot.val();
                //     })
            })
            .catch((error) => error);
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
        return new firebase.database().ref('/users').once("value")
            .then((snapshot) => {

                commit(DB_GET_USERKEYS_SUCCESS, snapshot.val());
                return snapshot.val();
            })
            .catch((error) => error);
    },
};

export default new Vuex.Store({
    state,
    mutations,
    actions,
});