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
  menuItems.splice(0, menuItems.length);
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

function fillGroupData(model, dataObj) {
  model.groupId = dataObj.id;
  model.groupName = dataObj.name;
  model.groupEmail = dataObj.email;
  (dataObj.menu || []).forEach(menuItem => {
    model.selection.push(menuItem.id);
    if (!menuItem.children) return;
    menuItem.children.forEach(menuSubItem =>
      model.selection.push(menuSubItem.id)
    );
  });
}

function createNewGroup(self) {
  let menu = getMenuSelectedItems(self);
  db.collection("groups")
    .add({
      name: self.groupName || "",
      email: self.groupEmail || "",
      menu: menu || []
    })
    .then(function() {
      self.close();
      if (!self.refreshGroups) return;
      self.refreshGroups();
    })
    .catch(function(error) {
      console.error("Error writing document: ", error);
    });
}

function getMenuSelectedItems(self) {
  return self.items.filter(
    m =>
      self.selection.includes(m.id) ||
      (!!m.children &&
        m.children.filter(n => self.selection.includes(n.id)).length > 0)
  );
}

function updateExistingGroup(self) {
  let menu = getMenuSelectedItems(self);
  db.collection("groups")
    .doc(self.groupId)
    .set({
      name: self.groupName || "",
      email: self.groupEmail || "",
      menu: menu || []
    })
    .then(function() {
      self.close();
      if (!self.refreshGroups) return;
      self.refreshGroups();
    })
    .catch(function(error) {
      console.error("Error writing document: ", error);
    });
}

export default {
  props: ["refreshGroups"],
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
    show(obj) {
      fillGroupData(this, obj);
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
      if (!self.groupId) createNewGroup(self);
      else updateExistingGroup(self);
    }
  },
  mounted() {
    loadMeunuOptions();
  }
};
</script>
<style lang="stylus"></style>