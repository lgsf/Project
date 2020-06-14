<template>
  <div class="users">
      <v-row justify="center">
          <v-card class="mx-auto">
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
                  @input="onSelectedUser"
                  :headers="headers"
                  :items="userList"
                  :search="search"
                  show-select
                  single-select
                  item-key="name"
                  :value="selected"
                ></v-data-table>
              </v-col>
            </v-row>
            <v-btn color="error" dark fixed bottom right fab @click="openEditUserModal">
              <v-icon v-show="selected.length == 0">mdi-plus</v-icon>
              <v-icon v-show="selected.length > 0">mdi-pen</v-icon>
            </v-btn>
            <EditUser ref="EditUser" />
          </v-card>
      </v-row>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import EditUser from "./EditUser";

const computed = mapState("users", {
  search: state => state.search,
  showEdit: state => state.showEdit,
  selected: state => state.selected,
  userList: state => state.userList,
  userGroups: state => state.userGroups
})

const methods = mapActions("users", [
  "readUsers",
  "readGroups",
  "openEditUserModal",
  "onSelectedUser"
]);

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
              value: "group_id"
          }
      ],
     }
  },
  methods,
  computed,
  mounted() {
    this.readGroups().then(() => {
      this.readUsers()
    })
  }
};
</script>