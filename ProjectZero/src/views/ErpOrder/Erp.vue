<template>
  <div class="erp">
    <v-row style="min-width:70vw;">
      <v-col>
      <v-card class="mx-auto">
        <v-toolbar class="primary white--text" dark>
          <h3>{{ title }}</h3>
          <v-spacer></v-spacer>
          <v-icon right class="white--text">event_note</v-icon>
        </v-toolbar>
        <v-row justify="center">
          <v-col cols="12">
            <v-card-title>
              <v-text-field
                :value="search"
                @input="searchFor"
                append-icon="mdi-magnify"
                :label="searchLabel"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-row>
              <v-col cols="12">
                <v-data-table
                  :headers="headers"
                  :items="erp"
                  :search="search"
                  :value="item"
                  @click:row="selectErpOrder"
                ></v-data-table>
              </v-col>
            </v-row>
            <v-btn color="error" dark fixed bottom right v-show="!selected" fab @click="editErpOrder(true)">
              <v-icon >mdi-plus</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <EditErp />
      </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex"
import EditErp from "./EditErp"

const computed = mapState("erp", {
  selected: state => state.selected,
  title: state => state.listTitle,
  search: state => state.search,
  searchLabel: state => state.searchLabel,
  headers: state => state.header,
  erp: state => state.erpOrders,
})

const methods = mapActions("erp", [
  "selectErpOrder",
  "searchFor",
  "loadErpOrders",
  "editErpOrder"
])

export default {
  components: { EditErp },
  data() {
    return {}
  },
  computed,
  methods,
  mounted() {
    this.loadErpOrders()
  }
};
</script>
<style>
</style>