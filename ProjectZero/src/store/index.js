import Vue from 'vue'
import Vuex from 'vuex'
import groups from './modules/groups'
import clients from './modules/clients'
import users from './modules/users'
import auth from './modules/auth'
import erp from './modules/erp'
import productionOrders from './modules/productionOrders'
import general from './modules/general'
import notifications from './modules/notifications'
import createPersistedState from "vuex-persistedstate"
import SecureLS from "secure-ls"

var ls = new SecureLS({ isCompression: false })

Vue.use(Vuex)

export const store = new Vuex.Store({
    modules: { auth, groups, clients, users, erp, productionOrders, general, notifications },
    plugins: [
        createPersistedState({
          storage: {
            getItem: (key) => ls.get(key),
            setItem: (key, value) => ls.set(key, value),
            removeItem: (key) => ls.remove(key),
          },
          path: {}
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
