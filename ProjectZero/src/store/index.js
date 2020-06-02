import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'
import router from '@/router'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        user: null,
        isAuthenticated: false,
        successMessage: ''
    },
    mutations: {
        setUser(state, payload) {
            state.user = payload;
            if (!!payload && !!payload.user)
                state.user.uid = payload.user.uid;
        },
        setIsAuthenticated(state, payload) {
            state.isAuthenticated = payload;
        },
        setSuccessMessage(state, payload) {
            state.successMessage = payload
        }
    },
    actions: {
        userLogin({ commit }, { email, password }) {
            firebase
                .auth()
                .signInWithEmailAndPassword(email, password)
                .then(user => {
                    commit('setUser', user);
                    commit('setIsAuthenticated', true);
                    router.push('/home');
                })
                .catch(() => {
                    commit('setUser', null);
                    commit('setIsAuthenticated', false);
                    router.push('/');
                });
        },

        userSignOut({ commit }) {
            firebase
                .auth()
                .signOut()
                .then(() => {
                    commit('setUser', null);
                    commit('setIsAuthenticated', false);
                    router.push('/');
                })
                .catch(() => {
                    commit('setUser', null);
                    commit('setIsAuthenticated', false);
                    router.push('/');
                });
        },

        userSignUp({ commit }, payload) {
            firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
                .then(function (userRecord) {
                    commit('setSuccessMessage', 'Usuario criado com sucesso: ' + userRecord.name);
                })
                .catch(function (error) {
                    commit('setErrorMessage', 'Erro ao tentar criar o usuário: ' + error.message);
                });
        },

        resetPassword({ commit }, { email }) {
            firebase
                .auth()
                .sendPasswordResetEmail(email)
                .then(() => {
                    commit('setUser', null);
                    commit('setIsAuthenticated', false);
                    router.push('/');
                })
                .catch(() => {
                    commit('setUser', null);
                    commit('setIsAuthenticated', false);
                    router.push('/');
                });
        }

    },
    getters: {
        isAuthenticated(state) {
            return state.user !== null && state.user !== undefined;
        }

    }
})
