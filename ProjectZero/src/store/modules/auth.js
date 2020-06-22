import firebase from 'firebase'
import router from '@/router'
import { db, moment } from "@/main"

const state = () => ({
    user: null,
    isAuthenticated: false,
    userName: '',
    userGroup: '',
    sessionStart: undefined
})

const mutations = {
    setUser(state, payload) {
        state.user = payload
        if (!!payload && !!payload.user) {
            state.user.uid = payload.user.uid
            state.sessionStart = moment().unix()
        }
    },
    setIsAuthenticated(state, payload) {
        state.isAuthenticated = payload
    },
    setUserName(state, payload) {
        state.userName = payload
    },
    setUserGroup(state, payload) {
        state.userGroup = payload
    }
}


const actions = {
    userLogin({ commit }, { email, password }) {
        sessionStorage.clear()
        this.dispatch('general/setIsLoading')
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(user => {
                commit('setUser', user)
                commit('setIsAuthenticated', true)
                db.collection("users")
                    .doc(user.uid)
                    .get()
                    .then((snapshots) => {
                        let currentUser = snapshots.data()
                        commit('setUserName', currentUser.name)
                        commit('setUserGroup', currentUser.group_id.id)
                    })
                this.dispatch('general/resetIsLoading')
            })
            .then(() => new Promise(function (resolve) {
                router.push('/home')
                resolve()
            }))
            .catch((error) => {
                console.log(error)
                commit('setUser', null)
                commit('setIsAuthenticated', false)
                this.dispatch('general/resetIsLoading')
                router.push('/')
            });
    },

    userSignOut({ commit, state }) {
        let currentUser = firebase.auth().currentUser
        firebase
            .auth()
            .signOut()
            .then(() => new Promise(resolve => {
                commit('setUser', null)
                commit('setIsAuthenticated', false)
                sessionStorage.clear()
                router.push('/')
                resolve()
            }))
            .then(() => new Promise(resolve => {
                db.collection('userSessionInfo').add({
                    uid: currentUser.uid,
                    sesstion_start: state.sessionStart,
                    session_end: moment().unix()
                }).then(() => resolve())
            }))
            .catch(() => {
                commit('setUser', null)
                commit('setIsAuthenticated', false)
                sessionStorage.clear()
            })
    },

    resetPassword({ commit }, { email }) {
        this.dispatch('general/setIsLoading')
        firebase
            .auth()
            .sendPasswordResetEmail(email)
            .then(() => {
                commit('setUser', null)
                commit('setIsAuthenticated', false)
                this.dispatch('general/resetIsLoading')
                sessionStorage.clear()
                router.push('/')
            })
            .catch(() => {
                commit('setUser', null);
                commit('setIsAuthenticated', false)
                this.dispatch('general/resetIsLoading')
                sessionStorage.clear()
            })
    }


}

const getters = {
    isAuthenticated(state) {
        return state.user !== null && state.user !== undefined
    }

}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
