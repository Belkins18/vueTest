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

Vue.use(Vuex)

const state = {
  dbFirebase: {
    connect: {
      apiConfig: false,
      firebase: false
    }
  },
  isLoggedIn: !!localStorage.getItem("user"),
  localStorage: {
    email: '',
    uid: ''
  }
};

const mutations = {
  dataTOLS(state) {
    if (JSON.parse(localStorage.getItem(USER_LS))) {
      state.localStorage.email = JSON.parse(localStorage.user).email;
      state.localStorage.uid = JSON.parse(localStorage.user).uid;
    }
  },
  [LOGIN](state) {
    state.pending = true;
  },
  [LOGIN_SUCCESS](state) {
    state.isLoggedIn = true;
    state.pending = false;
    state.localStorage.email = JSON.parse(localStorage.user).email;
    state.localStorage.uid = JSON.parse(localStorage.user).uid;
  },
  [LOGOUT](state) {
    state.isLoggedIn = false;
  },
  firebaseLoad(state) {
    state.dbFirebase.connect.firebase = true;
    state.dbFirebase.connect.apiConfig = true;
  },
  authenticateAttributes(state, {
    email,
    password
  }) {
    localStorage.setItem('inputMail', email);
    localStorage.setItem('inputPwd', password)
  }

};

const actions = {
  checkDataLS({
    commit
  }) {
    commit('dataTOLS');
  },
  initFirebase({
    commit
  }) {
    firebase.initializeApp(apiConfig.firebase);
    console.log(firebase);
    commit('firebaseLoad');
  },
  firebaseAuth({
    commit
  }, payload) {
    if (state.dbFirebase.connect.apiConfig === true && state.dbFirebase.connect.firebase === true) {
      commit('authenticateAttributes', payload);

      let userInputVal = {
        email: payload.email,
        password: payload.password
      };

      firebase.auth().signInWithEmailAndPassword(userInputVal.email, userInputVal.password)
        .then(response => {
          const settingUser = {
            email: response.user.email,
            uid: response.user.uid,
          };
          localStorage.setItem('user', JSON.stringify(settingUser));
          console.log(localStorage);
          console.log(response);
          commit(LOGIN); // show spinner
          return new Promise(resolve => {
            setTimeout(() => {
              commit(LOGIN_SUCCESS);
              resolve();
            }, 1000);
          });
        })
        .catch((error) => {
          console.log(error.code);
          console.log(error.message);
        })
    }
    // console.log(ac)
  },
  login({
    commit
  }) {
    commit(LOGIN); // show spinner
    return new Promise(resolve => {
      commit(LOGIN_SUCCESS);
      resolve();
    });
  },
  logout({
    commit
  }) {
    localStorage.removeItem("user");
    commit(LOGOUT);
  }
};
const getters = {
  isLoggedIn: (state) => {
    return state.isLoggedIn
  }
};

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})