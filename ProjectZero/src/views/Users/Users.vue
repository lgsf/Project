<template>
  <div class="users">
      <v-row style="min-width:70vw;">
        <v-col>
          <div class="text-center screen-margin-top" v-if="isLoading">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
          <v-card class="mx-auto" v-if="!isLoading" >
            <v-toolbar color="primary" dark>
              <h3>Usuários</h3>
              <v-spacer></v-spacer>
              <v-icon right class="white--text">account_box</v-icon>
            </v-toolbar>
            <v-card-title>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Buscar"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-row>
              <v-col cols="12">
                <v-data-table
                  :headers="headers"
                  :items="userList"
                  :search="search"
                  :value="item"
                  @click:row="onSelectedUser"
                ></v-data-table>
              </v-col>
            </v-row>
            <v-btn color="error" dark fixed bottom right v-show="!selected" fab @click="openEditUserModal">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
            <EditUser ref="EditUser" />
          </v-card>
          </v-col>
      </v-row>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex"
import EditUser from "./EditUser"

const computed = mapState("users", {
  search: state => state.search,
  showEdit: state => state.showEdit,
  selected: state => state.selected,
  userList: state => state.userList,
  userGroups: state => state.userGroups
})

const computedGeneral = mapState("general", {
    isLoading: state => state.isLoading
})


const methods = mapActions("users", [
  "readUsers",
  "openEditUserModal",
  "onSelectedUser"
])

export default {
  components: { EditUser },
  data() {
    return {
      headers: [
          {
              text: "Nome",
              align: "start",
              value: "name"
          },
          {
              text: "E-mail",
              align: "start",
              value: "email"
          },
          {
              text: "Telefone",
              align: "start",
              value: "phone"
          },
          {
              text: "Data de nascimento",
              align: "start",
              value: "birth_date"
          },
          {
              text: "Grupo",
              align: "start",
              value: "group_id.name"
          }
      ],
     }
  },
  methods,
  computed: Object.assign({}, computed, computedGeneral),
  mounted() {
      this.readUsers(true)
  }
}
</script>