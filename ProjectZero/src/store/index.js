import Vue from 'vue'
import Vuex from 'vuex'
import { db } from '@/main'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    loadedConfiguration: {
      id: '',
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
    setConfiguration(state, payload) {
      state.loadedConfiguration = payload
    },
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
    loadConfiguration({ commit }) {
      db.collection('systemConfiguration').get()
        .then(
          (snapshot) => {
            snapshot.forEach(config => {
              let appData = config.data()
              let configurations = {
                id: config.id,
                selectedTheme: appData.theme_code,
                companyName: appData.company_name,
                companyContact: appData.company_phone,
                companyEmail: appData.company_email,
                image: null,
                imageUrl: ''
              }
              commit('setConfiguration', configurations)
            })
          })
    },
    saveConfiguration({ commit }, payload) {
      console.log(payload)
      commit('setLoading', true)
      commit('clearError')
      const configuration = {
        theme_code: payload.selectedTheme,
        company_name: payload.companyName,
        company_phone: payload.companyContact,
        company_email: payload.companyEmail
      }

      db.collection('systemConfiguration').doc(payload.id).update(configuration)
      commit('setLoading', false)
    }
  },
  modules: {
  },
  getters: {
    getConfiguration(state) {
      return state.loadedConfiguration
    },
    loading(state) {
      return state.loading
    },
    error(state) {
      return state.error
    }
  }
})
