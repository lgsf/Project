<template>
  <div>
    <v-row style="min-width:70vw;">
      <v-col >
        <div class="text-center screen-margin-top" v-if="isLoading">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
        <v-card v-if="!isLoading" >
          <v-toolbar class="primary white--text" dark>
            <h3>Ordens de Serviço</h3>
            <v-spacer></v-spacer>
            <v-icon right class="white--text">receipt</v-icon>
          </v-toolbar>
          <v-row justify="center">
            <v-col cols="12">
              <v-card-title>
                <v-text-field
                  :value="search"
                  @input="searchFor"
                  append-icon="mdi-magnify"
                  label="Buscar"
                  single-line
                  hide-details
                ></v-text-field>
              </v-card-title>
              <v-row>
                <v-col cols="12">
                  <v-data-table
                    :headers="header"
                    :items="serviceOrders"
                    :search="search"
                    :value="item"
                    @click:row="selectOrder"
                  ></v-data-table>
                </v-col>
              </v-row>
              <v-btn color="error" dark fixed bottom right fab @click="editServiceOrder">
                <v-icon v-show="!enableEdit">mdi-plus</v-icon>
                <v-icon v-show="enableEdit">mdi-pen</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <CreateServiceOrder></CreateServiceOrder>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import CreateServiceOrder from "./CreateServiceOrder.vue";

const computedServiceOrders = mapState("general", {
  isLoading: state => state.isLoading,
});

const computed = mapState("serviceOrders", {
  selected: state => state.selected,
  search: state => state.search,
  serviceOrders: state => state.serviceOrders,
  enableEdit: state => state.selected 
  
});

const methods = mapActions("serviceOrders", [
  "selectOrder",
  "searchFor",
  "reloadOrders",
  "openCreateOrderModal",
  "editServiceOrder"
]);

const generalMethods = mapActions("general", [
  "setIsLoading", 
  "resetIsLoading"
]);

export default {
  data() {
    return {
      header: [
        {
          text: "Nome",
          align: "start",
          value: "name"
        },
        {
          text: "Cliente",
          align: "start",
          value: "client.name"
        },
        {
          text: "Administrador",
          align: "start",
          value: "administrator.name"
        },
        {
          text: "Data Criação",
          align: "start",
          value: "creation_date"
        },
        {
          text: "Data Início",
          align: "start",
          value: "start_date"
        },
        {
          text: "Data Encerramento",
          align: "start",
          value: "end_date"
        },
        {
          text: "Estado Atual",
          align: "start",
          value: "status"
        }
      ]
    };
  },
  components: {
    CreateServiceOrder
  },
  computed: Object.assign({}, computed, computedServiceOrders),
  methods: Object.assign({}, methods, generalMethods),
  mounted() {
    this.reloadOrders()
  }
};
</script>
<style>
</style>