<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <h1 class="primary--text">Grupo</h1>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Grupo*" :value="groupName" required></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Email" :value="groupEmail"></v-text-field>
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
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">Fechar</v-btn>
          <v-btn color="blue darken-1" text @click="close">Salvar</v-btn>
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
      groupName: "",
      groupEmail: "",
      items: menuItems
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
      loadMeunuOptions();
    }
  },
  mounted() {
    loadMeunuOptions();
  }
};
</script>
<style lang="stylus"></style>