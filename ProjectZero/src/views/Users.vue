<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="lg-6">
        <v-card class="mx-auto">
          <v-toolbar color="primary" dark>
            <v-toolbar-title>{{ screenTitle }}</v-toolbar-title>
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
          <v-btn color="red" dark fixed bottom right fab>
            <v-icon v-show="!showEdit" @click="createUser">mdi-plus</v-icon>
            <v-icon v-show="showEdit" @click="editUser">mdi-pen</v-icon>
          </v-btn>
          <EditUser :refreshUsersMethod="readUsers" ref="EditUser" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { db } from '@/main'
import EditUser from "./EditUser";

export default {
  components: { EditUser },
  data() {
    return {
      search: '',
      screenTitle: 'Usuários',
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
          value: "group"
        }
      ],
      desserts: [
      ]
    };    
  },
  watch:{
    selected: function() {
      this.showEdit = this.selected ? this.selected.length == 1 : false 
    },
  },
  methods: {
    readUsers() {
      this.desserts = []
      db.collection("users")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.desserts.push({
                id: doc.id,
                name: doc.data().name,
                phone: doc.data().phone,
                email: doc.data().email,
                birthDate: doc.data().birth_date,
                group: doc.data().group_name
                })
            });
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    },
    editUser: function() {
      let item = this.selected[0]
      this.$refs.EditUser.openEdit(item.id, item.name, item.phone, item.email, item.birthDate, item.group);
    },
    createUser: function() {
      this.$refs.EditUser.openCreate();
    }
  },
  mounted() {
    this.readUsers()
  },
};
</script>