<template>
  <v-container>
    <v-dialog :value="dialog" persistent scrollable max-width="800px" @click:outside="closeSelectedErpOrder(false)">
      <v-card>
        <v-toolbar class="primary" dark>
          <v-toolbar-title>Ordem de Serviço ERP</v-toolbar-title>
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
                <v-autocomplete
                  :value="editingAdmin"
                  :items="users"
                  color="primary"
                  item-text="name"
                  label="Administrador"
                  return-object
                  dense
                  @input="editAdmin"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-autocomplete
                  v-model="editingUser"
                  :items="users"
                  color="primary"
                  item-text="name"
                  label="Usuários"
                  return-object
                  dense
                  multiple
                  required
                  @input="editUser"
                ></v-autocomplete>
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
                  :items="selected.tasks"
                  item-children="items"
                  dense
                  item-key="id"
                  selected-color="accent"
                  color="primary"
                  open-all
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
          <v-btn color="error" text v-show="Object.keys(selected).length > 1" @click="deleteErp">Excluir</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeSelectedErpOrder">Fechar</v-btn>
          <v-btn color="blue darken-1" text @click="saveErpOrder">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import { mapState, mapActions } from "vuex"
import uuidv4 from '@/utilities/uidGenerator'

const computed = mapState({
  selected: state => state.erp.selected,
  dialog: state => state.erp.editErp,
  users: state => state.users.userList,
  name: state => state.erp.editingName,
  detail: state => state.erp.editingDetail,
  editingUser: state => state.erp.editingUser,
  editingAdmin: state => state.erp.editingAdmin,
  editingTask: state => state.erp.editingTask
})

const userMethods = mapActions("users", ["readUsers"])

const erpMethods = mapActions("erp", 
["saveErpOrder", 
"editErpOrder", 
"deleteErp",
"editName",
"editUser",
"editAdmin",
"closeSelectedErpOrder"
])

export default {
  computed,
  methods: Object.assign({}, erpMethods, userMethods, {
    addTask() {
      this.selected.tasks.push({
        id: uuidv4(),
        name: this.newTask,
        items: [],
        status: 'Pendente',
        priority: '',
        tags: [],
        users: [],
        created_by: this.editingAdmin
      })
      console.log(this.selected.tasks)
      this.newTask = ""
    },
    editNewTask(payload) {
      this.newTask = payload
    },
    appendTaskItem(item) {
        let currentCount = item.items.length + 1
        item.items.push({ id: currentCount })
    },
    removeTaskOrItem(item) {
      this.selected.tasks = this.selected.tasks.filter(m => m.id != item.id)
      this.selected.tasks.forEach(element => {
        element.items = element.items.filter(m => m.id != item.id)
      })
    }
  }),
  data() {
    return {
      newTask: "",
      taskCounter: 0
    }
  },
  mounted() {
    this.readUsers()
  }
}
</script>
<style lang="stylus"></style>