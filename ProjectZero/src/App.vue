<template>
  <v-app class="grey lighten-4">
    <Navbar v-if="isAuthenticated()" />
    <v-content class="mx-5 mb-5">
      <router-view></router-view>
     </v-content>
     <Footer />
  </v-app>
</template>

<script>
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import firebase from "firebase";

export default {
  
  components: { Navbar, Footer },

  name: "App",

  data() {
    return {};
  },
  methods: {
    isAuthenticated() {
      return !!firebase.auth().currentUser
    }
  }
}
</script>