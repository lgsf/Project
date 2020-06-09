<template>
  <v-container>
    <v-dialog :value="dialog" persistent scrollable max-width="800px">
      <v-card>
        <v-toolbar class="primary" dark>
          <v-toolbar-title>{{title}}</v-toolbar-title>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Nome" :value="name" @input="editName" required></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Administrador" :value="task" @input="editTask" required></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Usuários" :value="user" @input="editUser" required></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <h3 class="primary--text">Tarefas:</h3>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-treeview
                  v-model="activeTask"
                  :items="tasks"
                  :counter="taskCounter"
                  dense
                  item-key="id"
                  selected-color="accent"
                  color="primary"
                >
                  <template v-slot:prepend="{ leaf }">
                    <v-icon v-if="!leaf">mdi-calendar-today</v-icon>
                    <v-icon v-if="leaf">mdi-chevron-right</v-icon>
                  </template>
                  <template v-slot:label="{ item }">
                    <v-text-field v-model="item.name" />
                  </template>
                  <template v-slot:append="{ item, leaf }">
                    <v-btn v-if="!leaf" icon color="green" @click="appendTaskItem(item)">
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                    <v-btn icon color="red" @click="removeTaskOrItem(item)">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </template>
                </v-treeview>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Adicionar Tarefa" :value="newTask" @input="editNewTask">
                  <template v-slot:append>
                    <v-icon @click="addTask">mdi-plus</v-icon>
                  </template>
                </v-text-field>
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
  </v-container>
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
  methods: Object.assign({}, methods, {
    addTask() {
      this.tasks.push({
        id: this.taskCounter++,
        name: this.newTask,
        children: []
      });
      this.newTask = "";
      console.log("counter: " + this.taskCounter);
    },
    editNewTask(payload) {
      this.newTask = payload;
    },
    appendTaskItem(item) {
      item.children.push({ id: this.taskCounter++, name: "" });
      console.log("counter: " + this.taskCounter);
    },
    removeTaskOrItem(item) {
      this.tasks = this.tasks.filter(m => m.id != item.id);
      this.tasks.forEach(element => {
        element.children = element.children.filter(m => m.id != item.id);
      });
    }
  }),
  data() {
    return {
      taskCounter: 0,
      activeTask: [],
      tasks: []
    };
  }
};
</script>
<style lang="stylus"></style>