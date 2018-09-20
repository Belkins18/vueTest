import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router/router'

import apiConfig from '../apiConfig';
import firebase from 'firebase';
import 'firebase/firestore';


Vue.use(Vuex);

const USER_LS = "user";
const SET_LOGGED_IN = 'SET_LOGGED_IN ';
const SET_LOGGED_OFF = "SET_LOGGED_OFF";
const SAVE_USERS = "SAVE_USERS";
const SAVE_PRODUCTS = "SAVE_PRODUCTS";

const state = {
    isLoggedIn: !!localStorage.getItem(USER_LS),
    user: JSON.parse(localStorage.getItem('user')) || null,
    products: [],
    users: [],
    error: ''
};

const mutations = {
    [SET_LOGGED_IN](state, payload) {
        state.loading = false;
        state.isLoggedIn = true;
        state.user = payload;
        state.error = '';

        localStorage.setItem(USER_LS, JSON.stringify(payload));
    },
    [SET_LOGGED_OFF](state) {
        state.isLoggedIn = false;
        state.user = null;
        state.users = [];
        state.products = [];

        localStorage.removeItem(USER_LS);
        localStorage.clear();
    },

    [SAVE_PRODUCTS](state, payload) {
        state.products = payload
    },
    [SAVE_USERS](state, payload) {
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

                commit(SET_LOGGED_IN, settingUser);
            })
            .then(() => {
                dispatch('getUsersList')
            })
    },

    logout({commit}) {
        commit(SET_LOGGED_OFF);
        console.log(router.push('/signIn'));
        // this.$router.push({name: this.signInPage});
    },
    loadImages(_, dataImg) {
        console.log(dataImg);
        console.log(dataImg.fileList);
        console.log(dataImg.fileList[0].name);
        return new Promise((resolve) => {
            let storageRef = firebase.storage().ref();
            let basePath = 'images/';
            let dirPath = `${basePath}${dataImg.dir}/`;
            let uploadTask = storageRef.child(`${dirPath}${dataImg.fileList[0].name}`.toString()).put(dataImg.fileList[0]);
            uploadTask.on('state_changed',
                (snapshot) => {
                    let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case firebase.storage.TaskState.PAUSED: // or 'paused'
                            break;
                        case firebase.storage.TaskState.RUNNING: // or 'running'
                            break;
                    }
                },
                (error) => error,
                () => {
                    // return new Promise((resolve) => {
                    uploadTask.snapshot.ref.getDownloadURL()
                        .then((downloadURL) => {
                            resolve(downloadURL)
                        });
                    // });
                }
            );
        });

    },
    addProduct(_, payload) {
        let databaseRef = firebase.database().ref('/products');
        return new firebase.database().ref('/products')
            .push()
            .set(payload)
            .then(() => {
                   databaseRef.on('value', function(snapshot) {
                       const data = snapshot.val() || null;
                       if (data) {
                           return Object.keys(data)[0];
                       }
                   });
                   return payload;
            });
    },

    editProduct(_, payload) {
        console.log(payload.editedResults);
        console.log(payload.editElement);
        return new firebase.database().ref(`/products/${payload.editElement}`)
            .set(payload.editedResults)
            .then(() => payload.editedResults)
    },

    removeProduct(_, index) {
        return new firebase.database().ref('/products')
            .child(index).remove()
            .catch((error) => error);
    },

    getProductList({commit}) {
        return new firebase.database().ref('/products').once("value")
            .then((snapshot) => {
                commit(SAVE_PRODUCTS, snapshot.val());
                return snapshot.val();
            })
    },

    getUsersList({commit}) {
        return new firebase.database().ref('/users').once("value")
            .then((snapshot) => {
                commit(SAVE_USERS, snapshot.val());
                return snapshot.val();
            })
    },
};

export default new Vuex.Store({
    state,
    mutations,
    actions,
});