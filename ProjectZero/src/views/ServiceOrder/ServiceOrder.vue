<template>
  <div>
    <v-row justify="center">
      <v-col md="6">
        <v-card class="mx-auto">
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
  computed,
  methods: Object.assign({}, methods, {
    editProductionOrder() {
      if (this.selected)
        this.$router.push({ path: `/EditServiceOrder/${this.selected[0].id}` });
    }
  }),
  mounted() {
    this.reloadOrders();
  }
};
</script>
<style>
</style>