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
            <bar-chart
              bar-title="Tempo Trabalhado x Cliente"
              :bar-data="workedDaysPerClient"
              bar-data-name="Em Dias"
              :bar-data1="workedHoursPerClient"
              bar-data1-name="Em Horas"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <donut-chart
              dnt-title="Ordens x Usuário"
              :dnt-data="ordersPerUser"
              dnt-legend="Usuário"
            ></donut-chart>
          </v-col>
          <v-col cols="4">
            <donut-chart
              dnt-title="Tarefas x Usuário"
              :dnt-data="tasksPerUser"
              dnt-legend="Usuário"
            ></donut-chart>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import DonutChart from "@/components/shared/DonutChart";
import BarChart from "@/components/shared/BarChart";
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
    },
    workedDaysPerClient: (state, store) => {
      return store.getWorkedDaysByClients({}).map(m => ({
        x: m.client,
        y: m.spentTimeInDays
      }));
    },
    workedHoursPerClient: (state, store) => {
      return store.getWorkedHoursByClients({}).map(m => ({
        x: m.client,
        y: m.spentTimeInHours
      }));
    },
    ordersPerUser: (state, store) => {
      return store.filterOrdersGroupedByUsers({}).map(m => ({
        axisX: m.user.name,
        axisY: m.ordersCount,
        text: `${m.ordersCount}`
      }));
    },
    tasksPerUser: (state, store) => {
      return store.filterTasksGroupedByUsers({}).map(m => ({
        axisX: m.user.name,
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

const methods = Object.assign(
  {},
  mapActions("productivity", ["loadOrders"]),
  mapActions("users", ["readUsers"])
);

export default {
  computed,
  methods,
  components: { DonutChart, BarChart },
  data() {
    return {};
  },
  mounted() {
    this.loadOrders();
    this.readUsers();
  }
};
</script>