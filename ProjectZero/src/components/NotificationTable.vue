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
        <v-toolbar class="primary ">
          <h3 class="white--text">Notícias</h3>
            <v-spacer></v-spacer>
          <v-icon right class="white--text">message</v-icon>
        </v-toolbar> 
         <v-expansion-panels multiple>
            <v-expansion-panel
            v-for="(item, i) in uniqueNews.slice(0 + counter, 2 + counter)"
            :key="i"
          >
                  <v-expansion-panel-header> {{item.title}}<v-spacer></v-spacer> Escrito por: {{item.name}} 
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <div>
                      Data: {{item.date}}
                    </div>
                    <br>
                   {{item.detail}}
                   {{item.id}}
                  </v-expansion-panel-content>
                </v-expansion-panel>
                </v-expansion-panels>
                  <v-card-actions >
                    <v-btn  @click="counter-=2" color="primary" v-if="counter > 0"  dark>
                      <v-icon >keyboard_arrow_left</v-icon>
                      </v-btn>
                          <v-spacer></v-spacer> <span style="text-align: center;">Total de notícias: {{ uniqueNews.length}} </span><v-spacer></v-spacer>
                  <v-btn @click="counter+=2" v-if="counter < uniqueNews.length-2" color="primary" dark >
                      <v-icon >keyboard_arrow_right</v-icon>
                      </v-btn>
         </v-card-actions>
              
      </v-card>
      <br>
      <v-card v-if="!isLoading"
  >
        <v-toolbar class="primary">
          <h3 class="white--text">{{ screenTitle }}</h3>
            <v-spacer></v-spacer>
          <v-icon right class="white--text">notifications</v-icon>
        </v-toolbar> 
         <v-expansion-panels>
            <v-expansion-panel
            v-for="(item, i) in uniqueNotifications.slice(0 + counter1, 3 + counter1)"
            :key="i"
          >
                  <v-expansion-panel-header> {{item.title}}<v-spacer></v-spacer> Escrito por: {{item.name}} 
                 <template v-slot:actions>
                  <v-icon color ='success' v-show="item.read" >mdi-check</v-icon>
                  <v-icon color="error" v-show="!item.read">mdi-alert-circle</v-icon>
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
                    <v-btn color="error"  text @click="markUnread(item.id)">Não-lido</v-btn>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="markRead(item.id)">Lido</v-btn>
                   </v-row>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                </v-expansion-panels>
                  <v-card-actions >
                    <v-btn  @click="counter1-=3" color="primary" v-if="counter1 > 0"  dark>
                      <v-icon >keyboard_arrow_left</v-icon>
                      </v-btn>
                          <v-spacer></v-spacer> <span style="text-align: center;">Total de notificações: {{ uniqueNotifications.length}} </span><v-spacer></v-spacer>
                  <v-btn @click="counter1+=3" v-if="counter1 < uniqueNotifications.length-3" color="primary" dark >
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
      counter1:0,
      screenTitle: 'Notificações',
      notifications: [],
      news: [],
      uniqueNews: [],
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
     return this.$store.state.general.isLoading;
    },
    ...mapActions("general", ["setIsLoading", "resetIsLoading"]),
   },
   methods: {
     markRead(id){
       db.collection("notifications")
            .doc(id)
            .update({
                read: true
            }).then(this.readNotifications)
     },

     markUnread(id){
       db.collection("notifications")
            .doc(id)
            .update({
                read: false
            }).then(this.readNotifications)
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
              this.news.push({
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
        let uniqueSet1 = new Set (this.news.map(e => JSON.stringify(e)))
        this.uniqueNews = Array.from(uniqueSet1).map(e => JSON.parse(e))
        this.resetIsLoading
        })
        .catch(error => {
          console.log("Error getting documents: ", error)
        })
    },
   },
   mounted() {
    this.readNotifications()
  }
}
</script>
