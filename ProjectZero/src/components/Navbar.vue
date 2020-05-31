<template>
  <nav>
    <v-app-bar app flat>
      <v-app-bar-nav-icon @click="drawer = !drawer" class="grey--text"></v-app-bar-nav-icon>
      <v-toolbar-title class="text-uppercase grey--text">
        <span class="font-weight-light">Logo</span>
        <span>Aqui</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="logout"
      color="grey-2">
        <span>Sair</span>
        <v-icon right>exit_to_app</v-icon>
      </v-btn>
    </v-app-bar>
    <div v-if="drawer">
      <v-navigation-drawer app v-model="drawer" class="grey-3">
        <v-card>
          <v-list flat>
            <v-subheader>Menu</v-subheader>
            <div v-for="(link, i) in links" :key="i">
              <v-list-item v-if="!link.subLinks" :key="i" color="primary" router :to="link.route">
                <v-list-item-icon>
                  <v-icon v-text="link.icon" ></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="link.text" ></v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-group v-else :key="i" color="primary">
                <template v-slot:activator>
                  <v-list-item-icon>
                    <v-icon v-text="link.icon"></v-icon>
                  </v-list-item-icon>
                  <v-list-item-title v-text="link.text"></v-list-item-title>
                </template>

                <v-list-item
                  v-for="(sublink, i) in link.subLinks"
                  :to="sublink.route"
                  :key="i"
                  class="sub-menu"
                >
                  <v-list-item-icon>
                    <v-icon v-text="sublink.icon" @click="drawer = !drawer"></v-icon>
                  </v-list-item-icon>
                  <v-list-item-title v-text="sublink.text" @click="drawer = !drawer" />
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
export default {
  data() {
    return {
      drawer: true,
      links: [
        { icon: "dashboard", text: "Home", route: "/home" },
        { icon: "settings", text: "Configuração", route: "/setup" },
        { icon: "contacts", text: "Clientes", route: "/clients" },
        { icon: "event_note", text: "Processos", route: "/process" },
        { icon: "receipt", text: "Fluxos", route: "/flux" },
        {
          icon: "account_box",
          text: "Pessoal",
          route: "/team",
          subLinks: [
            { icon: "person", text: "Usuários", route: "/team" },
            { icon: "people", text: "Grupos", route: "/groups" }
          ]
        },
        { icon: "notifications", text: "Notificações", route: "/notifications" }
      ]
    };
  },
  computed: {
        isAuthenticated() {
            return this.$store.getters.isAuthenticated
        }
    },
    methods: {
        logout() {
            this.$store.dispatch('userSignOut')
        }
}
}
</script>

<style>
.sub-menu {
  margin-left: 20px;
}
</style>