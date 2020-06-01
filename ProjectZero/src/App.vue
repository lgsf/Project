<template>
  <v-app class="grey lighten-4">
    <Navbar v-if="isAuthenticated"/>
     <v-content class="mx-5 mb-5">
      <router-view></router-view>
     </v-content>
     <Footer />
  </v-app>
</template>

<script>
import Navbar from './components/Navbar'
import Footer from  './components/Footer'

export default {
  
  components: { Navbar, Footer },
  
  name: 'App',
  
  data () {
    return {
    }
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    }
  }
}
</script>