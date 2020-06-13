<template>
  <div class="home">
  <v-subheader> <h3> Bem-vindo {{this.$store.state.auth.userName}}! </h3></v-subheader>
  <v-row >
    <NotificationTable/>
   <Calendar/>
   </v-row>
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

    }
  }

}


</script>
