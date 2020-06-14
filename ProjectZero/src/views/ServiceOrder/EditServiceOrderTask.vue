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
              <v-col cols="10" style="padding-bottom: 0px">
                <v-text-field label="Nome: " :disabled="!isInEditMode" v-model="selectedTask.name"></v-text-field>
              </v-col>
              <v-col cols="2" class="no-top-bottom-padding">
                <v-btn color="gray" @click="setOrUnsetEditMode">Edit</v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="no-top-bottom-padding">
                <v-row>
                  <v-col cols="4" class="no-top-bottom-padding">
                    <v-text-field label="Data de criação:" disabled v-model="selectedTask.creation_date"></v-text-field>
                  </v-col>
                  <v-col cols="4" class="no-top-bottom-padding">
                    <v-text-field label="Data de início:" disabled v-model="selectedTask.started_date"></v-text-field>
                  </v-col>
                  <v-col cols="4" class="no-top-bottom-padding">
                    <v-text-field label="Data de encerramento:" disabled v-model="selectedTask.end_date"></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-autocomplete
                  v-model="selectedTask.users"
                  :items="users"
                  color="primary"
                  item-text="name"
                  label="Usuários"
                  return-object
                  dense
                  single
                  required
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-textarea
                  v-model="selectedTask.comments"
                  label="Comentários"
                ></v-textarea>
              </v-col>
            </v-row>
            <v-treeview
                v-if="!isInEditMode"
                v-model="activeTask"
                :items="selectedTask.items"
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
                  ></v-checkbox>
                </template>
            </v-treeview>
            <v-treeview
              v-if="isInEditMode"
              :items="selectedTask.items"
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
                <v-text-field v-model="item.description" />
              </template>
              <template v-slot:append="{ item }">
                <v-btn icon color="green" @click="appendTaskItem(item)">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
                <v-btn icon color="red" @click="removeTaskOrItem(item)">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </template>
            </v-treeview>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="error" text @click="deleteTask">Deletar</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeTaskModal">Fechar</v-btn>
          <v-btn color="blue darken-1" text @click="saveTask">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapState, mapActions } from "vuex";

const computed = mapState({
    dialog: state => state.serviceOrders.showTaskDialog,
    selectedTask: state => state.serviceOrders.selectedTask,
    users: state => state.users.userList,
    selectedUsers: state => state.serviceOrders.selectedTask.users,
    isInEditMode: state => state.serviceOrders.taskDialogInEditMode
});

const userMethods = mapActions("users", ["readUsers"]);

const methods = mapActions("serviceOrders", [
  "closeTaskModal",
  "saveTask",
  "setOrUnsetEditMode",
  "deleteTask"
]);

export default {
    data() {
        return {
          counter: this.selectedTask?.items?.length || 0
         }
    },
    methods:  Object.assign({}, methods, userMethods, {
          appendTaskItem(item) {
            this.counter = this.counter + 1;
            this.selectedTask.items.push({description: item.description, id: this.counter });
          },
          removeTaskOrItem(item) {
            console.log(this.selectedTask.items)
            console.log(this. selectedTask.items.filter(m => m.id != item.id))
            console.log(this. selectedTask.items.filter(m => m.id == item.id))
            this.selectedTask.items = this. selectedTask.items.filter(m => m.id != item.id);
          }
    }),
    computed,
    mounted() {
      this.readUsers()
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