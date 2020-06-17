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
                      item-key="id"
                      :value="selected"
                      @input="selectNotification"
                    >
                    <template #item.user="{item}">
                    <span v-for="item1 in item.user" :key="item1.name">
                      {{ item1.name }}
                      <br>
                    </span>
                    </template>
                      <template #item.group="{item}">
                    <span v-for="item2 in item.group" :key="item2.name">
                      {{ item2.name }}
                      <br>
                    </span>
                    </template>
                    </v-data-table>
                  </v-col>
                </v-row>
                <v-btn color="error" dark fixed bottom right fab @click="editNotification(true)">
                      <v-icon v-show="selected.length == 0">mdi-plus</v-icon>
                      <v-icon v-show="selected.length > 0">mdi-pen</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          <EditNotification/>
      </v-card>
    </v-row>
  </div>
</template>

<script>

import { mapState, mapActions } from "vuex"
import EditNotification from "./EditNotification"

const computed = mapState("notifications", {
  selected: state => state.selected || [],
  listTitle: state => state.listTitle,
  search: state => state.search,
  searchLabel: state => state.searchLabel,
  headers: state => state.header,
  notifications: state => state.notifications,
})


const methods = mapActions("notifications", [
  "selectNotification",
  "searchFor",
  "loadNotifications",
  "editNotification"
])

const userMethods = mapActions("users", [
  "readUsers",
])

export default {
  components: { EditNotification },
  data() {
    return {}
  },
  computed,
  methods: Object.assign({}, methods, userMethods),
  mounted() {
    this.readUsers()
    this.loadNotifications()
  }
}
</script>
<style>

</style>
