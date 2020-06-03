<template>
<div class="login" >
  <br>
 <v-row class="dark" justify="center">
      <v-card>
        <v-toolbar class="primary ">
          <h3 class="white--text">{{ screenTitle }}</h3>
            <v-spacer></v-spacer>
          <v-icon right class="white--text">account_box</v-icon>
        </v-toolbar>
        <Alert/>
          <v-card-text>
            <v-container>
              <v-form v-model="valid" > 
              <v-row> 
                <v-col cols="12">
                <v-text-field name="email"
                                label="Email"
                                type="email"
                                v-model="email"
                                :rules="emailRules"
                                required></v-text-field>
                </v-col><v-col cols="12">
                <v-text-field name="password"
                                label="Password"
                                type="password"
                                autocomplete="on"
                                v-model="password"
                                :rules="passwordRules"
                                required></v-text-field>
                </v-col>
                <v-btn 
                  color="error"
                  router :to="{name: 'ResetPassword'}"
                > Esqueci a senha</v-btn>
                 <v-spacer></v-spacer>
              <v-btn @click="login"
                  color="primary"
                  :disabled="!valid"
                > Login</v-btn>
                 </v-row>
                 </v-form>
          </v-container>
   </v-card-text>
  </v-card>

</v-row>
</div>
</template>

<script>
import Alert from "@/components/shared/Alert";

export default {
    components: { Alert },
    name: 'Login',
    data() {
        return {
            valid: false,
            screenTitle: 'Login',
            email: '',
            password: '',
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /.+@.+/.test(v) || 'E-mail must be valid'
            ],
            passwordRules: [
                v => !!v || 'Password is required',
                v =>
                    v.length >= 6 ||
                    'Password must be greater than 6 characters'
            ]
        };
    },
    methods: {
        login() {
                this.$store.dispatch('userLogin', {
                    email: this.email,
                    password: this.password
                })
        }
    }
}
</script>
<style>

</style>