import firebase from 'firebase'
import router from '@/router'
import { db, moment } from "@/main"
import catchError from '@/utilities/firebaseErrors'
import Vuetify from '@/plugins/vuetify'

const state = () => ({
    user: null,
    isAuthenticated: false,
    userName: '',
    userGroup: '',
    sessionStart: undefined,
    selectedTheme: null
})

const mutations = {
    setUser(state, payload) {
        state.user = payload
        if (!!payload && !!payload.user) {
            state.user.uid = payload.user.uid
            state.user.email = payload.user.email
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
    },
    setSelectedTheme(state, payload){
        state.selectedTheme = payload
    }
}


const actions = {
    userLogin({ state, commit, dispatch }, { email, password }) {
        this.dispatch('general/setIsLoading')
        this.dispatch('general/resetAllMessages', '')
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
                        commit('setUserGroup', currentUser.group.id)
                        commit('setSelectedTheme', currentUser.selectedTheme)
                        dispatch('changeTheme', state.selectedTheme) 
                    })
                   
            })
            .then(() => new Promise(function (resolve) {
                resolve(router.push('/home'))
                
            }))
            .catch((error) => {
                sessionStorage.clear()
                commit('setUser', null)
                commit('setIsAuthenticated', false)
                this.dispatch('general/resetIsLoading')
                let errorMessage = catchError(error)
                this.dispatch('general/setErrorMessage', errorMessage)
            })
    },

    changeTheme({dispatch}, value){
        if (value == 'Dark'){
            Vuetify.framework.theme.dark = true
            dispatch('general/resetIsLoading', '', {root:true})
        }   
        else {
            Vuetify.framework.theme.dark = false
            dispatch('general/resetIsLoading', '', {root:true})
        }

    },

    changeThemeDB({state, commit}){
        if(state.selectedTheme == 'Light'){
            Vuetify.framework.theme.dark = true
            commit('setSelectedTheme', 'Dark')
            return db.collection("users")
            .doc(state.user.uid)
            .update({
                selectedTheme: 'Dark'
            })
            .catch(error => {
                let errorMessage = catchError(error)
                this.dispatch('general/setErrorMessage', errorMessage)
            })
        }
            
        else {
            Vuetify.framework.theme.dark = false
            commit('setSelectedTheme', 'Light')
            return db.collection("users")
            .doc(state.user.uid)
            .update({
                selectedTheme: 'Light'
            })
            .catch(error => {
                let errorMessage = catchError(error)
                this.dispatch('general/setErrorMessage', errorMessage)
            })
        }
            
            

    },
    

    changePasswordStore({dispatch}, payload){
        var user = firebase.auth().currentUser
        var newPassword = payload
        user.updatePassword(newPassword).then(() => {
            dispatch('general/setSuccessMessage', 'Sua senha foi trocada com sucesso!', {root:true})
        }).catch((error) => {
            let errorMessage = catchError(error)
            dispatch('general/setErrorMessage', errorMessage, {root:true})
        })

    },

    userSignOut({ commit, state }) {
        this.dispatch('general/resetAllMessages')
        db.collection('userSessionInfo').add({
            uid: state.user.uid,
            session_start: state.sessionStart,
            session_end: moment().unix()
        }).then(docRef => {
            if (docRef) {
            firebase
            .auth()
            .signOut()
            .then(() => new Promise(resolve => {
                commit('setUser', null)
                commit('setIsAuthenticated', false)
                commit('setUserGroup', '')
                commit('setUserName', '')
                this.dispatch('general/setSuccessMessage', 'Você saiu com sucesso!')
                resolve(sessionStorage.clear())
                router.push('/')
                }))
              }
             }
            )
            .catch((error) => {
                sessionStorage.clear()
                commit('setUser', null)
                commit('setIsAuthenticated', false)
                this.dispatch('general/resetIsLoading')
                let errorMessage = catchError(error)
                this.dispatch('general/setErrorMessage', errorMessage)
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
                this.dispatch('general/setSuccessMessage', 'Sua senha foi enviada com sucesso!')
                sessionStorage.clear()
                router.push('/')
            })
            .catch((error) => {
                sessionStorage.clear()
                commit('setUser', null)
                commit('setIsAuthenticated', false)
                this.dispatch('general/resetIsLoading')
                let errorMessage = catchError(error)
                this.dispatch('general/setErrorMessage', errorMessage)
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
