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
                <v-text-field label="Nome" v-model="selected.name" required></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-autocomplete
                  v-model="selected.administrator"
                  :items="users"
                  color="primary"
                  item-text="name"
                  label="Administrador"
                  return-object
                  dense
                  required
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-autocomplete
                  v-model="selected.users"
                  :items="users"
                  color="primary"
                  item-text="name"
                  label="Usuários"
                  return-object
                  dense
                  multiple
                  required
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
          <v-btn color="error" text v-show="selected" @click="deleteErp">Deletar</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeSelectedErpOrder(false)">Fechar</v-btn>
          <v-btn color="blue darken-1" text @click="saveErpOrder">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import { mapState, mapActions } from "vuex"

const computed = mapState({
  selected: state => state.erp.selected,
  dialog: state => state.erp.editErp,
  users: state => state.users.userList
})

const userMethods = mapActions("users", ["readUsers"])

const erpMethods = mapActions("erp", 
["saveErpOrder", 
"editErpOrder", 
"deleteErp",
"closeSelectedErpOrder"
])

export default {
  computed,
  methods: Object.assign({}, erpMethods, userMethods, {
    addTask() {
      if (!this.selected.tasks) this.selected.tasks = []
      let length = this.selected.tasks.length
      let currentCount = !length
        ? 0
        : this.selected.tasks[length - 1].id + 5000
      this.selected.tasks.push({
        id: currentCount,
        name: this.newTask,
        items: [],
        status: 'Pendente'
      })
      this.newTask = ""
    },
    editNewTask(payload) {
      this.newTask = payload
    },
    appendTaskItem(item) {
        console.log("teste")
        let currentCount = item.id + item.items.length + 1
        item.items.push({ id: currentCount, name: '', description: "", done: false })
        console.log(item.items)
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