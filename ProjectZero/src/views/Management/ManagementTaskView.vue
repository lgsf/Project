<template>
  <div>
    <Alert class="mt-2"></Alert>
    <v-row dense>
      <v-col cols="12">
        <v-card class="mx-auto mt-5">
          <v-toolbar class="primary white--text" dark>
            <h3>Gerenciamento - Visão por task</h3>
            <v-spacer></v-spacer>
            <v-icon right class="white--text">receipt</v-icon>
          </v-toolbar>
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
                  <management-task-card
                    v-for="(task) in column.tasks"
                    :key="task.id"
                    :task="task"
                    class="mt-3 cursor-move"
                    v-on:click.native="openServiceOrder(task)"
                  ></management-task-card>
                  <!-- </transition-group> -->
                </draggable>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import draggable from "vuedraggable";
import Alert from "@/components/shared/Alert";
import ManagementTaskCard from "@/components/shared/ManagementTaskCard.vue";

const computed = mapState({
  columns: state => state.management.kanbanColumns
});

const orderMethods = mapActions("management", [
  "loadKanban"
]);

export default {
  props: ["id"],
  components: {
    Alert,
    ManagementTaskCard,
    draggable
  },
  computed,
  methods: Object.assign({}, orderMethods, {
    openServiceOrder(task) {
        console.log(task)
    },
    onTaskDrag(task) {
        console.log(task)
    }
  }),
  mounted() {
    this.loadKanban()
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