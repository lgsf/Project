<template>
  <nav>
    <v-toolbar app flat>
      <v-app-bar-nav-icon @click="drawer = !drawer" class="grey--text"></v-app-bar-nav-icon>
      <v-toolbar-title class="text-uppercase grey--text">
        <span class="font-weight-light">Logo</span>
        <span>Aqui</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="grey-2">
        <span>Sair</span>
        <v-icon right>exit_to_app</v-icon>
      </v-btn>
    </v-toolbar>
    <div v-if="drawer" @click="drawer = !drawer">
      <v-navigation-drawer app v-model="drawer" class="grey-3">
        <v-card>
          <v-list flat>
            <v-subheader>Menu</v-subheader>
            <v-list-item-group v-model="item" color="primary">
              <v-list-item v-for="(item, i) in links" :key="i" router :to="item.route">
                <v-list-item-icon v-if="!item.sublinks">
                  <v-icon v-text="item.icon" @click="drawer = !drawer"></v-icon>
                </v-list-item-icon>
                <v-list-item-content v-if="!item.sublinks">
                  <v-list-item-title v-text="item.text" @click="drawer = !drawer"></v-list-item-title>
                </v-list-item-content>

                <v-list-item-icon v-if="!!item.sublinks">
                  <v-menu top open-on-hover offset-x>
                    <template v-slot:activator="{ on }">
                      <v-icon v-text="item.icon" v-on="on"></v-icon>
                    </template>
                    <v-list>
                      <v-list-item
                        v-for="(subitem, index) in item.sublinks"
                        :key="index"
                        router
                        :to="subitem.route"
                      >
                        <v-list-item-title>{{ subitem.text }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-list-item-icon>
                <v-list-item-content v-if="!!item.sublinks">
                  <v-menu top open-on-hover>
                    <template v-slot:activator="{ on }">
                      <span v-text="item.text" v-on="on"></span>
                    </template>
                    <v-list>
                      <v-list-item
                        v-for="(subitem, index) in item.sublinks"
                        :key="index"
                        router
                        :to="subitem.route"
                      >
                        <v-list-item-title>{{ subitem.text }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
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
      drawer: false,
      links: [
        { icon: "dashboard", text: "Home", route: "/" },
        { icon: "settings", text: "Configuração", route: "/setup" },
        { icon: "contacts", text: "Clientes", route: "/clients" },
        { icon: "event_note", text: "Processos", route: "/process" },
        { icon: "receipt", text: "Fluxos", route: "/flux" },
        {
          icon: "account_box",
          text: "Usuários",
          route: "/team",
          sublinks: [
            { icon: "person", text: "Administrar Usuários", route: "/team" },
            { icon: "people", text: "Administrar Grupos", route: "/groups" }
          ]
        },
        { icon: "notifications", text: "Notificações", route: "/notifications" }
      ]
    };
  }
};
</script>

<style>
</style>