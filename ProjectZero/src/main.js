import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import firebase from "firebase";
import VueTextareaAutosize from 'vue-textarea-autosize'
import AlertCmp from './components/shared/Alert.vue'
import { store } from './store'
import IdleVue from "idle-vue"

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
  apiKey: "AIzaSyDcPbYSZw_pmc6nQl6MTTZ2LUIXwt6Tu_g",
  authDomain: "projectzero-9bff2.firebaseapp.com",
  databaseURL: "https://projectzero-9bff2.firebaseio.com",
  projectId: "projectzero-9bff2",
  storageBucket: "gs://projectzero-9bff2.appspot.com",
  messagingSenderId: "793390803395",
  appId: "1:793390803395:web:6526a11dff48740bb03576"
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

