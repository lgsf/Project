import { db } from "@/main"


const state = () => ({
    isLoading: false,
    loadingNavbar: false,
    successMessage: '',
    errorMessage: '',
    warningMessage: '',
    infoMessage: '',
    links: []
})

const mutations = {
    setIsLoading(state, payload) {
        state.isLoading = payload
    },
    setLoadingNavbar(state, payload) {
        state.loadingNavbar = payload
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
    },
    setLinks(state, payload) {
        state.links = payload
    }
}

const actions = {
    setIsLoading({ commit }) {
        commit('setIsLoading', true)
    },

    resetIsLoading({ commit }) {
        commit('setIsLoading', false)
    },

    setSuccessMessage({ commit }, payload) {
        commit("setSuccessMessage", payload)
    },
    setErrorMessage({ commit }, payload) {
        commit("setErrorMessage", payload)
    },

    setWarningMessage({ commit }, payload) {
        commit("setWarningMessage", payload)
    },

    setInfoMessage({ commit }, payload) {
        commit("setInfoMessage", payload)
    },

    resetAllMessages({ commit }, payload){
        commit("setSuccessMessage", payload)
        commit("setErrorMessage", payload)
        commit("setWarningMessage", payload)
        commit("setInfoMessage", payload)
    },

    loadMenu({ context, commit, rootState }) {
        context = this.dispatch ? this : context
        commit('setLoadingNavbar', true)
        db.collection("groups")
        .doc(rootState.auth.userGroup)
        .get()
        .then((snapshots) => {
          onMenuLoaded(context, snapshots)
          commit('setLoadingNavbar', false)
        })
    }
    
}

function onMenuLoaded(context, payload) {
    let links = []
    let groupData = payload.data()
    links = groupData.menu.sort(function(a, b) {
      return a.order < b.order ? -1 : 1
    })
    context.commit('general/setLinks', links)
  }


const getters = {
    isLoading(state) {
        return state.isLoading
    },
    loadingNavbar(state) {
        return state.loadingNavbar
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

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
