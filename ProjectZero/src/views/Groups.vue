<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="lg-6">
        <v-card class="mx-auto">
          <v-toolbar class="primary" dark>
            <v-toolbar-title>{{title}}</v-toolbar-title>
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
                    v-model="selected"
                  ></v-data-table>
                </v-col>
              </v-row>
              <v-btn color="red" dark fixed bottom right fab>
                <v-icon v-show="selected.length == 0" @click="editGroup">mdi-plus</v-icon>
                <v-icon v-show="selected.length == 1" @click="editGroup">mdi-pen</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <EditGroup :refreshGroups="loadGroups" ref="EditGroup" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { db } from "@/main";
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
  data() {
    return {
      search: "",
      title: "Grupos",
      searchLabel: "Buscar",
      selected: [],
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
  methods: {
    loadGroups: loadGroups,
    editGroup: function() {
      let group = this.selected.length > 0 ? this.selected[0] : {};
      this.$refs.EditGroup.show(group);
    }
  },
  mounted() {
    loadGroups();
  }
};
</script>
<style>
</style>