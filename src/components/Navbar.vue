<template>
  <div class="Navbar">
    <nav class="nav-extended indigo darken-2">
      <div class="nav-content">
        <router-link to="">
          <span class="nav-title">Project Zero </span>
        </router-link>
    
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'Navbar',
  data(){
    return {
    }
  }
}
</script>

<style>
.nav-content{
  margin-left: 310px;
}
.navbar nav{
  padding: 0 20px;
}
@media only screen and (max-width: 992px) {
  .nav-content{
    margin-left: 50px;
  }
}
</style>