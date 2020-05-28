<template>
  <div id="app">
    <Navbar/>
    <Sidenav/>

    <router-view/>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Sidenav from '@/components/Sidenav.vue'

export default {
  name: 'App',
  components: {
    Navbar,
    Sidenav
  
  }
}
</script>

<style>
  
</style>
