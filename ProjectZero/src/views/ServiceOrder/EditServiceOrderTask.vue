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
              <v-col cols="12" style="padding-bottom: 0px">
                <v-text-field label="Nome: " :value="selectedTask.name" @input="updateTaskName"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="no-top-bottom-padding">
                <v-row>
                  <v-col cols="6" class="no-top-bottom-padding">
                    <v-text-field label="Data de criação:" disabled :value="selectedTask.creation_date"></v-text-field>
                  </v-col>
                  <v-col cols="6" class="no-top-bottom-padding">
                    <v-text-field label="Data de encerramento:" :value="selectedTask.end_date" @input="updateTaskEndDate"></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <ul>
                <li v-for="item in selectedTask.items" :key="item">
                    <v-row>
                      <v-col cols="12" style="height: 40px">
                        <v-row>
                            <v-btn color="primary" text @click="showTaskItemDialog(item)" style="margin-top: 12px"><v-icon>mdi-pen</v-icon></v-btn>
                            <v-checkbox 
                                v-model="item.done" 
                                class="mx-2" 
                                :label="item.description"
                                @input="updateTaskItem"
                            ></v-checkbox>
                        </v-row>
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
    <EditServiceOrderTaskItem></EditServiceOrderTaskItem>
  </v-row>
</template>

<script>
import { mapState, mapActions } from "vuex";
import EditServiceOrderTaskItem from "./EditServiceOrderTaskItem.vue";

const computed = mapState("productionOrders", {
    dialog: state => state.showTaskDialog,
    selectedTask: state => state.selectedTask
});

const methods = mapActions("productionOrders", [
  "closeEditServiceOrderTaskModal",
  "saveTask",
  "updateTaskName",
  "updateTaskEndDate",
  "updateTaskItem",
  "showTaskItemDialog"
]);

export default {
    data() {
        return { }
    },
    components: { EditServiceOrderTaskItem },
    methods,
    computed
}
</script>

<style>
ul{ 
  list-style-type: none;
}
.no-top-bottom-padding{
  padding-top: 0px; 
  padding-bottom: 0px;
}
</style>