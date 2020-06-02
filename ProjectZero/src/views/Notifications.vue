<template>
  <div class="notifications">
    <v-row class="dark" justify="center">
      <v-card>
        <v-toolbar class="primary ">
          <h3 class="white--text">{{ screenTitle }}</h3>
            <v-spacer></v-spacer>
          <v-icon right class="white--text">notifications</v-icon>
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
        <v-card-text>
            <v-container>
              <v-form v-model="valid" > 
            <v-row>
            <v-col cols="12">
              <v-data-table
                :headers="headers"
                :items="desserts"
                :search="search"
                show-select
                single-select
                item-key="title"
                v-model="selected"
              ></v-data-table>
            </v-col>
          </v-row>
            </v-form>
                   <v-btn color="error" dark fixed bottom right fab @click="createOrUpdateNotification">
            <v-icon v-show="!showEdit">mdi-plus</v-icon>
            <v-icon v-show="showEdit">mdi-pen</v-icon>
          </v-btn>
          <EditNotification :refreshNotificationsMethod="readNotifications" ref="EditNotification" />
          </v-container>
   </v-card-text>
      </v-card>
    </v-row>
  </div>
</template>

<script>
// @ is an alias to /src
import { db } from "@/main";
import EditNotification from "./EditNotification";

export default {
  name: 'Notifications',
  components: { EditNotification },
  data() {
    return {
      search: "",
      screenTitle: 'Notificações',
      searchLabel: "Buscar",
      showEdit: false,
      user: '',
      selected: [],
      headers: [
        {
          text: "Usuário",
          align: "start",
          value: "name"
        } ,
        {
          text: "Título",
          align: "start",
          value: "title"
        },
          {
          text: "Corpo",
          align: "start",
          value: "detail"
        }
        ],
      desserts: [],

      name: null,
      detail: null,
      date: null
      

    }
  },
   watch: {
    selected: function() {
      this.showEdit = this.selected ? this.selected.length == 1 : false;
    }
  },
   methods: {
    readNotifications() {
      this.desserts = [];
      db.collection("notifications")
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            this.desserts.push({
              id: doc.id,
              title: doc.data().title,
              name: doc.data().name,
              detail: doc.data().detail,
              date: doc.data().date
            });
          });
        })
        .catch(error => {
          console.log("Error getting documents: ", error);
        });
    },
    editNotification: function() {
      let item = this.selected[0];
      let dto = {
        id: item.id,
        title: item.title,
        name: item.name,
        detail: item.detail,
        date: item.date,
      }
      this.$refs.EditNotification.openEdit(dto);
    },
    createNotification: function() {
      this.$refs.EditNotification.openCreate();
    },
     createOrUpdateNotification: function(){
      if(this.showEdit){
        this.editNotification()
      }
      else{
        this.createNotification()
      }
    }
   },
   mounted() {
    this.readNotifications()
  }
}
</script>
