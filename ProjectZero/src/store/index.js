import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'
import router from '@/router'

import groups from './modules/groups'
import clients from './modules/clients'
import users from './modules/users'
import erp from './modules/erp'
import productionOrders from './modules/productionOrders'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

export const store = new Vuex.Store({
    modules: { groups, clients, users, erp, productionOrders },
    plugins: [createPersistedState()],
    state: {
        user: null,
        userObj: null,
        isAuthenticated: false,
        loading: false,
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
        setLoading(state, payload){
            state.loading = payload
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
            commit('setLoading', true) 
            firebase
                .auth()
                .signInWithEmailAndPassword(email, password)
                .then(user => {
                    commit('setLoading', false) 
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
                    commit('setLoading', false) 
                    commit('setUser', null)
                    commit('setIsAuthenticated', false)
                    commit('setErrorMessage', 'Erro ao tentar fazer o login: ' + error.message )
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
            commit('setLoading', true) 
            firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
                .then(function (userRecord) {
                    commit('setLoading', false) 
                    commit('setSuccessMessage', 'Usuario criado com sucesso: ' + userRecord.name)
                })
                .catch(function (error) {
                    commit('setLoading', false) 
                    commit('setErrorMessage', 'Erro ao tentar criar o usuário: ' + error.gmessage)
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

        isLoading({commit}){
            commit('setLoading', true) 
        },

        finishedLoading({commit}){
            commit('setLoading', false)
        },

        resetPassword({ commit }, { email }) {
            commit('setLoading', true) 
            firebase
                .auth()
                .sendPasswordResetEmail(email)
                .then(() => {
                    commit('setLoading', false) 
                    commit('setUser', null)
                    commit('setIsAuthenticated', false)
                    router.push('/')
                })
                .catch(() => {
                    commit('setLoading', false) 
                    commit('setUser', null);
                    commit('setIsAuthenticated', false)
                    router.push('/')
                })
        }

    },
    getters: {
        isAuthenticated(state) {
            return state.user !== null && state.user !== undefined
        },
        loading(state){
            return state.loading
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
