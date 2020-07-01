<template>
  <div>
    <Alert class="mt-2"></Alert>
    <v-row dense>
      <v-col cols="12">
        <v-card class="mx-auto mt-5">
          <v-toolbar class="primary white--text" dark>
            <h3>{{ selected.name }}</h3>
            <v-spacer></v-spacer>
             <v-btn v-if="isAdmin" color="primary" class="white--text" small dark @click="deleteOrder">Excluir Ordem
               <v-icon right class="white--text">mdi-delete</v-icon>
             </v-btn>
            <v-icon right class="white--text">receipt</v-icon>
          </v-toolbar>
          <v-row class="ml-5 mt-5 mr-5">
            <v-col cols="8">
              <v-autocomplete
                :value="selected.client"
                @input="updateClient"
                :items="clientList"
                color="primary"
                item-text="name"
                label="Cliente"
                return-object
                dense
                :disabled="!isAdmin"
              ></v-autocomplete>
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="duration"
                label="Estimativa em horas:"
                disabled
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="ml-5 mr-5">
            <v-col cols="4">
              <DatePicker
                dateLabel="Data de criação:"
                :value="selected.creation_date"
                ref="DatePicker"
                :disable="true"
              />
            </v-col>
            <v-col cols="4">
              <DatePicker
                dateLabel="Data de Início:"
                :value="selected.start_date"
                ref="DatePicker"
                v-on:update="updateOrderStartDate"
                :disable="!isAdmin"
              />
            </v-col>
            <v-col cols="4">
              <DatePicker
                dateLabel="Data de encerramento:"
                :value="selected.end_date"
                ref="DatePicker"
                v-on:update="updateOrderEndDate"
                :disable="!isAdmin"
              />
            </v-col>
          </v-row>
          <v-row class="ml-5 mt-5 mr-5">
            <v-col cols="12">
              <v-autocomplete
                  v-model="selected.administrator"
                  :items="users"
                  color="primary"
                  item-text="name"
                  label="Administrador"
                  return-object
                  dense
                  single
                  :disabled="!isAdmin"
                ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row class="ml-5 mr-5">
            <v-col cols="6">
              <v-autocomplete
                v-model="selected.users"
                :items="users"
                color="primary"
                item-text="name"
                label="Usuários:"
                return-object
                dense
                multiple
                :disabled="!isAdmin"
              ></v-autocomplete>
            </v-col>
            <v-col cols="6">
              <v-autocomplete
                v-model="selected.groups"
                :items="groups"
                color="primary"
                item-text="name"
                label="Grupos:"
                return-object
                dense
                multiple
                :disabled="!isAdmin"
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row class="ml-5 mt-5 mr-5">
            <v-col>
              <v-btn
                class=" mt-1"
                color="success"
                dark
                @click="showTaskDialog({name: ''})"
                style="padding-left:8px; margin-right:8px;"
              >
                <v-icon>mdi-plus</v-icon>Tarefa
              </v-btn>
              <v-btn color="blue" dark @click="filtertasks()" class=" mt-1"
               >
                Filtrar <v-icon style="padding-left:8px;">filter_list</v-icon>
              </v-btn>
              </v-col>
              <v-col
               class="d-flex justify-end">
              <v-btn
                color="primary"
                dark
                @click="returnToServiceOrders"
                class=" mt-1"
              >
                <v-icon style="padding-right:8px; padding-left:0px;">keyboard_return</v-icon>Voltar
              </v-btn>
              </v-col>
           
          </v-row>
          <v-row>
            <v-col
              cols="12"
              :sm="columns.length > 0 ? 12 / columns.length : 12"
              v-for="column in columns"
              :key="column.title"
            >
              <div class="grey lighten-4 kanban-column ma-1 pa-5">
                <p
                  class="text-gray-700 font-semibold font-sans tracking-wide text-sm"
                >{{column.title}}</p>
                <!-- Draggable component comes from vuedraggable. It provides drag & drop functionality -->
                <draggable
                  :list="column.tasks"
                  @end="onMoveTask"
                  :animation="200"
                  ghost-class="ghost-card"
                  class="kanban-column"
                  group="status"
                  @change="onTaskDrag($event, column.task)"
                >
                  <!-- <transition-group> -->
                  <task-card
                    v-for="(task) in column.tasks"
                    :key="task.id"
                    :task="task"
                    class="mt-3 cursor-move"
                    v-on:click.native="showTaskDialog(task)"
                  ></task-card>
                  <!-- </transition-group> -->
                </draggable>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-btn color="primary" dark fixed bottom right fab @click="saveServiceOrder">
      <v-icon>mdi-content-save</v-icon>
    </v-btn>
    <EditServiceOrderTask></EditServiceOrderTask>
  </div>
</template>

<script>
import DatePicker from "@/components/shared/DatePicker"
import { mapState, mapActions } from "vuex"
import draggable from "vuedraggable"
import Alert from "@/components/shared/Alert"
import TaskCard from "@/components/shared/TaskCard.vue"
import EditServiceOrderTask from "./EditServiceOrderTask.vue"

const computed = mapState({
  selected: state => state.serviceOrders.selected || {},
  statusList: state => state.serviceOrders.statusList,
  tasks: state => state.serviceOrders.selectedOrderTasks,
  columns: state => state.serviceOrders.kanbanColumns,
  clientList: state => state.clients.clients,
  users: state => state.users.userList,
  groups: state => state.groups.groups,
  isAdmin: state => state.auth.user.email == state.serviceOrders.selected.administrator?.email,
  duration: function(state) {
    let accumulatedTime = 0
    state.serviceOrders.selectedOrderTasks.forEach(task => {
      accumulatedTime += task.estimated_duration ? parseInt(task.estimated_duration) : 0;
    })

    return accumulatedTime;
  } 
})

const userMethods = mapActions("users", ["readUsers"]);
const groupMethods = mapActions("groups", ["loadGroups"]);

const orderMethods = mapActions("serviceOrders", [
  "selectOrder",
  "searchFor",
  "reloadOrders",
  "updateClient",
  "updateOrderStartDate",
  "updateOrderEndDate",
  "showTaskDialog",
  "loadTasksByOrder",
  "onTaskDrag",
  "saveServiceOrder",
  "deleteOrder",
  "returnToServiceOrders"
])

const clientMethods = mapActions("clients", ["loadClients"])

export default {
  props: ["id"],
  components: {
    Alert,
    TaskCard,
    draggable,
    EditServiceOrderTask,
    DatePicker
  },
  computed,
  methods: Object.assign({}, orderMethods, clientMethods, userMethods, groupMethods, {
    filtertasks() {
      this.showOnlyMine = !this.showOnlyMine
      this.loadTasksByOrder(this.showOnlyMine)
    }
  }),
  data: () => ({
    showOnlyMine: false
  }),
  mounted() {
    this.loadTasksByOrder()
    this.loadClients()
    this.readUsers()
    this.loadGroups()
  }
}
</script>

<style scoped>
.kanban-column {
  height: 100%;
}
/* Unfortunately @apply cannot be setup in codesandbox, 
but you'd use "@apply border opacity-50 border-blue-500 bg-gray-200" here */
.ghost-card {
  opacity: 0.5;
  background: #f7fafc;
  border: 1px solid #4299e1;
}
</style>