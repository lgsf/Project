<template>
  <v-row justify="center">
    <v-dialog :value="dialog" persistent max-width="800px">
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
            <v-row>
              <v-col cols="12">
                <v-autocomplete
                  :value="selectedUsers"
                  :items="users"
                  color="primary"
                  item-text="name"
                  label="Usuários"
                  return-object
                  dense
                  multiple
                  required
                  @input="updateTaskUsers"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-treeview
                v-model="activeTask"
                :items="taskItemList"
                dense
                item-key="id"
                selected-color="accent"
                color="primary"
              >
                <template v-slot:label="{ item }">
                  <v-checkbox 
                      v-model="item.done" 
                      class="mx-2" 
                      :label="item.description"
                      @input="updateTaskItem"
                  ></v-checkbox>
                </template>
                <template v-slot:append="{ item }">
                  <v-btn icon color="gray" @click="showTaskItemDialog(item)">
                    <v-icon>mdi-pen</v-icon>
                  </v-btn>
                  <v-btn icon color="green" @click="showTaskItemDialog({description: '', id: undefined, done: false})">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                  <v-btn icon color="red" @click="removeTaskItem(item)" :disabled="taskItemList.length <= 1">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </template>
            </v-treeview>
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

const computed = mapState({
    dialog: state => state.productionOrders.showTaskDialog,
    selectedTask: state => state.productionOrders.selectedTask,
    taskItemList: state => state.productionOrders.selectedTask.items,
    users: state => state.users.userList,
    treeviewRerenderTrigger: state => state.productionOrders.treeviewRerenderTrigger,
    selectedUsers: state => state.productionOrders.selectedTask.users || []
});

const userMethods = mapActions("users", ["readUsers"]);

const methods = mapActions("productionOrders", [
  "closeEditServiceOrderTaskModal",
  "saveTask",
  "updateTaskName",
  "updateTaskEndDate",
  "updateTaskItem",
  "showTaskItemDialog",
  "appendTaskItem",
  "removeTaskItem",
  "updateTaskUsers"
]);

export default {
    data() {
        return { }
    },
    components: { EditServiceOrderTaskItem },
    methods:  Object.assign({}, methods, userMethods),
    computed,
    mounted() {
      this.readUsers();
    }
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