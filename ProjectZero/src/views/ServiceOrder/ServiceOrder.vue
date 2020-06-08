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
            <h3>Ordens de Produção</h3>
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
                    :items="productionOrders"
                    :search="search"
                    show-select
                    single-select
                    item-key="id"
                    :value="selected"
                    @input="selectOrder"
                  ></v-data-table>
                </v-col>
              </v-row>
              <v-btn color="error" dark fixed bottom right fab @click="editProductionOrder">
                <v-icon v-show="!enableEdit">mdi-plus</v-icon>
                <v-icon v-show="enableEdit">mdi-pen</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";

const computedProductionOrders = mapState("general", {
  isLoading: state => state.isLoading,
});

const computed = mapState("productionOrders", {
  selected: state => state.selected,
  search: state => state.search,
  productionOrders: state => state.productionOrders,
  enableEdit: state => state.selected && state.selected.length
  
});

const methods = mapActions("productionOrders", [
  "selectOrder",
  "searchFor",
  "reloadOrders"
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
  computed: Object.assign({}, computed, computedProductionOrders),
  methods: Object.assign({}, methods, generalMethods, {
    editProductionOrder() {
      if (this.selected)
        this.$router.push({ path: `/EditServiceOrder/${this.selected[0].id}` });
    }
  }),
  mounted() {
    this.setIsLoading()
    console.log(this.isLoading)
    this.reloadOrders().then(() => {this.resetIsLoading() });
    console.log(this.isLoading)
  }
};
</script>
<style>
</style>