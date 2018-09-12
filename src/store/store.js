import Vue from 'vue'
import Vuex from 'vuex'
import {
    LOGIN,
    LOGIN_SUCCESS,
    LOGOUT,
    USER_LS,
    USER_STATE,
    LOAD_PRODUCTS
} from "./mutations";

import apiConfig from '../apiConfig';
import firebase from 'firebase';
import 'firebase/firestore';

Vue.use(Vuex);

const state = {
    isLoggedIn: !!localStorage.getItem(USER_LS),
    user: JSON.parse(localStorage.getItem('user')) || null,
    products: []
};

const mutations = {
    [LOGIN](state) {
        state.pending = true;
    },
    [LOGIN_SUCCESS](state) {
        state.isLoggedIn = true;
        state.pending = false;
    },
    [LOGOUT](state) {
        state.isLoggedIn = false;
        state.user = null;
        localStorage.clear();
    },
    [USER_STATE](state, payload) {
        state.user = payload
    },
    [LOAD_PRODUCTS](state, payload) {
        state.products = payload
    }
};

const actions = {
    // Auth
    initFirebase() {
        firebase.initializeApp(apiConfig.firebase);
        var auth = firebase.auth();
        auth.onAuthStateChanged(function (user) {
            if (user) {
                // User signed in!
                let uid = user.uid;
                console.log(uid);
            } else {
                // User logged out
            }
        });
    },

    firebaseAuth({commit}, payload) {
        return new Promise((resolve, reject) => {
            firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
                .then((response) => {
                    const settingUser = {
                        email: response.user.email,
                        uid: response.user.uid,
                        status: (response.user.uid === apiConfig.adminKey) ? 'admin' : 'user',
                    };

                    commit(USER_STATE, settingUser);
                    localStorage.setItem(USER_LS, JSON.stringify(settingUser));
                    commit(LOGIN); // show spinner
                    commit(LOGIN_SUCCESS);

                    resolve(settingUser);
                })
                .catch((error) => {
                    console.log(error.code);
                    console.log(error.message);
                    reject();
                })
        });
    },
    logout({commit}) {
        localStorage.removeItem("user");
        commit(LOGOUT);
    },

    getProd({commit}) {
        return new Promise((resolve, reject) => {
            firebase.database().ref('/products').once("value")
                .then((snapshot) => {
                    console.log(snapshot.val());
                    commit(LOAD_PRODUCTS, snapshot.val());
                    resolve(snapshot.val());
                })
                .catch((error) => {
                    console.log(error.message);
                    reject();
                });
        });
    }
};

const getters = {
    // getDBFirebaseProd: () => firebase.database().ref('/products'),
    // getDBFirebaseUsers: () => firebase.database().ref('/users'),
};

export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters
});