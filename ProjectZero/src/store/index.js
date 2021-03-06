import Vue from 'vue'
import Vuex from 'vuex'
import groups from './modules/groups'
import clients from './modules/clients'
import users from './modules/users'
import auth from './modules/auth'
import erp from './modules/erp'
import serviceOrders from './modules/serviceOrders'
import general from './modules/general'
import notifications from './modules/notifications'
import productivity from './modules/productivity'
import management from './modules/management'
import setup from './modules/setup'
import createPersistedState from "vuex-persistedstate"

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: { auth, groups, clients, users, erp, serviceOrders, general, notifications, productivity, management, setup },
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
      paths: ['auth.isAuthenticated', 'auth.userName', 'auth.userGroup', 'auth.user.email', 'auth.user.uid', 'auth.sessionStart', 'general.links']
    })
  ],

  state: {

  },
  mutations: {

  },
  actions: {

  },
  getters: {

  }
})
