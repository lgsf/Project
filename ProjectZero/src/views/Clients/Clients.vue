<template>
  <div class="groups">
      <v-row style="min-width:70vw;">
        <v-col>
          <div class="text-center screen-margin-top" v-if="isLoading">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
          <v-card class="mx-auto" v-if="!isLoading">
            <v-toolbar class="primary white--text" dark>
              <h3>{{ title }}</h3>
              <v-spacer></v-spacer>
              <v-icon right class="white--text">contacts</v-icon>
            </v-toolbar>
            <v-row >
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
                      :items="clients"
                      :search="search"
                      :value="item"
                      @click:row="selectClient"
                    >
                    </v-data-table>
                  </v-col>
                </v-row>
                <v-btn color="error" dark fixed bottom right v-show="!selected" fab @click="editClient(true)">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <EditClient />
          </v-card>
          </v-col>
      </v-row>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import EditClient from "./EditClient";

const computed = mapState("clients", {
  selected: state => state.selected,
  title: state => state.listTitle,
  search: state => state.search,
  searchLabel: state => state.searchLabel,
  headers: state => state.header,
  clients: state => state.clients
})

const computedGeneral = mapState("general", {
    isLoading: state => state.isLoading
})

const methods = mapActions("clients", [
  "selectClient",
  "searchFor",
  "loadClients",
  "editClient"
])

export default {
  components: { EditClient },
  data() {
    return {}
  },
  computed: Object.assign({}, computed, computedGeneral),
  methods,
  mounted() {
    this.loadClients()
  }
}
</script>
<style>
</style>