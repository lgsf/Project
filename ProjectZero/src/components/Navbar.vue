<template>
  <nav>
    <v-app-bar app flat>
      <v-app-bar-nav-icon color="primary" @click="drawer = !drawer" class></v-app-bar-nav-icon>
      <v-toolbar-title>
        <router-link to="/home"><v-img :src="imgUrl" height="150" width="150" contain></v-img></router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="$router.push('/profile')" color="grey-2" class="mr-3 primary--text d-none d-sm-flex">
        <span>Perfil</span>
        <v-icon right>mdi-account</v-icon>
      </v-btn>
      <v-btn @click="$router.push('/profile')" color="grey-2" class="mr-3 primary--text d-flex d-sm-none">
        <v-icon>mdi-account</v-icon>
      </v-btn>
      <v-btn @click="userSignOut" color="grey-2" class="primary--text">
        <span >Sair</span>
        <v-icon right>exit_to_app</v-icon>
      </v-btn>
    </v-app-bar>
    <div v-if="drawer">
      <v-navigation-drawer app v-model="drawer" class="grey-3">
        <v-card>
          <div class="text-center" v-if="isLoading">
            <br />
            <br />
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
            <br />
            <br />
            <br />
          </div>
          <v-list flat v-if="!isLoading">
            <v-subheader>Menu</v-subheader>
            <div v-for="(link, i) in links" :key="i">
              <v-list-item v-if="!link.children" :key="i" color="primary" router :to="link.route">
                <v-list-item-icon>
                  <v-icon v-text="link.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="link.name"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-group v-else :key="i" color="primary">
                <template v-slot:activator>
                  <v-list-item-icon>
                    <v-icon v-text="link.icon"></v-icon>
                  </v-list-item-icon>
                  <v-list-item-title v-text="link.name"></v-list-item-title>
                </template>

                <v-list-item
                  v-for="(sublink, i) in link.children"
                  :to="sublink.route"
                  :key="i"
                  class="sub-menu"
                >
                  <v-list-item-icon>
                    <v-icon v-text="sublink.icon"></v-icon>
                  </v-list-item-icon>
                  <v-list-item-title v-text="sublink.name" />
                </v-list-item>
              </v-list-group>
            </div>
          </v-list>
        </v-card>
      </v-navigation-drawer>
    </div>
  </nav>
</template>

<script>
import { mapState, mapActions } from "vuex"

const methods = mapActions("auth", ["userSignOut"])

const generalMethods = mapActions("general", ["loadMenu"])

const setupMethods = mapActions("setup", ["readLogo"])

const computed = mapState({
  imgUrl: state => state.setup.imgUrl,
  links: state => state.general.links
})

const computedGeneral = mapState("general", {
  isLoading: state => state.loadingNavbar
})

export default {
  data() {
    return {
      drawer: true
    }
  },
  
  computed: Object.assign({}, computed, computedGeneral),

  methods: Object.assign({}, methods, generalMethods, setupMethods),

  mounted() {
    this.readLogo()
    this.loadMenu()
  }
}
</script>

<style>
.sub-menu {
  margin-left: 20px;
}
</style>