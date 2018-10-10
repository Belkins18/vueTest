import Vue from 'vue'
import Vuex from 'vuex'

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
const SAVE_ORDERS = 'SAVE_ORDERS';

const state = {
    pending: false,
    isLoggedIn: !!localStorage.getItem(USER_LS),
    user: JSON.parse(localStorage.getItem('user')) || null,
    products: [],
    orders: [],
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
    [SAVE_ORDERS](state, payload) {
        state.orders = payload
    },
    [SAVE_USERS](state, payload) {
        state.users = payload
    },
};

const actions = {
    /**
     * Инициализирует firebase
     *
     */
    initFirebase() {
        firebase.initializeApp(apiConfig.firebase);
        console.log(firebase)
    },

    /**
     * Action входа пользователя
     *
     * @param
     *  dispatch: getUsersList
     *  commit: [PENDING_STATUS_ON, SET_LOGGED_IN, PENDING_STATUS_OFF]
     *
     * @return {Promise} FBDatabase product key
     *
     */
    userAuth({dispatch, commit}, payload) {
        commit(PENDING_STATUS_ON);

        return new firebase.auth()
            .signInWithEmailAndPassword(payload.email, payload.password)
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

    /**
     * Action выхода пользователя из App
     *
     * @param
     *  commit: [SET_LOGGED_OFF]
     *
     */
    onLogout({commit}) {
        commit(SET_LOGGED_OFF);
    },

    /**
     * Загружает картинки в firebase.storage
     *
     * @param
     *  commit: [PENDING_STATUS_ON, SET_LOGGED_IN, PENDING_STATUS_OFF]
     *  dataImg: {dir, fileList, fileReader, isFlag, productFBid}
     *
     * @return {String} URL FBDatabase product key
     *
     */
    loadImages({commit}, dataImg) {
        commit(PENDING_STATUS_ON);

        console.log(dataImg);

        return new Promise((resolve) => {
            let uploadTask = firebase.storage().ref()
                .child(`images/${ dataImg.dir}/${ dataImg.productFbId}/${dataImg.file.name}`)
                .put(dataImg.file);

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

    /**
     * Удаляет картинки из firebase.storage
     *
     * @param
     *  payload: {dir, fileList, fileReader, isFlag, productFBid}
     *
     */
    deleteImgFromFbStorage(_, payload) {
        return new firebase.storage()
            .ref()
            .child(`images/products/${payload.editElement}/${payload.imageName}`).delete()
    },

    /**
     * Action добавления продукта
     */
    addProduct(_, payload) {
        return new Promise((resolve) => {
            let databaseRef = firebase.database().ref('/products');
            let newProductRef = databaseRef.push();

            newProductRef.set(payload);
            let path = newProductRef.toString();

            resolve(path)
        });
    },
    /**
     * Action создания ордера
     */
    createOrder(_, payload) {
        return new Promise((resolve) => {
            let databaseRef = firebase.database().ref('/orders');
            let newOrderRef = databaseRef.push();

            newOrderRef.set(payload);
            let path = newOrderRef.toString();

            resolve(path)
        });
    },

    /**
     * Action редактирования продукта
     */
    editProduct(_, payload) {
        return new firebase.database()
            .ref(`/products/${payload.editElement}`)
            .update(payload.editedResults)
            .then(() => payload.editedResults)
    },

    /**
     * Action редактирования продукта
     */
    editOrder(_, payload) {
        return new firebase.database()
            .ref(`/orders/${payload.editElement}`)
            .update(payload.editedResults)
            .then(() => payload.editedResults)
    },

    /**
     * Action удаления продукта
     */
    removeProduct(_, index) {
        return new firebase.database()
            .ref('/products')
            .child(index).remove()
            .catch((error) => error);
    },

    /**
     * Action получение снимка (списка) продуктов
     */
    getProductList({commit}) {
        commit(PENDING_STATUS_ON);

        return new firebase.database()
            .ref('/products')
            .once("value")
            .then((snapshot) => {
                commit(SAVE_PRODUCTS, snapshot.val());
                commit(PENDING_STATUS_OFF);

                return snapshot.val();
            })
    },
    /**
     * Action получение снимка (списка) продуктов
     */
    getOrderList({commit}) {
        commit(PENDING_STATUS_ON);

        return new firebase.database()
            .ref('/orders')
            .once("value")
            .then((snapshot) => {
                commit(SAVE_ORDERS, snapshot.val());
                commit(PENDING_STATUS_OFF);
                return snapshot.val();
            })
    },
    /**
     * Action получение снимка (списка) всех пользователей
     */
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