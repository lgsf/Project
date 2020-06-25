<template>
  <v-row style="min-width:70vw;">
    <v-col >
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
        <v-row v-if="showCharts">
          <v-col cols="4">
            <donut-chart
              :key="dntOrderPerClients"
              dnt-title="Ordens x Cliente"
              :dnt-data="ordersPerClient"
              dnt-legend="Cliente"
              dnt-height="350px"
            />
          </v-col>
          <v-col cols="4">
            <donut-chart
              :key="dntTaskPerClients"
              dnt-title="Tarefas x Cliente"
              :dnt-data="tasksPerClient"
              dnt-legend="Cliente"
              dnt-height="350px"
            />
          </v-col>
          <v-col cols="4">
            <bar-chart
              :key="barTimePerClients"
              bar-title="Tempo Trabalhado x Cliente"
              :bar-data="workedDaysPerClient"
              bar-data-name="Em Dias"
              :bar-data1="workedHoursPerClient"
              bar-data1-name="Em Horas"
              bar-height="350px"
            />
          </v-col>
        </v-row>
        <v-row v-if="showCharts">
          <v-col cols="6">
            <donut-chart
              :key="dntOrderPerUsers"
              dnt-title="Ordens x Usuário"
              :dnt-data="ordersPerUser"
              dnt-legend="Usuário"
              dnt-height="350px"
            ></donut-chart>
          </v-col>
          <v-col cols="6">
            <donut-chart
              :key="dntTaskPerUsers"
              dnt-title="Tarefas x Usuário"
              :dnt-data="tasksPerUser"
              dnt-legend="Usuário"
              dnt-height="350px"
            ></donut-chart>
          </v-col>
        </v-row>
        <v-row v-if="showCharts">
          <v-col cols="12">
            <line-chart
              :key="lineWorkedTime"
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
    tasksPerClient(state, store) {
      let filters = {
        startedAt: this.startedAt.unix(),
        endedAt: this.endedAt.unix()
      };
      return store.filterTasksGroupedByClients(filters).map(m => ({
        axisX: m.client,
        axisY: m.tasksCount,
        text: `${m.tasksCount}`
      }));
    },
    workedDaysPerClient(state, store) {
      let filters = {
        startedAt: this.startedAt.unix(),
        endedAt: this.endedAt.unix()
      };
      return store.getWorkedDaysByClients(filters).map(m => ({
        x: m.client,
        y: m.spentTimeInDays
      }));
    },
    workedHoursPerClient(state, store) {
      let filters = {
        startedAt: this.startedAt.unix(),
        endedAt: this.endedAt.unix()
      };
      return store.getWorkedHoursByClients(filters).map(m => ({
        x: m.client,
        y: m.spentTimeInHours
      }));
    },
    ordersPerUser(state, store) {
      let filters = {
        startedAt: this.startedAt.unix(),
        endedAt: this.endedAt.unix()
      };
      return store.filterOrdersGroupedByUsers(filters).map(m => ({
        axisX: m.user.name,
        axisY: m.ordersCount,
        text: `${m.ordersCount}`
      }));
    },
    tasksPerUser(state, store) {
      let filters = {
        startedAt: this.startedAt.unix(),
        endedAt: this.endedAt.unix()
      };
      return store.filterTasksGroupedByUsers(filters).map(m => ({
        axisX: m.user.name,
        axisY: m.tasksCount,
        text: `${m.tasksCount}`
      }));
    },
    chartSeries(state, store) {
      let filters = {
        startedAt: this.startedAt.unix(),
        endedAt: this.endedAt.unix()
      };
      let infos = store.getWorkedHoursByUsersByDate(filters);
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
      this.barTimePerClients += 1;
      this.lineWorkedTime += 1;
      this.showCharts = true;
    }
  }),
  components: { DonutChart, BarChart, LineChart, DatePicker },
  data() {
    return {
      dntOrderPerClients: 0,
      dntTaskPerClients: 5,
      dntOrderPerUsers: 10,
      dntTaskPerUsers: 15,
      barTimePerClients: 20,
      lineWorkedTime: 25,
      yConfig: { title: "Tempo trabalhado (m)" },
      startedAt: moment().add(-15, "day"),
      endedAt: moment(),
      showCharts: false
    };
  },
  watch: {
    startedAt(oldValue, newValue) {
      this.showCharts =
        this.showCharts &&
        oldValue instanceof moment &&
        newValue instanceof moment &&
        oldValue.unix() == newValue.unix();
    },
    endedAt(oldValue, newValue) {
      this.showCharts =
        this.showCharts &&
        oldValue instanceof moment &&
        newValue instanceof moment &&
        oldValue.unix() == newValue.unix();
    }
  },
  mounted() {
    this.loadOrders();
    this.loadSessionInfo();
    this.readUsers();
  }
};
</script>