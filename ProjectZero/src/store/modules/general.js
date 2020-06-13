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

    setSuccessMessage(context, payload) {
        context.commit("setSuccessMessage", payload)
    },
    setErrorMessage(context, payload) {
        context.commit("setErrorMessage", payload)
    },

    setWarningMessage(context, payload) {
        context.commit("setWarningMessage", payload)
    },

    setInfoMessage(context, payload) {
        context.commit("setInfoMessage", payload)
    }
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
