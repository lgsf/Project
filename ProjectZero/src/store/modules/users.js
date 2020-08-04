import { db } from "@/main"
import catchError from '@/utilities/firebaseErrors'
import { functions } from '@/main'

const state = () => ({
    search: '',
    showEditModal: false,
    selected: '',
    editUserName: '',
    editUserEmail: '',
    editUserPhone: '',
    editUserBirthDate: '',
    editUserGroup: {},
    userList: [],
    userListModified:[],
    userJustMe:[],
    userGroups: []

})

const mutations = {
    setUserGroups(state, payload) {
        state.userGroups = payload
    },

    setUserList( state, payload) {
        state.userList = payload
        
    },
    setUserListModified( state, payload) {
        state.userListModified = payload
        
    },
    setJustMeList( state, payload) {
        state.userJustMe = payload
        
    },
    editUser(state, payload) {
        let anySelected = state.selected 
        state.editUserName = anySelected ? state.selected.name : ''
        state.editUserEmail= anySelected ? state.selected.email : ''
        state.editUserPhone= anySelected ? state.selected.phone : ''
        state.editUserBirthDate = anySelected ? state.selected.birth_date :''
        state.editUserGroup = anySelected ? state.selected.group : {}
        state.showEditModal = payload
    },

    setSelectedUser(state, payload) {
        state.selected = payload
    },

    setShowEditModal(state, payload) {
        state.showEditModal = payload
    },

    setName(state, payload) {
        state.editUserName = payload
    },

    setEmail(state, payload) {
        state.editUserEmail = payload
    },

    setPhone(state, payload) {
        state.editUserPhone = payload
    },

    setBirthDate(state, payload) {
        state.editUserBirthDate = payload
    },
    setGroup(state, payload) {
        state.editUserGroup = payload
    },

}

const actions = {
    readGroups({ commit }) { 
        db.collection("groups")
            .get()
            .then(querySnapshot => {
                let userGroups = []
                querySnapshot.forEach(doc => {
                    userGroups.push({
                        name: doc.data().name,
                        id: doc.id
                    })
                })
                commit('setUserGroups', userGroups)
            })
            .catch(error => {
                let errorMessage = catchError(error)
                this.dispatch('general/setErrorMessage', errorMessage)
            })
    },

    readUsers({rootState, context}, payload) {
        context = this.dispatch ? this : context
        if (payload) {
            context.dispatch('general/setIsLoading')
            context.dispatch('general/resetAllMessages', '')
        }
        
        context.dispatch('users/readGroups').then(() => {
            db.collection("users")
                .get()
                .then(function (snapshots) {
                    onUsersLoaded(context, rootState, snapshots)
                    if (payload)
                        context.dispatch('general/resetIsLoading')
                })
                .catch(error => {
                    let errorMessage = catchError(error)
                    this.dispatch('general/setErrorMessage', errorMessage)
                })
            })
    },

    onSelectedUser({ commit }, payload) {
        commit('setSelectedUser', payload)
        commit('editUser', true)
    },

    openEditUserModal({ commit }) {
        commit('editUser', true)
    },

    setName({ commit }, payload) {
        commit('setName', payload)
    },

    setEmail({ commit }, payload) {
        commit('setEmail', payload)
    },

    setPhone({ commit }, payload) {
        commit('setPhone', payload)
    },

    setBirthDate({ commit }, payload) {
        commit('setBirthDate', payload)
    },

    setGroup({ commit }, payload) {
        commit('setGroup', payload)
    },

    closeEditUserModal({ commit }) {
        commit('setShowEditModal', false)
        commit('setSelectedUser', '')
        commit('setBirthDate', '')
    },

    save({ state, dispatch }) {
        if (!state.selected)
            createUser(state).then(() => {
                dispatch('readUsers', true)
                dispatch('closeEditUserModal')
                if (Object.keys(state.editUserGroup).length == Object.keys({}).length)
                    dispatch('general/setWarningMessage', 'Usuário criado com sucesso, porém nennhum grupo foi atribuído à ele!', {root: true})
                else 
                    dispatch('general/setSuccessMessage', 'Usuário criado com sucesso!', {root: true})
            })
        else
            updateUser(state).then(() => {
                dispatch('readUsers', true)
                dispatch('closeEditUserModal')
                if (Object.keys(state.editUserGroup).length == Object.keys({}).length)
                    dispatch('general/setWarningMessage', 'Usuário modificado com sucesso, porém nennhum grupo foi atribuído à ele!', {root: true})
                else 
                    dispatch('general/setSuccessMessage', 'Usuário modificado com sucesso!', {root: true})

            })
    }

}

function onUsersLoaded(context, rootState, payload) {
    let users = []
    let usersModified = []
    let usersJustMe = []
    payload.forEach(userSnapShot => {
        let userData = userSnapShot.data()
        userData.id = userSnapShot.id
        users.push(userData)
    })
    context.commit('users/setUserList', users)
    usersModified = users.filter(obj => obj.id !== rootState.auth.user.uid )
    usersJustMe = users.filter(obj => obj.id == rootState.auth.user.uid )
    context.commit('users/setUserListModified', usersModified)
    context.commit('users/setJustMeList', usersJustMe)
}


function createUser(state) {
    let saveUser = functions.httpsCallable('saveUser')
    return new Promise(function (resolve, reject) {
        if (!state)
            reject(state)
        else
            resolve(saveUser(state))    
    })
}

function updateUser(state) {
    return db.collection("users")
        .doc(state.selected.id)
        .update({
            name: state.editUserName,
            email: state.editUserEmail,
            phone: state.editUserPhone,
            birth_date: state.editUserBirthDate,
            group: state.editUserGroup,
        })
        .catch(error => {
            let errorMessage = catchError(error)
            this.dispatch('general/setErrorMessage', errorMessage)
        })

}


const getters = {
    filterUsersById(state) {
        return (ids) => state.userList.filter(user => ids.includes(user.id))
    },
    getUserByEmail(state) {
        return (email) => state.userList.filter(user => email == user.email)
    }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}