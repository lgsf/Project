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
            <v-row justify="start" align="center">
              <v-col cols="9" md="9">
                <v-text-field label="Nome: " :disabled="!isInEditMode" v-model="selectedTask.name"></v-text-field>
              </v-col>
              <v-col cols="1" md="1">
                <v-icon
                  color="error"
                  v-if="selectedTask.priority == 'Critica'"
                >mdi-chevron-triple-up</v-icon>
                <v-icon color="success" v-if="selectedTask.priority == 'Baixa'">mdi-chevron-down</v-icon>
                <v-icon color="yellow" v-if="selectedTask.priority == 'Media'">mdi-chevron-up</v-icon>
                <v-icon color="error" v-if="selectedTask.priority == 'Alta'">mdi-chevron-double-up</v-icon>
              </v-col>
              <v-col cols="1" md="2">
                <v-btn
                  class="d-none d-md-block"
                  color="gray"
                  @click="setOrUnsetEditMode"
                  :disabled="userRole != 'SystemAdmin' && userRole != 'OrdemAdmin' && userRole != 'TaskCreator'"
                >Edit</v-btn>
                <v-btn
                  icon
                  class="d-md-none"
                  color="grey"
                  @click="setOrUnsetEditMode"
                  :disabled="userRole != 'SystemAdmin' && userRole != 'OrdemAdmin' && userRole != 'TaskCreator'"
                >
                  <v-icon>mdi-pencil-circle-outline</v-icon>
                </v-btn>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <input-tag v-model="selectedTask.tags" :available-tags="selectedOrder.tags"></input-tag>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-textarea
                  v-model="selectedTask.description"
                  label="Descrição"
                  :disabled="!isInEditMode"
                ></v-textarea>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-tabs>
                  <v-tab>
                    <v-icon left>mdi-file</v-icon>Detalhes
                  </v-tab>
                  <v-tab>
                    <v-icon left>mdi-check</v-icon>Checklist
                  </v-tab>
                  <v-tab>
                    <v-icon left>mdi-paperclip</v-icon>Anexos
                  </v-tab>
                  <v-tab>
                    <v-icon left>mdi-chat</v-icon>Comentários
                  </v-tab>
                  <v-tab-item>
                    <v-card flat>
                      <v-cart-text>
                        <v-row>
                          <v-col cols="12" md="8">
                            <v-select
                              v-model="selectedTask.priority"
                              :items="taskPriorityList"
                              :disabled="!isInEditMode"
                              :multiple="false"
                              label="Prioridade"
                            ></v-select>
                          </v-col>
                          <v-col cols="12" md="4">
                            <v-text-field
                              label="Duração estimada (horas):"
                              :disabled="!isInEditMode"
                              v-model="selectedTask.estimated_duration"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12" md="4">
                            <v-text-field
                              label="Data de criação:"
                              disabled
                              v-model="selectedTask.creation_date"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="4">
                            <v-text-field
                              label="Data de início:"
                              disabled
                              v-model="selectedTask.started_date"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="4">
                            <v-text-field
                              label="Data de encerramento:"
                              disabled
                              v-model="selectedTask.end_date"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12" md="6">
                            <v-autocomplete
                              v-model="selectedTask.possibleUsers"
                              :items="users"
                              color="primary"
                              item-text="name"
                              label="Usuários possíveis:"
                              return-object
                              dense
                              multiple
                              required
                              :disabled="!isInEditMode"
                            ></v-autocomplete>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-autocomplete
                              v-model="selectedTask.possibleGroups"
                              :items="groups"
                              color="primary"
                              item-text="name"
                              label="Grupos possíveis:"
                              return-object
                              dense
                              multiple
                              required
                              :disabled="!isInEditMode"
                            ></v-autocomplete>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12" md="6">
                            <v-autocomplete
                              v-model="selectedTask.users"
                              :items="allowedUsers"
                              color="primary"
                              item-text="name"
                              label="Usuário responsável:"
                              return-object
                              dense
                              single
                              required
                              :disabled="userRole == 'NotRelated'"
                            ></v-autocomplete>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-text-field label="Criado por:" disabled v-model="createdBy" dense></v-text-field>
                          </v-col>
                        </v-row>
                      </v-cart-text>
                    </v-card>
                  </v-tab-item>
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
                            <v-checkbox
                              v-model="item.done"
                              class="mr-2; text-wrap"
                              :label="item.description"
                              :disabled="userRole == 'PossibleUser' || userRole == 'NotRelated'"
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
                            <v-btn icon color="green" @click="appendTaskItem()">
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
                        <v-row align="center" justify="center">
                          <v-col cols="12" sm="9">
                            <v-file-input
                              v-model="files"
                              placeholder="Adicionar arquivos"
                              label="Anexos"
                              :messages="filesAlertMessage"
                              multiple
                              prepend-icon="mdi-paperclip"
                            >
                              <template v-slot:selection="{ text }">
                                <v-chip small label color="primary">{{ text }}</v-chip>
                              </template>
                            </v-file-input>
                          </v-col>
                          <v-col cols="12" sm="3">
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
                          <v-col v-if="showFiles" cols="12">
                            <v-list dense>
                              <v-list-item-group color="primary">
                                <v-list-item v-for="(item, i) in selectedTask.files" :key="i">
                                  <v-list-item-content>
                                    <v-list-item-title v-html="item.name"></v-list-item-title>
                                    <v-list-item-subtitle v-html="item.lastModified"></v-list-item-subtitle>
                                  </v-list-item-content>
                                  <v-list-item-action class="d-flex flex-row">
                                    <v-btn
                                      v-if="!item.newFile"
                                      icon
                                      :href="item.url"
                                      target="_blank"
                                    >
                                      <v-icon color="primary darken-3">mdi-open-in-new</v-icon>
                                    </v-btn>
                                    <v-btn icon @click="removeFile(item)">
                                      <v-icon color="error lighten-1">mdi-close</v-icon>
                                    </v-btn>
                                  </v-list-item-action>
                                </v-list-item>
                              </v-list-item-group>
                            </v-list>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-tab-item>
                  <v-tab-item>
                    <v-card>
                      <v-card-text>
                        <v-row>
                          <v-col cols="12">
                            <v-textarea
                              v-model="comment"
                              label="Adicionar comentário"
                              :disabled="!isInEditMode"
                            ></v-textarea>
                          </v-col>
                        </v-row>
                        <v-row v-if="comment && comment != ''">
                          <v-col cols="12">
                            <v-btn icon color="green" @click="saveComment()">
                              <v-icon>mdi-plus</v-icon>
                            </v-btn>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12">
                            <v-list dense>
                              <v-list-item-group color="primary">
                                <v-list-item v-for="(item, i) in selectedTask.comments" :key="i">
                                  <v-list-item-content>
                                    <v-list-item-title v-html="item.user.name"></v-list-item-title>
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
          <v-btn color="error" text @click="deleteTask" :disabled="!isInEditMode">Deletar</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">Fechar</v-btn>
          <v-btn color="blue darken-1" text @click="saveAndClose">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import InputTag from "@/components/shared/InputTag";

const moment = require("moment");

const computed = mapState({
  dialog: state => state.serviceOrders.showTaskDialog,
  selectedTask: state => state.serviceOrders.selectedTask,
  selectedOrder: state => state.serviceOrders.selected,
  users: state => state.users.userList,
  allowedUsers: function(state) {
    let permission = [];

    if (state.serviceOrders.selectedTask.possibleUsers) {
      let permissionByUser = state.users.userList.find(user =>
        state.serviceOrders.selectedTask.possibleUsers.some(
          possibleUser => possibleUser.email == user.email
        )
      );
      if (permissionByUser.isArray) permission.concat(permissionByUser);
      else permission.push(permissionByUser);
    }

    if (state.serviceOrders.selectedTask.possibleGroups) {
      let permissionByGroup = state.users.userList.find(user =>
        state.serviceOrders.selectedTask.possibleGroups?.some(
          possibleGroup => possibleGroup.id == user.group_id.id
        )
      );
      if (permissionByGroup.isArray) permission.concat(permissionByGroup);
      else permission.push(permissionByGroup);
    }

    return permission.length > 0 ? permission : state.users.userList;
  },
  groups: state => state.groups.groups,
  selectedUsers: state => state.serviceOrders.selectedTask.users,
  isInEditMode: state => state.serviceOrders.taskDialogInEditMode,
  taskPriorityList: state => state.serviceOrders.taskPriorityList,
  createdBy: state => state.serviceOrders.selectedTask.created_by?.name || "",
  userRole: function(state) {
    let role = "NotRelated";
    if (state.auth.userGroup.id == "bmyiE5pvx66Ct7Wmj78b") role = "SystemAdmin";
    if (
      state.auth.user.email == state.serviceOrders.selected.administrator?.email
    )
      role = "OrdemAdmin";
    else if (
      state.auth.user.email ==
        state.serviceOrders.selectedTask.created_by?.email ||
      !state.serviceOrders.selectedTask.id
    )
      role = "TaskCreator";
    else if (
      state.serviceOrders.selectedTask.users?.email == state.auth.user.email
    )
      role = "Responsible";
    else if (
      (!state.serviceOrders.selectedTask.possibleUsers &&
        !state.serviceOrders.selectedTask.possibleGroups) ||
      state.serviceOrders.selectedTask.possibleUsers?.some(
        possibleUser => possibleUser.email == state.auth.user.email
      ) ||
      state.serviceOrders.selectedTask.possibleGroups?.some(
        group => group.id == state.auth.userGroup.id
      )
    )
      role = "PossibleUser";
    return role;
  }
});

const getters = mapGetters("users", ["getUserByEmail"]);

const userMethods = mapActions("users", ["readUsers"]);

const userGroupsMethods = mapActions("groups", ["loadGroups"]);

const methods = mapActions("serviceOrders", [
  "closeTaskModal",
  "saveTask",
  "setOrUnsetEditMode",
  "deleteTask"
]);

export default {
  components: { InputTag },
  data() {
    return {
      tags: [{ text: "marco", color: "pink" }],
      availableTags: [
        { text: "marco", color: "pink" },
        { text: "desenvolvimento", color: "red" }
      ],
      counter: this.selectedTask?.items?.length || 0,
      files: [],
      filesAlertMessage: "",
      showFiles: true,
      comment: ""
    };
  },
  watch: {
    files(newValue) {
      this.filesAlertMessage = "";
      if (!newValue.length || !this.selectedTask.files?.length) return;
      let existingFiles = this.selectedTask.files.map(m => m.name);
      let addedFiles = newValue.map(m => m.name);
      let changedFiles = existingFiles.filter(m => addedFiles.includes(m));
      if (changedFiles.length)
        this.filesAlertMessage = `Os seguintes arquivos serão substituídos: ${changedFiles.join(
          ", "
        )}`;
    }
  },
  methods: Object.assign({}, methods, userMethods, userGroupsMethods, {
    appendTaskItem() {
      this.counter = this.counter + 1;
      this.selectedTask.items.push({
        description: "",
        id: this.counter
      });
    },
    removeTaskOrItem(item) {
      this.selectedTask.items = this.selectedTask.items.filter(
        m => m.id != item.id
      );
    },
    addFiles() {
      this.selectedTask.files = this.selectedTask.files || [];
      this.files.forEach(element => {
        this.selectedTask.files = this.selectedTask.files.filter(
          m => m.name != element.name
        );
        this.selectedTask.files.push({
          newFile: true,
          name: element.name,
          lastModified: moment().format("DD/MM/YYYY HH:mm:ss"),
          file: element
        });
      });
      this.files = [];
      this.showFiles =
        this.selectedTask.files && this.selectedTask.files.length;
    },
    removeFile(file) {
      this.selectedTask.files = this.selectedTask.files.filter(
        item => item.name != file.name
      );
      this.showFiles =
        this.selectedTask.files && this.selectedTask.files.length;
      console.log(this.showFiles);
    },
    saveComment() {
      console.log(this.comment);
    },
    close() {
      this.showFiles = true;
      this.closeTaskModal();
    },
    saveAndClose() {
      this.showFiles = true;
      this.saveTask();
    }
  }),
  computed,
  getters,
  mounted() {
    this.readUsers();
    this.loadGroups();
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