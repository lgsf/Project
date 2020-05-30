import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    loadedConfiguration: {
      selectedTheme: 1,
      companyName: '',
      companyContact: '',
      companyEmail: '',
      image: null,
      imageUrl: ''
    },
    error: null,
    loading: false
  },
  mutations: {
    setLoading(state, payload) {
      state.loading = payload
    },
    setError(state, payload) {
      state.error = payload
    },
    clearError(state) {
      state.error = null
    }
  },
  actions: {
    saveConfiguration({ commit }, payload) {
      commit('setLoading', true)
      commit('clearError')
      const configuration = {
        theme_code: payload.themeCode
      }
      console.log(configuration.theme_code)
      commit('setLoading', false)
    }
  },
  modules: {
  },
  getters: {
    loadConfiguration(state) {
      return state.loadConfiguration
    },
    loading(state) {
      return state.loading
    },
    error(state) {
      return state.error
    }
  }
})
