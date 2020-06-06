import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'
import router from '@/router'

import groups from './modules/groups'
import clients from './modules/clients'
import erp from './modules/erp'
import productionOrders from './modules/productionOrders'

Vue.use(Vuex)

export const store = new Vuex.Store({
    modules: { groups, clients, erp, productionOrders },
    state: {
        user: null,
        userObj: null,
        isAuthenticated: false,
        successMessage: '',
        errorMessage: '',
        warningMessage: '',
        infoMessage: ''
    },
    mutations: {
        setUser(state, payload) {
            state.user = payload
            if (!!payload && !!payload.user)
                state.user.uid = payload.user.uid
        },
        setUserObj(state, payload) {
            state.userObj = payload
        },
        setIsAuthenticated(state, payload) {
            state.isAuthenticated = payload
        },
        setSuccessMessage(state, payload) {
            state.successMessage = payload
        },
        setErrorMessage(state, payload) {
            state.errorMessage = payload
        }
        ,
        setWarningMessage(state, payload) {
            state.warningMessage = payload
        }
        ,
        setInfoMessage(state, payload) {
            state.infoMessage = payload
        }
    },
    actions: {
        userLogin({ commit, dispatch }, { email, password }) {
            commit('setSuccessMessage', null)
            commit('setErrorMessage', null)
            firebase
                .auth()
                .signInWithEmailAndPassword(email, password)
                .then(user => {
                    commit('setUser', user)
                    commit('setIsAuthenticated', true)
                    return user
                })
                .then((user) => {
                    dispatch('getUserObj', user)
                })
                .then(() => {
                    router.push('/home')
                })
                .catch((error) => {
                    console.log(error)
                    commit('setUser', null)
                    commit('setIsAuthenticated', false)
                    commit('setErrorMessage', 'Erro ao tentar fazer o login: ' + error.message)
                    router.push('/')
                })
        },

        userSignOut({ commit }) {
            firebase
                .auth()
                .signOut()
                .then(() => {
                    commit('setUser', null)
                    commit('setIsAuthenticated', false)
                    commit('setSuccessMessage', 'Sessão encerrada com sucesso.')
                    router.push('/')
                })
                .catch(() => {
                    commit('setUser', null)
                    commit('setIsAuthenticated', false)
                    router.push('/')
                })
        },

        userSignUp({ commit }, payload) {
            firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
                .then(function (userRecord) {
                    commit('setSuccessMessage', 'Usuario criado com sucesso: ' + userRecord.name)
                })
                .catch(function (error) {
                    commit('setErrorMessage', 'Erro ao tentar criar o usuário: ' + error.message)
                })
        },

        getUserObj({ commit }, payload) {
            firebase.firestore().collection("users")
                .get()
                .then(function (querySnapshot) {
                    querySnapshot.forEach(doc => {
                        if (doc.email == payload.user.email) {
                            commit('setUserObj', doc)
                        }
                    })
                })
                .catch(error => {
                    console.log("Erro ao buscar os usuários: ", error.message)
                })

        },

        resetPassword({ commit }, { email }) {
            firebase
                .auth()
                .sendPasswordResetEmail(email)
                .then(() => {
                    commit('setUser', null);
                    commit('setIsAuthenticated', false);
                    router.push('/')
                })
                .catch(() => {
                    commit('setUser', null);
                    commit('setIsAuthenticated', false);
                    router.push('/')
                })
        }

    },
    getters: {
        isAuthenticated(state) {
            return state.user !== null && state.user !== undefined
        },
        userObj(state) {
            return state.userObj
        },
        successMessage(state) {
            return state.successMessage
        },
        errorMessage(state) {
            return state.errorMessage
        },
        warningMessage(state) {
            return state.warningMessage
        },
        infoMessage(state) {
            return state.infoMessage
        }
    }
})
