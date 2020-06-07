<template>
  <v-row justify="center">
    <v-dialog :value="dialog" persistent max-width="600px">
      <v-card>
        <v-toolbar class="primary" dark>
          <v-toolbar-title>{{selectedTask.name}}</v-toolbar-title>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Nome: " :value="selectedTask.name" @input="updateTaskName"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field label="Data de criação:" disabled :value="selectedTask.creation_date"></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field label="Data de encerramento:" :value="selectedTask.end_date" @input="updateTaskEndDate"></v-text-field>
              </v-col>
            </v-row>
            <ul>
                <li v-for="item in selectedTask.items" :key="item">
                    <v-row style="height:50">
                      <v-col align="center" cols="1">
                        <v-btn color="primary" text @click="editTaskItem(item)"><v-icon>mdi-pen</v-icon></v-btn>
                      </v-col>
                      <v-col cols="11">
                        <v-checkbox 
                            v-model="item.done" 
                            class="mx-2" 
                            :label="item.description"
                        ></v-checkbox>
                      </v-col>
                    </v-row>
                </li>
            </ul>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeEditServiceOrderTaskModal">Fechar</v-btn>
          <v-btn color="blue darken-1" text @click="saveTask">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapState, mapActions } from "vuex";

const computed = mapState("productionOrders", {
    dialog: state => state.showTaskDialog,
    selectedTask: state => state.selectedTask
});

const methods = mapActions("productionOrders", [
  "closeEditServiceOrderTaskModal",
  "saveTask",
  "updateTaskName",
  "updateTaskEndDate",
  "editTaskItem"
]);

export default {
    data() {
        return { }
    },
    methods,
    computed
}
</script>

<style>
ul{ 
  list-style-type: none;
}
</style>