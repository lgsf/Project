<template>
  <v-app class="grey lighten-4">
    <Navbar v-if="isAuthenticated()" />
    <v-content class="mx-5 mb-5">
      <ModalIdle v-if="isIdle" /> 
      <router-view ></router-view>
     </v-content>
     <Footer />
  </v-app>
</template>

<script>
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import ModalIdle from "@/components/ModalIdle"


export default {
  
  components: { Navbar, Footer, ModalIdle },

  name: "App",

  data() {
    return {};
  },
  methods: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    logout() {
      this.$store.dispatch("userSignOut")
    }
  },
  computed: {
    isIdle(){
      return this.$store.state.idleVue.isIdle;
    }
  },
  beforeDestroy(){
      this.logout()
  }
}
</script>

<style lang="stylus">
  @import './styles/main'
</style>