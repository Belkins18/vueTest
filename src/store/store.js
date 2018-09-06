import Vue from 'vue'
import Vuex from 'vuex'
import {
    LOGIN,
    LOGIN_SUCCESS,
    LOGOUT,
    USER_LS,
    USER_STATE
} from "./mutations";

import apiConfig from '../apiConfig';
import firebase from 'firebase';

Vue.use(Vuex);

const state = {
    isLoggedIn: !!localStorage.getItem(USER_LS),
    user: JSON.parse(localStorage.getItem('user')) || null
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
    }
};

const actions = {
    // Auth
    initFirebase() {
        firebase.initializeApp(apiConfig.firebase);
    },
    firebaseAuth({commit}, payload) {
        return new Promise((resolve, reject) => {
            firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
                .then((response) => {
                    const settingUser = {
                        email: response.user.email,
                        uid: response.user.uid,
                        status: (response.user.uid === apiConfig.adminKey) ? 'admin' : 'user'
                    };

                    commit(USER_STATE, settingUser);
                    localStorage.setItem(USER_LS, JSON.stringify(settingUser));
                    commit(LOGIN); // show spinner
                    commit(LOGIN_SUCCESS);
                    resolve();
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

    // Database
    initDataBase() {
        let database = firebase.database();
        console.log(database);
        console.log(database.ref());
    }
};

export default new Vuex.Store({
    state,
    mutations,
    actions,
})