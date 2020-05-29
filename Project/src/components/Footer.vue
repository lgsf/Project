<template>
  <div>
        <footer class="page-footer indigo darken-2">
          <div class="container">
            <div class="row">
              <div class="col l6 s12">
                <h5 class="white-text">Project Zero</h5>
                <p class="white-text">Somos uma empresa de desenvolvimento de software como um serviço.</p>
                <p class="white-text">Entre em contato conosco.</p>
              </div>
              <div class="col l4 offset-l2 s12">
                <h5 class="white-text">Links</h5>
                <ul>
                  <li><router-link class="white-text" :to="{ name: 'Home' }">Home</router-link></li>
                  <li><router-link class="white-text" :to="{ name: 'About' }">About</router-link></li>
                  <li><a class="white-text" href="#!">Login</a></li>
                  <li><a class="white-text" href="#!">Components</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div class="footer-copyright">
            <div class="container center-align">
            © 2020 Project Zero
            </div>
          </div>
        </footer>
        </div>
</template>

<script>
  
export default {
  name: 'Footer',
  data(){
    return{

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
