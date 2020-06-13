<template>
  <div>
    <v-row justify="center">
      <v-col md="6">
        <div class="text-center screen-margin-top" v-if="isLoading">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
        <v-card v-if="!isLoading" class="mx-auto">
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
                    show-select
                    single-select
                    item-key="id"
                    :value="selected"
                    @input="selectOrder"
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
  enableEdit: state => state.selected && state.selected.length
  
});

const methods = mapActions("serviceOrders", [
  "selectOrder",
  "searchFor",
  "reloadOrders",
  "openCreateOrderModal"
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
          text: "Administrator",
          align: "start",
          value: "administratorName"
        }
      ]
    };
  },
  components: {
    CreateServiceOrder
  },
  computed: Object.assign({}, computed, computedServiceOrders),
  methods: Object.assign({}, methods, generalMethods, {
    editServiceOrder() {
      if (this.selected.length > 0)
        this.$router.push({ path: `/EditServiceOrder/${this.selected[0].id}` });
      else
        this.openCreateOrderModal()
    }
  }),
  mounted() {
    this.setIsLoading()
    this.reloadOrders().then(() => {this.resetIsLoading() });
  }
};
</script>
<style>
</style>