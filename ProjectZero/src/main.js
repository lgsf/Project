import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import firebase from "firebase";
import VueTextareaAutosize from 'vue-textarea-autosize'

Vue.use(VueTextareaAutosize)

Vue.config.productionTip = false

firebase.initializeApp({
  apiKey: "AIzaSyDcPbYSZw_pmc6nQl6MTTZ2LUIXwt6Tu_g",
  authDomain: "projectzero-9bff2.firebaseapp.com",
  databaseURL: "https://projectzero-9bff2.firebaseio.com",
  projectId: "projectzero-9bff2",
  storageBucket: "projectzero-9bff2.appspot.com",
  messagingSenderId: "793390803395",
  appId: "1:793390803395:web:6526a11dff48740bb03576"
});

export const db = firebase.firestore()

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')

