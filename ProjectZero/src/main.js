import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import firebase from "firebase";
import VueTextareaAutosize from 'vue-textarea-autosize'
import AlertCmp from './components/shared/Alert.vue'
import { store } from './store'
import IdleVue from "idle-vue"
export const moment = require('moment')

const eventsHub = new Vue()

Vue.use(IdleVue, {
  eventEmitter: eventsHub,
  store,
  idleTime: 20 * 60 * 1000,
  startAtIdle: false
})

Vue.use(VueTextareaAutosize)
Vue.config.productionTip = false

firebase.initializeApp({
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_DATABASE_URL,
  projectId: process.env.VUE_APP_PROJECT_ID,
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGE_SENDER_ID,
  appId: process.env.VUE_APP_APP_ID
})


export const db = firebase.firestore()
export const fileStorage = firebase.storage()
export const auth = firebase.auth()

// To avoid some annoying warning
// https://github.com/vuetifyjs/vuetify/issues/9999
const ignoreWarnMessage = 'The .native modifier for v-on is only valid on components but it was used on <div>.'
Vue.config.warnHandler = function (msg, vm, trace) {
  trace
  if (msg === ignoreWarnMessage) {
    msg = null
    vm = null
    trace = null
  }
}

Vue.component('app-alert', AlertCmp)

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')

