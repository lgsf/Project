<template>
  <div>
    <Alert class="mt-2"></Alert>
    <v-row dense>
      <v-col cols="12">
        <v-card class="mx-auto mt-5">
          <v-toolbar class="primary white--text" dark>
            <h3>{{ selected.name }}</h3>
            <v-spacer></v-spacer>
            <v-icon right class="white--text">receipt</v-icon>
          </v-toolbar>
          <v-row class="ml-5 mt-5 mr-5">
            <v-col cols="12">
              <v-autocomplete
                :value="selected.client"
                @input="updateClient"
                :items="clientList"
                color="primary"
                item-text="name"
                label="Cliente"
                return-object
                dense
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row class="ml-5 mr-5">
            <v-col cols="5">
              <DatePicker
                dateLabel="Data de criação:"
                :value="selected.creation_date"
                ref="DatePicker"
                :disable="true"
              />
            </v-col>
            <v-col cols="5">
              <DatePicker
                dateLabel="Data de encerramento:"
                :value="selected.end_date"
                ref="DatePicker"
                v-on:update="updateOrderEndDate"
              />
            </v-col>
            <v-col cols="2">
              <v-btn color="error" text @click="deleteOrder">Deletar</v-btn>
            </v-col>
          </v-row>
          <v-row class="ml-5 mt-5 mr-5">
            <v-col cols="12">
              <v-btn
                color="success"
                dark
                @click="showTaskDialog({name: ''})"
                style="padding-left:8px"
              >
                <v-icon>mdi-plus</v-icon>Nova task
              </v-btn>
              <v-btn color="blue" dark @click="filtertasks()" style="margin-left:8px;">
                <v-icon>filter-alt</v-icon>Somente as minhas
              </v-btn>
              <v-btn
                color="primary"
                right
                dark
                @click="returnToServiceOrders"
                style="margin-left:8px; padding-left:8px"
                
              >
                <v-icon style="padding-right:8px">keyboard_return</v-icon>Voltar
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

    <v-btn color="info" dark fixed bottom right fab @click="saveServiceOrder">
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
  clientList: state => state.clients.clients
})

const orderMethods = mapActions("serviceOrders", [
  "selectOrder",
  "searchFor",
  "reloadOrders",
  "updateClient",
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
  methods: Object.assign({}, orderMethods, clientMethods, {
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