<template>
  <nav>
    <v-app-bar app flat>
      <v-app-bar-nav-icon @click="drawer = !drawer" class></v-app-bar-nav-icon>
      <v-toolbar-title class="text-uppercase">
        <span class="font-weight-light">Logo</span>
        <span>Aqui</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="logout" color="grey-2">
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
import { db } from "@/main";

export default {
  data() {
    return {
      drawer: true,
      links: []
    };
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    userObj() {
      return this.$store.getters.userObj;
    }
  },
  methods: {
    logout() {
      this.$store.dispatch("userSignOut");
    },
    loadMenu() {
      let groupId = "bmyiE5pvx66Ct7Wmj78b"
      console.log(this.userObj)
      if(this.userObj && this.userObj.group_id)
        groupId = this.userObj.group_id
      if(groupId){
          db.collection("groups")
              .doc(groupId)
              .get()
              .then((snapshots) => {
                this.onMenuLoaded(snapshots);
        });
      }
    },
    onMenuLoaded(groupSnapshot) {
      let groupData = groupSnapshot.data();
      this.links = groupData.menu.sort(function(a, b) {
        return a.id < b.id ? -1 : 1;
      });
    }
  },
  mounted() {
    this.loadMenu();
  }
};
</script>

<style>
.sub-menu {
  margin-left: 20px;
}
</style>