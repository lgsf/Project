<template>
  <div class="Sidenav">
    <ul id="slide-out" class="sidenav sidenav-fixed">
      <li>
        <div class="user-view grey lighten-2">
          <div class="background">
            
            <!-- <img src="images/office.jpg"> -->
          </div>
          <!-- <a href="#user"><img class="circle" src="images/yuna.jpg"></a> -->
          <a href="#name"><span class="name">Your logo here!</span></a>
        </div>
      </li>
      <li>        
        <router-link to="/home">
          <i class="material-icons">home</i><span class="nav-title">Home </span>
        </router-link>
      </li>
      <li>        
        <router-link to="/about">
          <i class="material-icons">info</i><span class="nav-title">About </span>
        </router-link>
      </li>
    </ul>
    <a id="sidenav-trigger-icon" href="#" data-target="slide-out" class="sidenav-trigger"><i class="material-icons">menu</i></a>
  </div>
</template>

<script>
  
export default {
  ready: function () {
    // var options = {};
    // var elems = document.querySelectorAll('.sidenav');
    // var instances = M.Sidenav.init(elems, options);
  },
  name: 'Sidenav',
  data(){
    return{

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  #sidenav-trigger-icon {
    position: fixed;
    top: 0px;
    margin: 10px;
  }
</style>
