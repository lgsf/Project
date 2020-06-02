import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'
import router from '@/router'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        user: null,
        userObj: null,
        isAuthenticated: false,
        successMessage: ''
    },
    mutations: {
        setUser(state, payload) {
            state.user = payload;
            if (!!payload && !!payload.user)
                state.user.uid = payload.user.uid;
        },
        setUserObj(state, payload) {
            state.userObj = payload
            console.log('setei o userObj')
            console.log(state.userObj)
        },
        setIsAuthenticated(state, payload) {
            state.isAuthenticated = payload;
        },
        setSuccessMessage(state, payload) {
            state.successMessage = payload
        }
    },
    actions: {
        userLogin({ commit, dispatch }, { email, password }) {
            firebase
                .auth()
                .signInWithEmailAndPassword(email, password)
                .then(user => {
                    commit('setUser', user);
                    commit('setIsAuthenticated', true);
                    return user
                })
                .then((user) => {
                    dispatch('getUserObj', user)
                })
                .then(() => {
                    router.push('/home');
                })
                .catch((error) => {
                    console.log(error)
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

        getUserObj({ commit }, payload) {
            firebase.firestore().collection("users")
                //.where('email', '==', payload.user.email)
                .get()
                .then(function (querySnapshot) {
                    querySnapshot.forEach(doc => {
                        console.log('encontrei usuario na tabela de usuario')
                        console.log(doc)
                        if (doc.email == payload.user.email) {
                            commit('setUserObj', doc)
                        }
                    });
                })
                .catch(error => {
                    console.log("Error getting documents: ", error);
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
        },
        userObj(state) {
            return state.userObj;
        }
    }
})
