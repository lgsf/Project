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
import createPersistedState from "vuex-persistedstate"
import SecureLS from "secure-ls"

var ls = new SecureLS({ isCompression: false })

Vue.use(Vuex)

export const store = new Vuex.Store({
<<<<<<< HEAD
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

=======
    modules: { groups, clients, users, erp, serviceOrders, general, notifications },
    plugins: [
        createPersistedState({
            storage: {
                getItem: (key) => ls.get(key),
                setItem: (key, value) => ls.set(key, value),
                removeItem: (key) => ls.remove(key),
            },
        }),
    ],
>>>>>>> 82b798a3a9c6eddbf6313dae20ecafb5395c1d53
    state: {
        
    },
    mutations: {
        
    },
    actions: {
       
    },
    getters: {
       
    }
})
