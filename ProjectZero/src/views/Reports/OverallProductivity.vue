<template>
  <v-row justify="center">
    <v-col cols="10">
      <v-card class="mx-auto">
        <v-toolbar class="primary white--text" dark>
          <h3>Produtividade Geral</h3>
          <v-spacer></v-spacer>
          <v-icon right class="white--text">pie_chart</v-icon>
        </v-toolbar>
        <v-row>
          <v-col cols="6">
            <v-row>
              <v-col cols="2">
                <div class="text-right mt-1 pt-4">Período:</div>
              </v-col>
              <v-col cols="3">
                <date-picker date-label="Início" v-model="startedAt" />
              </v-col>
              <v-col cols="1">
                <div class="text-center mt-1 pt-4">até</div>
              </v-col>
              <v-col cols="3">
                <date-picker date-label="Fim" v-model="endedAt" />
              </v-col>
              <v-col cols="3">
                <div class="mt-1 pt-2">
                  <v-btn color="success" dark @click="reloadCharts">
                    <v-icon>mdi-search</v-icon>Carregar
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <donut-chart
              :key="dntOrderPerClients"
              dnt-title="Ordens x Cliente"
              :dnt-data="ordersPerClient"
              dnt-legend="Cliente"
            />
          </v-col>
          <v-col cols="4">
            <donut-chart
              :key="dntTaskPerClients"
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
              :key="dntOrderPerUsers"
              dnt-title="Ordens x Usuário"
              :dnt-data="ordersPerUser"
              dnt-legend="Usuário"
            ></donut-chart>
          </v-col>
          <v-col cols="4">
            <donut-chart
              :key="dntTaskPerUsers"
              dnt-title="Tarefas x Usuário"
              :dnt-data="tasksPerUser"
              dnt-legend="Usuário"
            ></donut-chart>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <line-chart
              line-title="Relatório de Tempo de Trabalho"
              :line-data="chartSeries"
              :line-y-config="yConfig"
            ></line-chart>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import DonutChart from "@/components/shared/DonutChart";
import BarChart from "@/components/shared/BarChart";
import LineChart from "@/components/shared/LineChart";
import DatePicker from "@/components/shared/DatePicker";
import { mapState, mapActions, mapGetters } from "vuex";
import { moment } from "@/main";

const computed = Object.assign(
  {},
  mapState("productivity", {
    ordersPerClient(state, store) {
      let filters = {
        startedAt: this.startedAt.unix(),
        endedAt: this.endedAt.unix()
      };
      return store.filterOrdersGroupedByClients(filters).map(m => ({
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
    },
    chartSeries: (state, store) => {
      let infos = store.getWorkedHoursByUsersByDate({});
      return infos.map(userData => ({
        title: userData.user.name,
        data: userData.workedHoursByDay.map(n => ({ x: n.day, y: n.hours }))
      }));
    }
  }),
  mapGetters("productivity", [
    "filterOrdersGroupedByClients",
    "filterTasksGroupedByClients",
    "getWorkedDaysByClients",
    "getWorkedHoursByClients",
    "filterOrdersGroupedByUsers",
    "filterTasksGroupedByUsers",
    "getWorkedHoursByUsersByDate"
  ])
);

const methods = Object.assign(
  {},
  mapActions("productivity", ["loadOrders", "loadSessionInfo"]),
  mapActions("users", ["readUsers"])
);

export default {
  computed,
  methods: Object.assign(methods, {
    reloadCharts() {
      this.dntOrderPerClients += 1;
      this.dntTaskPerClients += 1;
      this.dntOrderPerUsers += 1;
      this.dntTaskPerUsers += 1;
    }
  }),
  components: { DonutChart, BarChart, LineChart, DatePicker },
  data() {
    return {
      dntOrderPerClients: 0,
      dntTaskPerClients: 5,
      dntOrderPerUsers: 10,
      dntTaskPerUsers: 15,
      yConfig: { title: "Tempo trabalhado (m)" },
      startedAt: moment().add(-15, "day"),
      endedAt: moment()
    };
  },
  mounted() {
    this.loadOrders();
    this.loadSessionInfo();
    this.readUsers();
  }
};
</script>