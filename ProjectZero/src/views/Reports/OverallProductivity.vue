<template>
  <v-row justify="center">
    <v-col cols="10">
      <v-card class="mx-auto">
        <v-toolbar class="primary white--text" dark>
          <h3>Produtividade Geral</h3>
          <v-spacer></v-spacer>
          <v-icon right class="white--text">pie_chart</v-icon>
        </v-toolbar>
        <v-row></v-row>
        <v-row>
          <v-col cols="4">
            <donut-chart
              dnt-title="Ordens x Cliente"
              :dnt-data="ordersPerClient"
              dnt-legend="Cliente"
            />
          </v-col>
          <v-col cols="4">
            <donut-chart
              dnt-title="Tarefas x Cliente"
              :dnt-data="tasksPerClient"
              dnt-legend="Cliente"
            />
          </v-col>
          <v-col cols="4">
            <donut-chart />
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import DonutChart from "@/components/shared/DonutChart";
import { mapState, mapActions, mapGetters } from "vuex";

const computed = Object.assign(
  {},
  mapState("productivity", {
    ordersPerClient: (state, store) => {
      return store.filterOrdersGroupedByClients({}).map(m => ({
        axisX: m.client,
        axisY: m.ordersCount,
        text: `${m.ordersCount}`
      }));
    },
    tasksPerClient: (state, store) => {
      return store.filterTasksGroupedByClients({}).map(m => ({
        axisX: m.client,
        axisY: m.tasksCount,
        text: `${m.tasksCount}`
      }));
    }
  }),
  mapGetters("productivity", [
    "filterOrdersGroupedByClients",
    "filterTasksGroupedByClients"
  ])
);

const methods = mapActions("productivity", ["loadOrders"]);

export default {
  computed,
  methods,
  components: { DonutChart },
  data() {
    return {};
  },
  mounted() {
    this.loadOrders();
  }
};
</script>