<template>
<div class="login" >
  <br>
 <v-row class="dark" justify="center">
      <v-card>
        <v-toolbar class="primary ">
          <h3 class="white--text">{{ screenTitle }}</h3>
            <v-spacer></v-spacer>
          <v-icon right class="white--text">vpn_key</v-icon>
        </v-toolbar>
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
                </v-col>
                <v-btn @click="reset"
                  color="success"
                > Limpar</v-btn>
                 <v-spacer></v-spacer>
              <v-btn @click="resetPassword"
                  :loading="loading"
                  color="primary"
                  :disabled="!valid"
                > Enviar senha
                <template v-slot:loader>
                  <span class='custom-loader'>
                    <v-icon light>cached</v-icon>
                  </span>
                </template>
                </v-btn>
                 </v-row>
                 </v-form>
          </v-container>
   </v-card-text>
  </v-card>

</v-row>
</div>
</template>

<script>

export default {
    name: 'ResetPassword',
    data() {
        return {
            valid: false,
            screenTitle: 'Esqueci a senha',
            email: '',
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /.+@.+/.test(v) || 'E-mail must be valid'
            ]
        }
    },
    computed: {
      loading(){
        return this.$store.getters.loading
      }
    },
    methods: {
        resetPassword() {
                this.$store.dispatch('resetPassword', {
                    email: this.email
                })
        },
        reset () {
        this.email = ''
      }
    }
}

</script>
<style>

</style>