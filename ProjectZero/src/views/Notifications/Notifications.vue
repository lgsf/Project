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
                      multiple-select
                      item-key="id"
                      :value="selected"
                      sort-by="date"
                      sort-desc
                      @input="selectNotification"
                    >
                    <template #item.name="{item}">
                      <v-col cols="12">
                        <span >
                          {{ item.name }}
                        </span>
                      </v-col>
                    </template>
                    <template #item.title="{item}">
                      <v-col cols="12">
                        <span >
                          {{ item.title }}
                        </span>
                      </v-col>
                    </template>
                    <template #item.date="{item}">
                      <v-col cols="12">
                        <span >
                          {{ item.date }}
                        </span>
                      </v-col>
                    </template>
                    <template #item.user="{item}">
                      <v-col cols="12">
                        <span v-for="item1 in item.user" :key="item1.name">
                          {{ item1.name }}
                          <br>
                        </span>
                      </v-col>
                    </template>
                    <template #item.group="{item}">
                      <v-col cols="12">
                        <span v-for="item2 in item.group" :key="item2.name">
                          &nbsp;
                          {{ item2.name }}
                          <br>
                        </span>
                      </v-col>
                    </template>
                    <template #item.detail="{item}">
                      <v-col cols="12">
                        <v-tooltip bottom color="grey lighten-4">
                          <template v-slot:activator="{ on, attrs }">
                            <span v-bind="attrs" v-on="on"> {{ item.detail.substr(0,25) + '...' }}</span>
                          </template>
                          <span v-html="item.detail" class="black--text"></span>
                        </v-tooltip>
                      </v-col>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
              <v-btn color="error" dark fixed bottom right v-show="selected.length < 2" fab @click="editNotification(true)">
                  <v-icon v-show="selected.length == 0">mdi-plus</v-icon>
                  <v-icon v-show="selected.length == 1">mdi-pen</v-icon>
              </v-btn>
              <v-btn color="error" dark fixed bottom right  v-show="selected.length > 1" fab @click="deleteMultipleNotifications(selected)">
                  <v-icon>mdi-delete</v-icon>
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
import { db } from "@/main"

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
  methods: Object.assign({}, methods, userMethods, {
    deleteMultipleNotifications(selected){
      selected.forEach(doc => {
          db.collection("notifications")
            .doc(doc.id)
            .delete()
         })
      this.loadNotifications()
      this.selectNotification(false)
      }
  }),
  mounted() {
    this.readUsers()
    this.loadNotifications()
  }
}
</script>
<style>

</style>
