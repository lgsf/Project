<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent scrollable max-width="600px">
      <v-card>
        <v-toolbar class="primary" dark>
          <v-toolbar-title>Grupo</v-toolbar-title>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Grupo*" v-model="groupName" required></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Email" v-model="groupEmail"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <h3 class="primary--text">Permissões</h3>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-treeview
                  :items="items"
                  v-model="selection"
                  dense
                  selectable
                  open-on-click
                  selected-color="accent"
                  color="primary"
                ></v-treeview>
              </v-col>
            </v-row>
          </v-container>
          <small>*Obrigatório</small>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">Fechar</v-btn>
          <v-btn color="blue darken-1" text @click="save">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import { db } from "@/main";

var menuItems = [];

function loadMeunuOptions() {
  db.collection("menuItems")
    .get()
    .then(onMenuOptionsLoaded);
}

function onMenuOptionsLoaded(snapshot) {
  snapshot.forEach(config => {
    let appData = config.data();
    menuItems.push(appData);
  });
}

export default {
  data() {
    return {
      dialog: false,
      groupId: "",
      groupName: "",
      groupEmail: "",
      items: menuItems,
      selection: []
    };
  },
  methods: {
    show() {
      this.dialog = true;
    },
    close() {
      this.groupName = "";
      this.groupEmail = "";
      this.dialog = false;
      this.selection.splice(0, this.selection.length);
    },
    save() {
      let self = this;
      let menu = this.items.filter(
        m =>
          this.selection.includes(m.id) ||
          (!!m.children &&
            m.children.filter(n => this.selection.includes(n.id)).length > 0)
      );
      db.collection("groups")
        .add({
          name: this.groupName,
          email: this.groupEmail,
          menu: menu
        })
        .then(function() {
          self.close();
        })
        .catch(function(error) {
          console.error("Error writing document: ", error);
        });
    }
  },
  mounted() {
    loadMeunuOptions();
  }
};
</script>
<style lang="stylus"></style>