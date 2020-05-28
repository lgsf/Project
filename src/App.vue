<template>
  <div id="app">
    <Navbar/>
    <router-view/>
    </db>
    <Footer/>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import db from '@/firebase/firebaseConfig.js'

export default {
  name: 'App',
  components: {
    Navbar,
    Footer
  },
  data(){
    return{

    }
  },
  created(){
    //fetch data
    db.collection('employees').get()
    .then(snapshot => {
      console.log(snapshot);
    })
  }

}
</script>

<style>
  
</style>
