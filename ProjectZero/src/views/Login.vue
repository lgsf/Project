<template>
<div class="login">
  <br>
 <v-row justify="center">
      <v-card>
        <v-card-title>
          <h3 class="primary--text">Login</h3>
        </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                <v-text-field label="e-mail" type="mail" v-model="email"></v-text-field>
                </v-col><v-col cols="12">
                <v-text-field label="senha" type="password" v-model="password"></v-text-field>
                </v-col>
             
               
              <v-btn @click="login"
                  color="success"
                  depressed
                > Login</v-btn>
                 <v-spacer></v-spacer>
                <v-btn @click="reset"
                  color="error"
                  depressed
                > Esqueci a senha</v-btn>
                 </v-row>
          </v-container>
   </v-card-text>
  </v-card>

</v-row>
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
    },
    reset(){
      console.log('testando reset');
    }
  }
}
</script>
<style>

</style>