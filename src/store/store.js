import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router/router'

import apiConfig from '../configs/apiConfig';
import firebase from 'firebase';
import 'firebase/firestore';

Vue.use(Vuex);

const USER_LS = "user";
const PENDING_STATUS_ON = 'PENDING_STATUS_ON';
const PENDING_STATUS_OFF = 'PENDING_STATUS_OFF';
const SET_LOGGED_IN = 'SET_LOGGED_IN';
const SET_LOGGED_OFF = 'SET_LOGGED_OFF';
const SAVE_USERS = 'SAVE_USERS';
const SAVE_PRODUCTS = 'SAVE_PRODUCTS';

const state = {
    pending: false,
    isLoggedIn: !!localStorage.getItem(USER_LS),
    user: JSON.parse(localStorage.getItem('user')) || null,
    products: [],
    users: [],
};

const mutations = {
    [PENDING_STATUS_ON](state) {
        state.pending = true
    },

    [PENDING_STATUS_OFF](state) {
        state.pending = false
    },

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
        commit(PENDING_STATUS_ON);
        return new firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
            .then((response) => {
                const settingUser = {
                    email: response.user.email,
                    uid: response.user.uid,
                    status: (response.user.uid === apiConfig.adminKey) ? 'admin' : 'user',
                };

                commit(SET_LOGGED_IN, settingUser);
                commit(PENDING_STATUS_OFF);
            })
            .then(() => {
                dispatch('getUsersList');
            })
    },

    onLogout({commit}) {
        commit(SET_LOGGED_OFF);
        router.push('/signIn');
    },

    loadImages({commit}, dataImg) {
        commit(PENDING_STATUS_ON);
        return new Promise((resolve) => {
            let uploadTask = firebase.storage().ref()
                .child(
                    'images/' +
                    // state.user.uid + '/' +
                    dataImg.dir + '/' +
                    dataImg.productFbId + '/' +
                    dataImg.fileList[0].name
                        .toString())
                .put(dataImg.fileList[0]);

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
                    uploadTask.snapshot.ref.getDownloadURL()
                        .then((downloadURL) => {
                            resolve(downloadURL);
                        });
                }
            );
        });
    },
    deleteImgFromFbStorage(_, payload) {
        console.log(payload);
        return new firebase.storage()
            .ref()
            .child(
                'images/' +
                'products/' +
                payload.editElement + '/' +
                payload.imageName)
            .delete()
    },
    addProduct(_, payload) {
        return new Promise((resolve) => {
            // FIXME: Вся эта цепочка выглядит так, как будто ее можно зачейнить и не оборачивать в промис
            let databaseRef = firebase.database().ref('/products');
            let newProductRef = databaseRef.push();
            newProductRef.set(payload);
            let path = newProductRef.toString();
            resolve(path)
        });
    },

    editProduct(_, payload) {
        return new firebase.database().ref(`/products/${payload.editElement}`)
            .update(payload.editedResults)
            .then(() => payload.editedResults)
    },

    removeProduct(_, index) {
        return new firebase.database().ref('/products')
            .child(index).remove()
            .catch((error) => error);
    },

    getProductList({commit}) {
        commit(PENDING_STATUS_ON);
        return new firebase.database().ref('/products').once("value")
            .then((snapshot) => {
                commit(SAVE_PRODUCTS, snapshot.val());
                commit(PENDING_STATUS_OFF);
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