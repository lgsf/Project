<template>
  <v-app class="grey lighten-4">
    <Navbar v-if="isAuthenticated" />
    <v-content class="mx-5 mb-5">
      <ModalIdle v-if="isIdle && isAuthenticated" />
      <router-view></router-view>
    </v-content>
    <Footer />
  </v-app>
</template>

<script>
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ModalIdle from "@/components/ModalIdle";

export default {
  components: { Navbar, Footer, ModalIdle },

  name: "App",

  data() {
    return {};
  },
  computed: {
    isAuthenticated() {
      return this.$store.state.auth.isAuthenticated;
    },
    isIdle() {
      return this.$store.state.idleVue.isIdle;
    }
  }
};
</script>

<style lang="stylus">
@import './styles/main';
</style>