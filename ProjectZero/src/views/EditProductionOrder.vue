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
            ></task-card>
            <!-- </transition-group> -->
          </draggable>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import draggable from "vuedraggable";
import TaskCard from "@/components/shared/TaskCard.vue";

const computed = mapState("productionOrders", {
  selected: state => state.selected,
  statusList: state => state.statusList,
  tasks(state) {
    if (state.selectedOrderTasks.length) return state.selectedOrderTasks;
    return [
      {
        id: 1,
        name: "Tarefa 1",
        creationDate: "04/06/2020",
        status: "Pendente"
      },
      {
        id: 1,
        name: "Tarefa 2",
        creationDate: "04/06/2020",
        status: "Em progresso"
      },
      {
        id: 1,
        name: "Tarefa 3",
        creationDate: "05/06/2020",
        status: "Pendente"
      },
      {
        id: 1,
        name: "Tarefa 4",
        creationDate: "05/06/2020",
        status: "Finalizada"
      },
      {
        id: 1,
        name: "Tarefa 5",
        creationDate: "05/06/2020",
        status: "Pendente"
      },
      {
        id: 1,
        name: "Tarefa 6",
        creationDate: "06/06/2020",
        status: "Finalizada"
      },
      {
        id: 1,
        name: "Tarefa 7",
        creationDate: "06/06/2020",
        status: "Pendente"
      },
      {
        id: 1,
        name: "Tarefa 8",
        creationDate: "06/06/2020",
        status: "Em progresso"
      }
    ];
  }
});

const methods = mapActions("productionOrders", [
  "selectOrder",
  "searchFor",
  "reloadOrders"
]);
export default {
  props: ["id"],
  components: {
    TaskCard,
    draggable
  },
  computed,
  methods,
  data: () => ({
    columns: []
  }),
  mounted() {
    console.log("this.selected");
    console.log(this.selected);
    console.log("this.statusList");
    console.log(this.statusList);
    console.log("this.tasks");
    console.log(this.tasks);
    this.columns = this.statusList.map(status => ({
      title: status,
      tasks: this.tasks.filter(task => task.status == status)
    }));
    console.log("this.columns");
    console.log(this.columns);
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