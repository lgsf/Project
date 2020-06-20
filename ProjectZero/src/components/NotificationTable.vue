<template>
 
<v-col class="xs-12 sm-6">
  <div class="text-center" v-if="isLoading">
    <v-progress-circular
      indeterminate
      color="primary"
    ></v-progress-circular>
  </div>
      <v-card v-if="!isLoading"
  >
        <v-toolbar class="primary">
          <h3 class="white--text">{{ screenTitle }}</h3>
            <v-spacer></v-spacer>
          <v-icon right class="white--text">notifications</v-icon>
        </v-toolbar> 
         <v-expansion-panels>
            <v-expansion-panel
            v-for="(item, i) in uniqueNotifications.slice(0 + counter, 8 + counter)"
            :key="i"
          >
                  <v-expansion-panel-header> <strong style="font-family: monospace;" v-show="!item.read">{{item.title}} </strong>
                   <div v-show="item.read">{{item.title}} </div>
                  <v-spacer></v-spacer> Escrito por: {{item.name}}
                 <template v-slot:actions>
                  <v-icon color ='success' v-show="item.read" >mdi-check</v-icon>
                  <v-icon color="primary" v-show="!item.read">mdi-alert-circle</v-icon>
                </template>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-row>
                      Data: {{item.date}}
                     </v-row>
                    <br>
                    <v-row>
                    {{item.detail}}
                    {{item.id}}
                   </v-row>
                   <br> 
                   <v-row>
                      <v-btn color="error" v-if="isAdmin" text @click="deleteNotification(item.id)">Deletar</v-btn>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" v-show="item.read" text @click="markUnread(item.id, item)">Não-lido</v-btn>
                      <v-btn color="success" v-show="!item.read" text @click="markRead(item.id, item)">Lido</v-btn>
                   </v-row>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                </v-expansion-panels>
                  <v-card-actions >
                    <v-btn  @click="counter-=8" color="primary" v-show="counter > 0"  dark>
                        <v-icon >keyboard_arrow_left</v-icon>
                    </v-btn>
                    <v-spacer></v-spacer> <span style="text-align: center;">Total de notificações: {{ uniqueNotifications.length}} </span><v-spacer></v-spacer>
                    <v-btn @click="counter+=8" v-show="counter < uniqueNotifications.length-8" color="primary" dark >
                        <v-icon >keyboard_arrow_right</v-icon>
                    </v-btn>
         </v-card-actions>
              
      </v-card>
      
    </v-col>

</template>

<script>
// @ is an alias to /src
import { db } from "@/main"
import { mapActions  } from "vuex"


export default {
  name: 'Notifications',

  data() {
    return {
      search: "",
      counter: 0,
      screenTitle: 'Notificações',
      notifications: [],
      uniqueNotifications: [],
      title: null,
      name: null,
      detail: null,
      date: null,
      read: null
    }
  },

   computed: {
    isLoading() {
     return this.$store.state.general.isLoading
    },
    isAdmin() {
      return this.$store.state.auth.userGroup == "bmyiE5pvx66Ct7Wmj78b"
    },
    ...mapActions("general", ["setIsLoading", "resetIsLoading"])
   },
   
   methods: {
      changeIcon(item){
         item.read = !item.read
     },
     
     markRead(id, item){
       this.changeIcon(item)
       db.collection("notifications")
            .doc(id)
            .update({
                read: true
            })
     },

     markUnread(id, item){
       this.changeIcon(item)
       db.collection("notifications")
            .doc(id)
            .update({
                read: false
            })
     },

    deleteNotification(id){
        db.collection("notifications")
            .doc(id)
            .delete()
            .then(() => {
              this.readNotifications()})
    },

    readNotifications() {
      this.setIsLoading
      this.notifications = []
      db.collection("notifications")
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            let userArray = []
            let groupArray = []
            userArray = doc.data().user
            groupArray = doc.data().group
            if(userArray.length == 0 && groupArray.length == 0){
              this.notifications.push({
                id: doc.id,
                title: doc.data().title,
                name: doc.data().name,
                detail: doc.data().detail,
                date: doc.data().date,
                read: doc.data().read
              })
            }
            else if (userArray.length > 0 && groupArray.length == 0) {
              userArray.forEach (item =>  {
               if(item.id == this.$store.state.auth.user.uid){
                  this.notifications.push({
                    id: doc.id,
                    title: doc.data().title,
                    name: doc.data().name,
                    detail: doc.data().detail,
                    date: doc.data().date,
                    read: doc.data().read
                    })
                   }
                 })
                }
              else if (groupArray.length > 0 && userArray.length == 0){
                groupArray.forEach (item => {
                  if(item.id == this.$store.state.auth.userGroup){
                    this.notifications.push({
                      id: doc.id,
                      title: doc.data().title,
                      name: doc.data().name,
                      detail: doc.data().detail,
                      date: doc.data().date,
                      read: doc.data().read
                 })
                }
               })
              }
              else {
                  userArray.forEach (item =>  {
                  if(item.id == this.$store.state.auth.user.uid){
                      this.notifications.push({
                        id: doc.id,
                        title: doc.data().title,
                        name: doc.data().name,
                        detail: doc.data().detail,
                        date: doc.data().date,
                        read: doc.data().read
                        })
                      }
                    })
                    groupArray.forEach (item => {
                      if(item.id == this.$store.state.auth.userGroup){
                        this.notifications.push({
                          id: doc.id,
                          title: doc.data().title,
                          name: doc.data().name,
                          detail: doc.data().detail,
                          date: doc.data().date,
                          read: doc.data().read
                    })
                    }
                  })
              }
          })
        let uniqueSet = new Set (this.notifications.map(e => JSON.stringify(e)))
        this.uniqueNotifications = Array.from(uniqueSet).map(e => JSON.parse(e))
        this.resetIsLoading
        })
      }
   },

   mounted() {
    this.readNotifications()
  }
}
</script>
