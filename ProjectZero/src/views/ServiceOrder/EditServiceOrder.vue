<template>
  <div>
    <v-row dense>
      <v-col cols="12">
        <v-card class="mx-auto mt-5">
          <v-toolbar class="primary white--text" dark>
            <h3>{{ selected[0].name }}</h3>
            <v-spacer></v-spacer>
            <v-icon right class="white--text">receipt</v-icon>
          </v-toolbar>
          <v-row class="ml-5 mt-5 mr-5">
            <v-col cols="12">
              <v-autocomplete
                :value="client"
                @input="updateClient"
                :items="clientList"
                color="primary"
                item-text="Cliente"
                label="Cliente"
                return-object
                dense
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row class="ml-5 mr-5">
            <v-col cols="6">
              <v-text-field
                prepend-icon="event"
                label="Data de criação:"
                disabled
                dense
                :value="selected[0].creation_date"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                prepend-icon="event"
                dense
                label="Data de encerramento:"
                :value="selected[0].end_date"
                @input="updateTaskEndDate"
              ></v-text-field>
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
    <EditServiceOrderTask></EditServiceOrderTask>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import draggable from "vuedraggable";
import TaskCard from "@/components/shared/TaskCard.vue";
import EditServiceOrderTask from "./EditServiceOrderTask.vue";

const computed = mapState({
  selected: state => state.productionOrders.selected || [{}],
  statusList: state => state.productionOrders.statusList,
  tasks: state => state.productionOrders.selectedOrderTasks,
  columns: state => state.productionOrders.kanbanColumns,
  clientList: state => state.clients.clients.map(m => m.name)
});

const orderMethods = mapActions("productionOrders", [
  "selectOrder",
  "searchFor",
  "reloadOrders",
  "updateClient",
  "showTaskDialog",
  "loadTasksByOrder",
  "saveAllTasks"
]);

const clientMethods = mapActions("clients", ["loadClients"]);

export default {
  props: ["id"],
  components: {
    TaskCard,
    draggable,
    EditServiceOrderTask
  },
  computed,
  methods: Object.assign({}, orderMethods, clientMethods, {
    onMoveTask() {
      this.columns.forEach(column => {
        column.tasks.forEach(task => {
          task.status = column.title;
        });
      });
      this.saveAllTasks();
    }
  }),
  data: () => ({}),
  mounted() {
    this.loadTasksByOrder();
    this.loadClients();
  }
};
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