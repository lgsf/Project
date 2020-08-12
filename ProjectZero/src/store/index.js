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
import calendar from './modules/calendar'
import createPersistedState from "vuex-persistedstate"
import { vuexfireMutations,  firestoreAction  } from 'vuexfire'
import { db } from "@/main"

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: { auth, groups, clients, users, erp, serviceOrders, general, notifications, productivity, management, setup, calendar},
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
      paths: ['auth.isAuthenticated', 'auth.userName', 'auth.userGroup', 'auth.user.email', 'auth.user.uid', 'auth.sessionStart', 'general.links', 'serviceOrders']
    })
  ],

  state: {
    newNotificationsUser: [],
    newNotificationsGroup: []

  },
  mutations: {
  ...vuexfireMutations
  },
  actions: {
    getNotificationsToUser: firestoreAction(({ bindFirestoreRef, state }) => {
       bindFirestoreRef('newNotificationsUser', db.collection('notifications')
      .where("userIds", "array-contains", state.auth.user.uid)) 
    })
  },
  getters: {

  }
})
