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
        <v-row justify="center">
          <v-col cols="12">
            <v-card-title>
              <v-text-field
                v-model="search"
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
                  :items="groups"
                  :search="search"
                  :value="item"
                  @click:row="select"
                ></v-data-table>
              </v-col>
            </v-row>
            <v-btn color="error" dark fixed bottom right v-show="!selected" fab @click="editGroup(true)">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <EditGroup />
      </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex"
import EditGroup from "./EditGroup"

const computed = mapState("groups", {
  selected: state => state.selected,
  groups: state => state.groups,
})

const computedGeneral = mapState("general", {
    isLoading: state => state.isLoading
})

const methods = mapActions("groups", ["select", "loadGroups", "editGroup"])

export default {
  components: { EditGroup },
  data() {
    return {
      search: "",
      title: "Grupos",
      searchLabel: "Buscar",
      headers: [
        {
          text: "Nome",
          align: "start",
          value: "name"
        }
      ]
    }
  },
  computed: Object.assign({}, computed, computedGeneral),
  methods,
  mounted() {
    this.loadGroups()
  }
}
</script>
<style>
</style>