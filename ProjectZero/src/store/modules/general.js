const state = () => ({
    isLoading: false,
    loadingNavbar: false,
    successMessage: '',
    errorMessage: '',
    warningMessage: '',
    infoMessage: ''
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
    }
}

const actions = {
    setIsLoading({ commit }) {
        commit('setIsLoading', true)
    },

    resetIsLoading({ commit }) {
        commit('setIsLoading', false)
    },

    setLoadingNavbar({ commit }) {
        commit('setLoadingNavbar', true)
    },

    stopLoadingNavbar({ commit }) {
        commit('setLoadingNavbar', false)
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
