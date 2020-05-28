<template>
  <div class="Navbar">
    <nav class="nav-extended nav-wrapper indigo darken-2">
      <div class="nav-content">
        <a id="sidenav-trigger-icon" href="#" data-target="slide-out" class="sidenav-trigger show-on-large">
            <i class="material-icons">menu</i>
          </a>
        <router-link to="">
          <a class="nav-title">Project Zero</a>
        </router-link>
         <ul id="nav-list" class="right">
          <li><router-link :to="{ name: 'Home' }"> Home</router-link></li>
          <li><router-link :to="{ name: 'About' }" >About</router-link></li>
        </ul>

      </div>
      <ul id="slide-out" class="sidenav ">
        <li>
          <div class="user-view indigo darken-2">
            <div class="background">
              
              <!-- <img src="images/office.jpg"> -->
            </div>
            <!-- <a href="#user"><img class="circle" src="images/yuna.jpg"></a> -->
            <a href="#name"><span class="name">Your logo here!</span></a><br>
        </div>
        </li>
        <li>        
        <router-link to="Home">
          <i class="material-icons">home</i><span>Home </span>
        </router-link>
      </li>
      <li>        
        <router-link to="/about">
          <i class="material-icons">info</i><span >About </span>
        </router-link>
      </li>
      <li>        
        <router-link to="">
          <i class="material-icons">account_box</i><span >Login </span>
        </router-link>
      </li>
      <li>        
        <router-link to="">
          <i class="material-icons">dashboard</i><span >Components </span>
        </router-link>
      </li>

      </ul>
    </nav>
  
  </div>
</template>

<script>

export default {
  ready: function () {
    // var options = {};
    // var elems = document.querySelectorAll('.sidenav');
    // var instances = M.Sidenav.init(elems, options);
  },
  name: 'Navbar',
  data(){
    return {
    }
  }
}
</script>

<style>
#sidenav-trigger-icon{
  padding: 20px;
}
#nav-list{
  margin-right: 60px;
  padding: 39px;
}
.nav-title{
  margin-left: 60px;
}

</style>