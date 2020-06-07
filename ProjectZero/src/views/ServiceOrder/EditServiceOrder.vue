<template>
  <div>
    <v-row>
      <v-col cols="12">
        <h3>{{selected.name}}</h3>
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
          <p class="text-gray-700 font-semibold font-sans tracking-wide text-sm">{{column.title}}</p>
          <!-- Draggable component comes from vuedraggable. It provides drag & drop functionality -->
          <draggable :list="column.tasks" :animation="200" ghost-class="ghost-card" group="tasks">
            <!-- Each element from here will be draggable and animated. Note :key is very important here to be unique both for draggable and animations to be smooth & consistent. -->
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
    <EditServiceOrderTask></EditServiceOrderTask>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import draggable from "vuedraggable";
import TaskCard from "@/components/shared/TaskCard.vue";
import EditServiceOrderTask from "./EditServiceOrderTask.vue"

const computed = mapState("productionOrders", {
  selected: state => state.selected,
  statusList: state => state.statusList,
  tasks: state => state.selectedOrderTasks,
  columns: state => state.kanbanColumns
});

const methods = mapActions("productionOrders", [
  "selectOrder",
  "searchFor",
  "reloadOrders",
  "showTaskDialog",
  "loadTasksByOrder"
]);
export default {
  props: ["id"],
  components: {
    TaskCard,
    draggable,
    EditServiceOrderTask
  },
  computed,
  methods,
  data: () => ({ }),
  mounted() {
    this.loadTasksByOrder()
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