<template>
  <div class="notifications">
    <v-row justify="center">
        <div class="text-center" v-if="loading">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
      <v-card class="mx-auto" v-if="!loading">
        <v-toolbar class="primary ">
          <h3 class="white--text">{{ listTitle }}</h3>
            <v-spacer></v-spacer>
          <v-icon right class="white--text">notifications</v-icon>
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
                      :items="notifications"
                      :search="search"
                      show-select
                      single-select
                      item-key="name"
                      :value="selected"
                      @input="selectNotification"
                    ></v-data-table>
                  </v-col>
                </v-row>
                <v-btn color="error" dark fixed bottom right fab @click="editNotification(true)">
                  <v-icon v-show="!enableEdit">mdi-plus</v-icon>
                  <v-icon v-show="enableEdit">mdi-pen</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          <EditNotification />
         
      </v-card>
    </v-row>
  </div>
</template>

<script>

import { mapState, mapActions } from "vuex"
import EditNotification from "./EditNotification"

const computed = mapState("notifications", {
  selected: state => state.selected,
  listTitle: state => state.listTitle,
  search: state => state.search,
  searchLabel: state => state.searchLabel,
  headers: state => state.header,
  notifications: state => state.notifications,
  enableEdit: state => !!state.selected
})

const methods = mapActions("notifications", [
  "selectNotification",
  "searchFor",
  "loadNotifications",
  "editNotification"
])

export default {
  components: { EditNotification },
  data() {
    return {}
  },
  computed,
  methods,
  mounted() {
    this.loadNotifications()
  }
}
</script>
<style>
</style>
