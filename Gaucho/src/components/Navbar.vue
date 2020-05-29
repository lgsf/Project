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
        <v-card >
          <v-list flat>
            <v-subheader>Menu</v-subheader>
              <v-list-item-group v-model="item" color="primary">
                <v-list-item 
                  v-for="(item, i) in links"
                  :key="i"
                  router :to="item.route"
                  
                >
                  <v-list-item-icon> 
                    <v-icon v-text="item.icon"></v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-text="item.text" @click="drawer = !drawer" ></v-list-item-title>
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
        { icon: 'dashboard', text: 'Home', route: '/' },
        { icon: 'settings', text: 'Configuração', route: '/setup' },
        { icon: 'folder', text: 'Processos', route: '/process' },
        { icon: 'archive', text: 'Fluxos', route: '/flux' },
        { icon: 'person', text: 'Usuários', route: '/team' },
        { icon: 'notifications', text: 'Notificações', route: '/notifications' },

      ]
    }
  }
}
</script>

<style>

</style>