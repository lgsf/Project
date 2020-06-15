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
          <h3 class="white--text">{{ screenTitle }}</h3>
            <v-spacer></v-spacer>
          <v-icon right class="white--text">notifications</v-icon>
        </v-toolbar> 
         <v-expansion-panels>
            <v-expansion-panel
            v-for="(item, i) in uniqueNotifications"
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
                  </v-expansion-panel-content>
                </v-expansion-panel>
                </v-expansion-panels>
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
      screenTitle: 'Notícias',
      notifications: [],
      uniqueNotifications: [],
      title: null,
      name: null,
      detail: null,
      date: null
    }
  },
   computed: {
    isLoading() {
     return this.$store.state.general.isLoading;
    },
    ...mapActions("general", ["setIsLoading", "resetIsLoading"]),
   },
   methods: {
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
                date: doc.data().date
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
                    date: doc.data().date
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
                      date: doc.data().date
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
                        date: doc.data().date
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
                          date: doc.data().date
                    })
                    }
                  })
              }
          })
        let uniqueSet = new Set (this.notifications.map(e => JSON.stringify(e)))
        this.uniqueNotifications = Array.from(uniqueSet).map(e => JSON.parse(e))
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
