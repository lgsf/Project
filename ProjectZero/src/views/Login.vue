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
import firebase from 'firebase/app'

export default {
  name: 'Login',
  data(){
    return{
      email: null,
      password: null,
      feedback: null
    }
  },
  beforeCreate: () => {
      let flag = firebase.auth().currentUser
      if (flag){
        console.log("1")
        console.log(flag)
        console.log("rodei antes do oush do logun")
          this.$router.push({ name: 'Home' })
        }
      
      else{ console.log('eu rodei')

      }

    },
 
  methods: {
    login(){
      if(this.email && this.password){
        this.feedback = null
        firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        .then(user => {
        console.log(user)
        console.log("rodei antes do oush do logun")
          this.$router.push({ name: 'Home' })
        }).catch(err => {
          this.feedback = err.message
        })
      } else {
        this.feedback = 'Por fazer preencha ambos os campos!'
      }
    }
  }
}
</script>
<style>

</style>