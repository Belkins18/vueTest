import Vue from 'vue'
import Vuex from 'vuex'
import {
    LOGIN,
    LOGIN_SUCCESS,
    LOGOUT,
    USER_LS
} from "./mutations";

import apiConfig from '../apiConfig';
import firebase from 'firebase';

Vue.use(Vuex);

const state = {
    dbFirebase: {
        connect: {
            apiConfig: false,
            firebase: false
        }
    },
    isLoggedIn: !!localStorage.getItem(USER_LS),
    user: null
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
    firebaseLoad(state) {
        state.dbFirebase.connect.firebase = true;
        state.dbFirebase.connect.apiConfig = true;
    },
    authenticateAttributes(state, {email, password}) {
        console.log(email);
        console.log(password);
    },
    setUser(state, payload) {
        state.user = payload
    }

};

const actions = {
    initFirebase({commit}) {
        firebase.initializeApp(apiConfig.firebase);
        console.log(firebase);
        commit('firebaseLoad');
    },
    getLocalStorage({commit}) {
        let userData = JSON.parse(localStorage.getItem(USER_LS));
        commit('setUser', userData);
    },
    firebaseAuth({commit}, payload) {
        commit('authenticateAttributes', payload);

        let userInputVal = {
            email: payload.email,
            password: payload.password
        };

        firebase.auth().signInWithEmailAndPassword(userInputVal.email, userInputVal.password)
            .then(response => {
                function getStatus() {
                    return (response.user.uid === apiConfig.adminKey) ? 'admin' : 'user'
                }

                const settingUser = {
                    email: response.user.email,
                    uid: response.user.uid,
                    status: getStatus()
                };

                commit('setUser', settingUser);
                localStorage.setItem(USER_LS, JSON.stringify(settingUser));

                commit(LOGIN); // show spinner
                commit(LOGIN_SUCCESS);
            })
            .catch((error) => {
                console.log(error.code);
                console.log(error.message);
            })
    },
    login({commit}) {
        commit(LOGIN); // show spinner
        return new Promise(resolve => {
            commit(LOGIN_SUCCESS);
            resolve();
        });
    },
    logout({commit}) {
        localStorage.removeItem("user");
        commit(LOGOUT);
    }
};

export default new Vuex.Store({
    state,
    mutations,
    actions,
})