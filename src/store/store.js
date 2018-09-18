import Vue from 'vue'
import Vuex from 'vuex'

import apiConfig from '../apiConfig';
import firebase from 'firebase';
import 'firebase/firestore';

Vue.use(Vuex);

const USER_LS = "user";
const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS';
const USER_LOGOUT = "LOGOUT";
const GET_USERLIST = "GET_USERLIST";
const GET_PRODUCTLIST = "GET_PRODUCTLIST";

const ADD_ELEMENT = "ADD_ELEMENT";
const EDIT_ELEMENT = "EDIT_ELEMENT";
const REMOVE_ELEMENT = "REMOVE_ELEMENT";

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

    [ADD_ELEMENT]() {
        console.log('Add succeeded');
    },
    [EDIT_ELEMENT]() {
        console.log('Edit succeeded');
    },
    [REMOVE_ELEMENT]() {
        console.log('Remove succeeded');
    },

    [GET_PRODUCTLIST](state, payload) {
        state.products = payload
    },
    [GET_USERLIST](state, payload) {
        state.users = payload
    },

};

const actions = {
    initFirebase() {
        firebase.initializeApp(apiConfig.firebase);
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

    action_addProduct({commit}, payload) {
        return new firebase.database().ref('/products')
            .push()
            .set(payload)
            .then(() => {
                commit(ADD_ELEMENT);
                return payload;
            })
            .catch((error) => error);
    },

    action_editProduct({commit}, payload) {
        return new firebase.database().ref(`/products/${payload.editElement}`)
            .set(payload.editedResults)
            .then(()=>{
                commit(EDIT_ELEMENT);
                return payload.editedResults;
            })
            .catch((error)=>error);
    },

    action_removeProduct({commit}, index) {
        return new firebase.database().ref('/products')
            .child(index).remove()
            .then(() => {
                commit(REMOVE_ELEMENT);
            })
            .catch((error) => error);
    },

    getProductList({commit}) {
        return new firebase.database().ref('/products').once("value")
            .then((snapshot) => {
                commit(GET_PRODUCTLIST, snapshot.val());
                return snapshot.val();
            })
            .catch((error) => error);
    },

    getUsersList({commit}) {
        return new firebase.database().ref('/users').once("value")
            .then((snapshot) => {
                commit(GET_USERLIST, snapshot.val());
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