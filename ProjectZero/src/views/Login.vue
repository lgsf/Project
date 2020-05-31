<template>
<div class="login" >
  <br>
 <v-row class="dark" justify="center">
      <v-card>
        <v-card-title class="primary ">
          <h3 class="white--text">Login</h3>
            <v-spacer></v-spacer>
          <v-icon right class="white--text">account_box</v-icon>
        </v-card-title>
          <v-card-text>
            <v-container>
              <v-row> 
                <v-col cols="12">
                <v-text-field label="e-mail" type="mail" v-model="email"></v-text-field>
                </v-col><v-col cols="12">
                <v-text-field label="senha" type="password" v-model="password"></v-text-field>
                </v-col>
                <v-btn 
                  color="error"
                > Esqueci a senha</v-btn>
                 <v-spacer></v-spacer>
              <v-btn @click="login"
                  color="primary  "
                > Login</v-btn>
                
                
                 </v-row>
          </v-container>
   </v-card-text>
  </v-card>

</v-row>
</div>
</template>

<script>
export default {
    name: 'Login',
    data() {
        return {
            valid: false,
            email: '',
            password: ''
        };
    },
    methods: {
        login() {
                this.$store.dispatch('userLogin', {
                    email: this.email,
                    password: this.password
                });
        }
    }
};
</script>
<style>

</style>