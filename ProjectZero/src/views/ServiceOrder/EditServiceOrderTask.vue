<template>
  <v-row justify="center">
    <v-dialog
      :value="dialog"
      persistent
      scrollable
      max-width="800px"
      @click:outside="closeTaskModal"
    >
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
                <v-select
                  v-model="selectedTask.priority"
                  :items="taskPriorityList"
                  :disabled="!isInEditMode"
                  :multiple="false"
                  label="Prioridade"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="no-top-bottom-padding">
                <v-row>
                  <v-col cols="4" class="no-top-bottom-padding">
                    <v-text-field
                      label="Data de criação:"
                      disabled
                      v-model="selectedTask.creation_date"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="4" class="no-top-bottom-padding">
                    <v-text-field
                      label="Data de início:"
                      disabled
                      v-model="selectedTask.started_date"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="4" class="no-top-bottom-padding">
                    <v-text-field
                      label="Data de encerramento:"
                      disabled
                      v-model="selectedTask.end_date"
                    ></v-text-field>
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
                <v-textarea v-model="selectedTask.comments" label="Comentários"></v-textarea>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-tabs>
                  <v-tab>
                    <v-icon left>mdi-check</v-icon>Checklist
                  </v-tab>
                  <v-tab>
                    <v-icon left>mdi-paperclip</v-icon>Anexos
                  </v-tab>
                  <v-tab-item>
                    <v-card flat>
                      <v-card-text>
                        <v-btn
                          v-if="selectedTask.items && selectedTask.items.length == 0 && isInEditMode"
                          dark
                          color="green"
                          @click="appendTaskItem()"
                          style="padding-left:8px"
                        >
                          <v-icon>mdi-plus</v-icon>Checklist
                        </v-btn>
                        <!-- <label
                          v-if="selectedTask.items && selectedTask.items.length > 0"
                          class="v-label theme--light"
                        >Checklist</label>-->
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
                            <v-checkbox v-model="item.done" class="mr-2" :label="item.description"></v-checkbox>
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
                      </v-card-text>
                    </v-card>
                  </v-tab-item>
                  <v-tab-item>
                    <v-card flat>
                      <v-card-text>
                        <v-row>
                          <v-col cols="9">
                            <v-file-input
                              v-model="files"
                              placeholder="Adicionar arquivos"
                              label="Anexos"
                              multiple
                              prepend-icon="mdi-paperclip"
                            >
                              <template v-slot:selection="{ text }">
                                <v-chip small label color="primary">{{ text }}</v-chip>
                              </template>
                            </v-file-input>
                          </v-col>
                          <v-col cols="3">
                            <v-btn
                              v-if="!isInEditMode"
                              dark
                              color="primary"
                              class="mt-4"
                              @click="addFiles()"
                            >
                              <v-icon>mdi-plus</v-icon>Adicionar
                            </v-btn>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12">
                            <v-list three-line>
                              <v-list-item-group v-model="selectedTask.files" color="primary">
                                <v-list-item v-for="(item, i) in selectedTask.files" :key="i">
                                  <v-list-item-content>
                                    <v-list-item-title v-html="item.name"></v-list-item-title>
                                    <v-list-item-subtitle v-html="item.lastModified"></v-list-item-subtitle>
                                  </v-list-item-content>
                                </v-list-item>
                              </v-list-item-group>
                            </v-list>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-tab-item>
                </v-tabs>
              </v-col>
            </v-row>
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
  isInEditMode: state => state.serviceOrders.taskDialogInEditMode,
  taskPriorityList: state => state.serviceOrders.taskPriorityList
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
      counter: this.selectedTask?.items?.length || 0,
      files: []
    };
  },
  methods: Object.assign({}, methods, userMethods, {
    appendTaskItem(item) {
      this.counter = this.counter + 1;
      this.selectedTask.items.push({
        description: item?.description,
        id: this.counter
      });
    },
    removeTaskOrItem(item) {
      console.log(this.selectedTask.items);
      console.log(this.selectedTask.items.filter(m => m.id != item.id));
      console.log(this.selectedTask.items.filter(m => m.id == item.id));
      this.selectedTask.items = this.selectedTask.items.filter(
        m => m.id != item.id
      );
    },
    addFiles() {
      this.selectedTask.files = this.selectedTask.files || [];
      this.files.forEach(element => {
        this.selectedTask.files.push({
          name: element.name,
          lastModified: element.lastModifiedDate.toLocaleDateString()
        });
      });
      this.files = [];
      console.log(this.files);
    }
  }),
  computed,
  mounted() {
    this.readUsers();
  }
};
</script>

<style>
ul {
  list-style-type: none;
}
.no-top-bottom-padding {
  padding-top: 0px;
  padding-bottom: 0px;
}
</style>