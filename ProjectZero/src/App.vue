<template>
  <v-app class="grey lighten-4">
    <Navbar v-if="isAuthenticated && isGroupSet" />
    <v-content class="mx-5 mb-5">
      <ModalIdle v-if="isIdle && isAuthenticated" />
      <router-view></router-view>
    </v-content>
    <Footer />
  </v-app>
</template>

<script>
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import ModalIdle from "@/components/ModalIdle"
import { mapState  } from "vuex"

const computedAuth = mapState("auth", {
  selectedTheme: state => state.selectedTheme
})

export default {
  components: { Navbar, Footer, ModalIdle },

  name: "App",

  data() {
    return {}
  },
  
  computed: Object.assign({}, computedAuth,{
    isAuthenticated() {
      return this.$store.state.auth.isAuthenticated
    },
    isGroupSet() {
      return this.$store.state.auth.userGroup != ''
    },
    isIdle() {
      return this.$store.state.idleVue.isIdle
    }
  }),
  mounted(){
    window.onload = () => {
      if(this.selectedTheme == 'Dark')
        return this.$vuetify.theme.dark = true
      else
      return this.$vuetify.theme.dark = false
    }
  }
};
</script>

<style lang="stylus">
@import './styles/main';
</style>