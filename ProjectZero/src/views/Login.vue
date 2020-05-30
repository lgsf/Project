<template>
<div class="login">
<v-card height="300" class="col-3" >   
    <v-row>
    <v-toolbar
        flat
        color="white"
    >
   <span> <v-toolbar-title >Login</v-toolbar-title></span></v-toolbar>
</v-row>
<v-row >
  <v-text-field label="e-mail" type="mail" v-model="email"></v-text-field>
  <v-text-field label="senha" type="password" v-model="password"></v-text-field>
    </v-row>
    <v-btn @click="login"
        color="success"
        depressed
      > Save</v-btn>
  </v-card>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'Login',
  data(){
    return{
      email: null,
      password: null,
      feedback: null
    }
  },
 
  methods: {
    login(){
      if(this.email && this.password){
        this.feedback = null
        firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        .then(user => {
        console.log(user)
          this.$router.push({ name: 'Home' })
        }).catch(err => {
          this.feedback = err.message
        })
      } else {
        this.feedback = 'Please fill in both fields'
      }
    }
  }
}
</script>
<style>

</style>