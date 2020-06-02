<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="lg-6">
        <v-card class="mx-auto">
          <v-toolbar color="primary" dark>
            <h3>{{ screenTitle }}</h3>
            <v-spacer></v-spacer>
            <v-icon right class="white--text">account_box</v-icon>
          </v-toolbar>
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
                :items="desserts"
                :search="search"
                show-select
                single-select
                item-key="name"
                v-model="selected"
              ></v-data-table>
            </v-col>
          </v-row>
          <v-btn color="error" dark fixed bottom right fab @click="createOrUpdateUser">
            <v-icon v-show="!showEdit">mdi-plus</v-icon>
            <v-icon v-show="showEdit">mdi-pen</v-icon>
          </v-btn>
          <EditUser :refreshUsersMethod="readUsers" ref="EditUser" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { db } from "@/main";
import EditUser from "./EditUser";

export default {
  components: { EditUser },
  data() {
    return {
      search: "",
      screenTitle: "Usuários",
      searchLabel: "Buscar",
      showEdit: false,
      selected: [],
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
          value: "birthDate"
        },
        {
          text: "Grupo",
          align: "start",
          value: "group.name"
        }
      ],
      desserts: [],
      userGroups: []
    };
  },
  watch: {
    selected: function() {
      this.showEdit = this.selected ? this.selected.length == 1 : false;
    }
  },
  methods: {
    readUsers() {
      this.desserts = [];
      db.collection("users")
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            this.desserts.push({
              id: doc.id,
              name: doc.data().name,
              phone: doc.data().phone,
              email: doc.data().email,
              birthDate: doc.data().birth_date,
              group: this.userGroups.find(group => group.id == doc.data().group_id)
            });
          });
        })
        .catch(error => {
          console.log("Error getting documents: ", error);
        });
    },
    editUser: function() {
      let item = this.selected[0];
      let dto = {
        id: item.id,
        name: item.name,
        phone: item.phone,
        email: item.email,
        birthDate: item.birthDate,
        group: item.group
      }
      this.$refs.EditUser.openEdit(dto);
    },
    readGroups() {
      db.collection("groups")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => { this.userGroups.push({
              name: doc.data().name,
              id: doc.id
            })
          });
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    },
    createUser: function() {
      this.$refs.EditUser.openCreate();
    },
    createOrUpdateUser: function(){
      if(this.showEdit){
        this.editUser()
      }
      else{
        this.createUser()
      }
    }
  },
  mounted() {
    this.readGroups()
    this.readUsers();
  }
};
</script>