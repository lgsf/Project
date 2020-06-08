const state = () => ({
    isLoading: false,
    loadingNavbar: false,
});

const mutations = {
    setIsLoading(state, payload) {
        state.isLoading = payload
    },
    setLoadingNavbar(state, payload) {
        state.loadingNavbar = payload
    },
};

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
};

const getters = {
    isLoading(state) {
        return state.isLoading
    },
    loadingNavbar(state) {
        return state.loadingNavbar
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
