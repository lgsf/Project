<template>
  <div>
    <Alert class="mt-2"></Alert>
    <v-row dense>
      <v-col cols="12">
        <div class="text-center screen-margin-top" v-if="isLoading">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>
        <v-card v-if="!isLoading" class="mx-auto mt-5">
          <v-toolbar class="primary white--text" dark>
            <h3>{{ selected.name }} - {{selected.status}}</h3>
            <v-spacer></v-spacer>
            <div class="text-center">
            <v-menu>
              <template v-slot:activator="{ on: menu, attrs }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on: tooltip }">
                    <v-btn
                      :disabled="!isAdmin"
                      color="primary"
                      dark
                      v-bind="attrs"
                      v-on="{ ...tooltip, ...menu }"
                    ><span v-if="checkWidth">Opções da Ordem
                    <v-icon right class="white--text">settings</v-icon></span>
                    <span v-if="!checkWidth"><v-icon class="white--text">settings</v-icon></span>
                    </v-btn>
                  </template>
                  <span>Iniciar, Finalizar, Cancelar ou Excluir a Ordem</span>
                </v-tooltip>
              </template>
              <v-list >
                <v-list-item
                  v-for="(item, index) in items"
                  :key="index"
                  @click="checkOrderMethod(item.title)"
                >
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
            <v-icon right class="white--text">receipt</v-icon>
          </v-toolbar>
          <v-row class="ml-5 mt-5 mr-5">
            <v-col cols="8">
              <v-autocomplete
                v-if="selected.status == 'Pendente'"
                :value="selected.client"
                @input="updateClient"
                :items="activeClientList"
                color="primary"
                item-text="name"
                label="Cliente"
                return-object
                dense
                :disabled="!isAdmin"
              ></v-autocomplete>
              <v-autocomplete
                v-else
                :value="selected.client"
                @input="updateClient"
                :items="clientList"
                color="primary"
                item-text="name"
                label="Cliente"
                return-object
                dense
                :disabled="true"
              ></v-autocomplete>
            </v-col>
            <v-col cols="4">
              <v-text-field v-model="duration" label="Estimativa em horas:" disabled dense></v-text-field>
            </v-col>
          </v-row>
          <v-row class="ml-5 mr-5">
            <v-col cols="12" md="4" lg="4" xl="4" sm="12" >
              <v-text-field v-model="selected.creation_date" label="Data de criação:" disabled></v-text-field>
            </v-col>
            <v-col cols="12" md="4" lg="4" xl="4" sm="12" v-if="selected.status == 'Pendente'">
              <DatePicker
                dateLabel="Data prevista de início:"
                :value="selected.start_date"
                ref="DatePicker"
                v-on:update="updateOrderStartDate"
                :disable="!isAdmin"
              />
            </v-col>
            <v-col cols="12" md="4" lg="4" xl="4" sm="12" v-if="selected.status == 'Em progresso' || selected.status == 'Finalizada' || selected.status == 'Cancelada'">
              <v-text-field v-model="selected.start_date_time" label="Data de início:" disabled></v-text-field>
            </v-col>
            <v-col cols="12" md="4" lg="4" xl="4" sm="12" v-if="selected.status == 'Em progresso' || selected.status == 'Pendente'" >
              <DatePicker
                dateLabel="Data prevista de encerramento:"
                :value="selected.end_date"
                ref="DatePicker"
                v-on:update="updateOrderEndDate"
                :disable="!isAdmin"
              />
            </v-col>
            <v-col cols="12" md="4" lg="4" xl="4" sm="12" v-else-if="selected.status == 'Finalizada'">
              <v-text-field v-model="selected.end_date_time" label="Data de encerramento:" disabled></v-text-field>
            </v-col>
            <v-col cols="12" md="4" lg="4" xl="4" sm="12" v-else-if="selected.status == 'Cancelada'">
              <v-text-field v-model="selected.end_date_time" label="Data de cancelamento:" disabled></v-text-field>
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
            <v-col cols="12" md="6" lg="6" xl="6" sm="12">
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
            <v-col cols="12" md="6" lg="6" xl="6" sm="12">
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
            <v-col v-if="checkWidth">
              <v-btn
                class="mt-1"
                color="success"
                dark
                @click="showTaskDialog({name: ''})"
                style="padding-left:8px; margin-right:8px;"
              >
                <v-icon>mdi-plus</v-icon>Tarefa
              </v-btn>
              <v-btn v-if="checkWidth" color="blue" dark @click="filtertasks()" class="mt-1">
                <span v-if="!showOnlyMine">Minhas tarefas</span> 
                <span v-if="showOnlyMine">Todas tarefas</span>
                <v-icon style="padding-left:8px;">filter_list</v-icon>
              </v-btn>
            </v-col>
            <v-col class="d-flex justify-center" v-if="!checkWidth">
              <v-btn
                class="mt-1 mr-1"
                color="success"
                dark
                @click="showTaskDialog({name: ''})"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
              <v-btn color="blue" dark @click="filtertasks()" class="mt-1">
                <v-icon >filter_list</v-icon>
              </v-btn>
              <v-btn v-show="!checkWidth" color="primary" dark @click="returnToServiceOrders" class="mt-1 ml-1">
                <v-icon >keyboard_return</v-icon>
              </v-btn>
            </v-col>
            <v-col class="d-flex justify-end" v-if="checkWidth">
              <v-btn color="primary" dark @click="returnToServiceOrders" class="mt-1">
                <v-icon style="padding-right:8px; padding-left:0px;">keyboard_return</v-icon>Voltar
              </v-btn>
            </v-col>
          </v-row>
          <v-row class="ml-1 mr-1">
            <v-col
              cols="12"
              style="min-width:260px"
              class="pl-0 pr-0"
              :lg="columns.length > 0 ? 12 / columns.length : 12"
              :md="columns.length > 0 ? 24 / columns.length : 12"
              v-for="column in columns"
              :key="column.title"
            >
              <div class="grey lighten-4 kanban-column ma-1 pa-2">
                <p
                  class="text-gray-700 font-semibold font-sans tracking-wide text-sm"
                >{{column.title}}</p>
                <!-- Draggable component comes from vuedraggable. It provides drag & drop functionality -->
                <draggable
                  :list="column.tasks"
                  :animation="200"
                  :move="onMoveTask"
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
                    :action="function(){ showTaskDialog(task) }"
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
    <EditServiceOrderTask />
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
  isLoading: state => state.general.isLoading,
  selected: state => state.serviceOrders.selected || {},
  statusList: state => state.serviceOrders.statusList,
  orderStatus: state => state.serviceOrders.selected.status,
  tasks: state => state.serviceOrders.selectedOrderTasks,
  columns: state => state.serviceOrders.kanbanColumns,
  clientList: state => state.clients.clients,
  activeClientList: state => state.clients.activeClients,
  users: state => state.users.userList,
  groups: state => state.groups.groups,
  showTaskDialog1: state => state.serviceOrders.showTaskDialog,
  currentUserEmail: state => state.auth.user.email,
  isAdmin: function(state) {
    return (
      state.auth.userGroup == "bmyiE5pvx66Ct7Wmj78b" ||
      state.auth.user.email == state.serviceOrders.selected.administrator?.email
    )
  },
  duration: function(state) {
    let accumulatedTime = 0
    let doneTime = 0
    state.serviceOrders.selectedOrderTasks.forEach(task => {
      accumulatedTime += task.estimated_duration
        ? parseInt(task.estimated_duration)
        : 0
      if(task.status === "Finalizada" || task.status === "Cancelada" ){
        doneTime += task.estimated_duration
        ? parseInt(task.estimated_duration)
        : 0
      }
    })
    return doneTime + "/" + accumulatedTime 
  }
})

const userMethods = mapActions("users", ["readUsers"])
const groupMethods = mapActions("groups", ["loadGroups"])

const orderMethods = mapActions("serviceOrders", [
  "selectOrder",
  "searchFor",
  "reloadOrders",
  "updateClient",
  "updateStatus",
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
  computed: Object.assign({}, computed, {
       checkWidth() {
            if(this.width > 752){
              return true
            }
            else return false
        }
    }),
  methods: Object.assign({}, orderMethods, clientMethods, userMethods, groupMethods, {
      filtertasks() {
        this.showOnlyMine = !this.showOnlyMine
        this.loadTasksByOrder({ filterCurrentUser: this.showOnlyMine })
      },
      onMoveTask(evt) {
        if (this.currentUserEmail != evt.draggedContext.element.users?.email && this.orderStatus != 'Em progresso')
          return false

        if(evt.draggedContext?.element?.dependencyTask != null && evt.draggedContext?.element?.dependencyTask != '')
        {
          let dependentTaskStatus = this.tasks.find(t => t.id == evt.draggedContext.element.dependencyTask).status;
          return dependentTaskStatus == "Finalizada" || dependentTaskStatus == "Cancelada"
        }
      },
      checkOrderMethod(title){
        switch (title){
          case "Iniciar":
            return this.updateStatus('Em progresso')
          case "Finalizar":
            return this.checkIfTasksDone(this.selected)
          case "Cancelar":
            return this.updateStatus('Cancelada')
          case "Excluir":
            return this.deleteOrder()
        }
      },
      checkOrderStatus(selected){
        setInterval(() => {
          switch (selected.status){
            case "Pendente":
              return 
            case "Em progresso":
              return this.items = 
                [
                  { title: 'Finalizar' },
                  { title: 'Cancelar' },
                  { title: 'Excluir' },
                ]
            case "Finalizada":
              return this.items = 
                [
                  { title: 'Excluir' },
                ]
            case "Cancelada":
              return this.items = 
                [
                  { title: 'Excluir' },
                ]
          }
        }, 300)
      },
      checkIfTasksDone(selected){
        if (selected.tasks.some(e => e.status == "Em progresso")){
          alert("Você não pode finalizar a ordem: " + selected.name + "! Ainda existem tarefas em progresso.")
        }
        else if (selected.tasks.some(e => e.status == "Pendente")){
          if (confirm("Ainda existem tarefas pendentes na ordem: " + selected.name + ". Deseja finalizar?"))
            {
              this.updateStatus('Finalizada')
            }
          else return
        }
        else this.updateStatus('Finalizada')
      }
    }
    ),
  data: () => ({
    showOnlyMine: false,
    items: [
        { title: 'Iniciar' },
        { title: 'Cancelar' },
        { title: 'Excluir' },
      ],
    width: window.innerWidth
  }),
  mounted() {
    window.onresize = () => {
        this.width = window.innerWidth
    }
    this.loadTasksByOrder()
    this.loadClients()    
    this.readUsers()
    this.loadGroups()
    this.checkOrderStatus(this.selected)
  },
}
</script>

<style scoped>
.kanban-column {
  height: 100%;
}

.ghost-card {
  opacity: 0.5;
  background: #f7fafc;
  border: 1px solid #4299e1;
}
</style>