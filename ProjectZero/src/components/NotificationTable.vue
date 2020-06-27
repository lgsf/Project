<template>
  <v-col class="xs-12 sm-6">
      <div class="text-center" v-if="isLoading">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </div>
      <v-card v-if="!isLoading">
        <v-toolbar class="primary">
            <h3 class="white--text">{{ screenTitle }}</h3>
            <v-spacer></v-spacer> 
            <span v-if="isAdmin"><v-btn color="primary" v-show="!order" dark small @click="orderNotificationDate()">
              Ordenar por data</v-btn></span>
            <span v-if="isAdmin"><v-btn color="primary" v-show="order" dark small @click="orderNotificationNotRead()">
              Ordenar por não-lidos</v-btn></span>
            <v-icon right class="white--text">notifications</v-icon>
        </v-toolbar> 
         <v-expansion-panels >
            <v-expansion-panel 
            v-for="(item, i) in uniqueNotifications.slice(0 + counter, MAX_NUMBER + counter)"
            :key="i" 
          > <v-row>
                <v-expansion-panel-header @click="markRead(item)"> 
                  <v-col cols="4">
                    <strong v-if="!item.read">{{item.title}} </strong>
                    <span v-if="item.read">{{item.title}} </span>
                  </v-col>
                  <v-col cols="4">
                    <strong v-if="!item.read"> {{item.name}} </strong>
                    <span v-if="item.read">{{item.name}} </span> 
                  </v-col>
                  <v-col cols="4">
                    <strong v-if="!item.read"> {{toMoment(item.date)}}</strong>
                    <span v-if="item.read">{{toMoment(item.date)}} </span> 
                  </v-col>
                <template v-slot:actions>
                  <v-icon color ='success' v-show="item.read" >mdi-check</v-icon>
                  <v-icon color="primary" v-show="!item.read" @click="markRead(item)">mdi-alert-circle</v-icon>
                </template>
              </v-expansion-panel-header>
            </v-row>
                <v-expansion-panel-content>
                  <v-row>
                    Data: {{toMoment(item.date)}}
                  </v-row>
                  <br>
                  <v-row>
                    <span v-html="item.detail"></span>
                  </v-row>
                  <br> 
                  <v-row>
                    <v-btn color="error" v-if="isAdmin" text @click="deleteNotificationItem(item)">Excluir</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" v-show="item.read" text @click="markUnread(item)">Não-lido</v-btn>
                  </v-row>
               </v-expansion-panel-content>
             </v-expansion-panel>
                </v-expansion-panels>
                  <v-card-actions>
                    <v-btn  @click="counter-=MAX_NUMBER" color="primary" v-show="counter > 0" small dark>
                        <v-icon >keyboard_arrow_left</v-icon>
                    </v-btn>
                    <v-spacer></v-spacer> <span style="text-align: center;">
                      Total de notificações: {{ uniqueNotifications.length}} </span><v-spacer></v-spacer>
                    <v-btn @click="counter+=MAX_NUMBER" 
                    v-show="counter < uniqueNotifications.length-MAX_NUMBER" color="primary" dark small >
                        <v-icon >keyboard_arrow_right</v-icon>
                    </v-btn>
         </v-card-actions>   
      </v-card>
    </v-col>
</template>

<script>
// @ is an alias to /src
import { db, moment } from "@/main"
import { mapActions, mapState  } from "vuex"


export default {
  name: 'Notifications',

  data() {
    return {
      order: false,
      MAX_NUMBER: 6,
      counter: 0,
      screenTitle: 'Notificações',
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
    ...mapActions("general", ["setIsLoading"]),
    ...mapState("notifications", { uniqueNotifications: state => state.uniqueNotifications})

   },
   
   methods: {

     ...mapActions("notifications", ["deleteNotificationItem", "readNotifications"]),

     toMoment(date){
       return moment.unix(date).format('DD/MM/YYYY, HH:mm:ss')
       
    },

      orderNotificationDate(){
          this.uniqueNotifications.sort((a, b) => (a.date < b.date) ? 1 : -1)
          this.order = !this.order
      },

       orderNotificationNotRead(){
          this.uniqueNotifications.sort((a, b) => (a.read > b.read) ? 1 : (a.read === b.read) ? ((a.date < b.date) ? 1 : -1) : -1 )
          this.order = !this.order
      },

      changeIcon(item){
         item.read = !item.read
     },
     
     markRead(item){
       if(item.read == false){
          this.changeIcon(item)
          db.collection("notifications")
                .doc(item.id)
                .update({
                    read: true
                })
       }    
     },

     markUnread(item){
       this.changeIcon(item)
       db.collection("notifications")
            .doc(item.id)
            .update({
                read: false
            })
     }
   },

   mounted() {
    this.setIsLoading
    this.readNotifications()
  }
}
</script>
