<template>
  <div class="home">
  <v-subheader> <h3> Bem-vindo {{id}}! </h3></v-subheader>
  <v-container  >
  <v-row >
    <NotificationTable/>
   <Calendar/>
   </v-row>
  </v-container>
  </div>
</template>

<script>
// @ is an alias to /src
import Calendar from '@/components/Calendar'
import NotificationTable from '@/components/NotificationTable'


export default {
  name: 'Home',
   components: { Calendar,  NotificationTable },
  data(){
    return {
            id: 'usuário'
    }
  },
  methods: {
  
  }

}
</script>
