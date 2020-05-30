<template>
  <div class="home">
  <v-subheader> <h3> Bem-vindo {{}}! </h3></v-subheader>
  <v-container  >
  <v-row >
    <Table/>
   <Calendar/>
   </v-row>
  </v-container>
  </div>
</template>

<script>
// @ is an alias to /src
import Calendar from '@/components/Calendar'
import Table from '@/components/Table'



export default {
  name: 'Home',
   components: { Calendar,  Table },
  data(){
    return {
      

    }
  },
  

}
</script>
