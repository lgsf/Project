<template>
  <div class="groups">
    <v-row style="min-width:70vw;">
      <v-col>
      <v-card class="mx-auto">
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
                  show-select
                  single-select
                  item-key="id"
                  :value="selected"
                  @input="select"
                ></v-data-table>
              </v-col>
            </v-row>
            <v-btn color="error" dark fixed bottom right fab @click="editGroup(true)">
              <v-icon v-show="!showFabEditGroups">mdi-plus</v-icon>
              <v-icon v-show="showFabEditGroups">mdi-pen</v-icon>
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
import { mapState, mapActions } from "vuex";
import EditGroup from "./EditGroup";

const computed = mapState("groups", {
  selected: state => state.selected,
  groups: state => state.groups,
  groupSelected: state => (state.selected.length > 0 ? state.selected[0] : {}),
  showFabEditGroups: state => !!state.selected && !!state.selected.length
});

const methods = mapActions("groups", ["select", "loadGroups", "editGroup"]);

export default {
  components: { EditGroup },
  computed,
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
    };
  },
  methods,
  mounted() {
    this.loadGroups();
  }
};
</script>
<style>
</style>