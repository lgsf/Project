<template>
  <div class="groups">
      <v-row justify="center">
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
                      item-key="name"
                      :value="selected"
                      @input="select"
                    ></v-data-table>
                  </v-col>
                </v-row>
                <v-btn color="error" dark fixed bottom right fab @click="editGroup">
                  <v-icon v-show="!showFabEditGroups">mdi-plus</v-icon>
                  <v-icon v-show="showFabEditGroups">mdi-pen</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <EditGroup :refreshGroups="loadGroups" ref="EditGroup" />
          </v-card>
      </v-row>
  </div>
</template>
<script>
import { db } from "@/main";
import { mapState, mapActions } from "vuex";
import EditGroup from "./EditGroup";

var groups = [];

function loadGroups() {
  groups.splice(0, groups.length);
  db.collection("groups")
    .get()
    .then(onGroupsLoaded);
}

function onGroupsLoaded(snapshots) {
  snapshots.forEach(groupSnapShot => {
    let groupData = groupSnapShot.data();
    groupData.id = groupSnapShot.id;
    groups.push(groupData);
  });
}

export default {
  components: { EditGroup },
  computed: mapState({
    selected: state => state.groups.selected,
    groupSelected(state) {
      return state.groups.selected.length > 0 ? state.groups.selected[0] : {};
    },
    showFabEditGroups(state) {
      return !!state.groups.selected && !!state.groups.selected.length;
    }
  }),
  data() {
    return {
      search: "",
      title: "Grupos",
      searchLabel: "Buscar",
      showEdit: false,
      //selected: []
      headers: [
        {
          text: "Nome",
          align: "start",
          value: "name"
        }
      ],
      groups: groups
    };
  },
  methods: Object.assign({}, mapActions("groups", ["select"]), {
    editGroup() {
      let group = this.groupSelected;
      this.$refs.EditGroup.show(group);
    },
    loadGroups: loadGroups
  }),
  mounted() {
    loadGroups();
  }
};
</script>
<style>
</style>