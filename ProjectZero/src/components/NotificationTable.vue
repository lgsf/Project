<template>
 
<v-col class="xs-12 sm-6">
  <v-card
  >
        <v-toolbar class="primary ">
          <h3 class="white--text">{{ screenTitle }}</h3>
            <v-spacer></v-spacer>
          <v-icon right class="white--text">notifications</v-icon>
        </v-toolbar> 
         <v-expansion-panels>
          <v-expansion-panel
            v-for="(item, i) in desserts"
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
import { db } from "@/main";


export default {
  name: 'Notifications',

  data() {
    return {
      search: "",
      screenTitle: 'Notícias',
      desserts: [],
      title: null,
      name: null,
      detail: null,
      date: null
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
   },
   mounted() {
    this.readNotifications()
  }
}
</script>
