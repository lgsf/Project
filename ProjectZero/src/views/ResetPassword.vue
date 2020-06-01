<template>
<div class="login" >
  <br>
 <v-row class="dark" justify="center">
      <v-card>
        <v-card-title class="primary ">
          <h3 class="white--text">Esqueci a senha</h3>
            <v-spacer></v-spacer>
          <v-icon right class="white--text">vpn_key</v-icon>
        </v-card-title>
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
                <v-btn @click="limpar"
                  color="success"
                > Limpar</v-btn>
                 <v-spacer></v-spacer>
              <v-btn @click="reset"
                  color="primary"
                  :disabled="!valid"
                > Enviar senha</v-btn>
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
            email: '',
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /.+@.+/.test(v) || 'E-mail must be valid'
            ]
        };
    },
    methods: {
        reset() {
                this.$store.dispatch('resetPassword', {
                    email: this.email
                })
        }
    }
}

</script>
<style>

</style>