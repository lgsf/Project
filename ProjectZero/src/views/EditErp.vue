<template>
  <v-row justify="center">
    <v-dialog :value="dialog" persistent scrollable max-width="600px">
      <v-card>
        <v-toolbar class="primary" dark>
          <v-toolbar-title>{{title}}</v-toolbar-title>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Nome da Erp" :value="name" @input="editName" required></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Tarefas" :value="task" @input="editTask" required></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Usuários" :value="user" @input="editUser" required></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <small>*Obrigatório</small>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="editErp(false)">Fechar</v-btn>
          <v-btn color="blue darken-1" text @click="saveErp">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import { mapState, mapActions } from "vuex";

const computed = mapState("erp", {
  selected: state => state.selected,
  title: state => state.editTitle,
  dialog: state => state.editErp,
  name: state => state.editingName,
  task: state => state.editingTask,
  user: state => state.editingUser
});

const methods = mapActions("erp", [
  "editName",
  "editTask",
  "editUser",
  "loadErp",
  "editErp",
  "saveErp"
]);

export default {
  computed,
  methods,
  data() {
    return {};
  }
};
</script>
<style lang="stylus"></style>