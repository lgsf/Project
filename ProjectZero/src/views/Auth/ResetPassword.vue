<template>
<div class="resetPassword" >
  <br>
    <v-banner >
      <router-link to="/home"><v-img  :src="imgUrl" height="150" width="150" contain></v-img></router-link>
      <template v-slot:actions>
        <h3 class="primary--text">{{screenCompany}}</h3>
      </template>
    </v-banner>
    <br />
    <Alert class="mt-2 ml-1 mr-1" />
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
                > <v-icon light style="margin-right:8px;">delete_sweep</v-icon>Limpar</v-btn>
                 <v-spacer></v-spacer>
              <v-btn @click="go"
                  :loading="isLoading"
                  color="primary"
                  :disabled="!valid"
                > Enviar senha <v-icon light style="margin-left:8px;">send</v-icon>
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
import { mapActions, mapState  } from "vuex"
import Alert from "@/components/shared/Alert"

const computed = mapState("setup", {
  screenCompany: state => state.companyName,
  imgUrl: state => state.imgUrl
})

const computedGeneral = mapState("general", {
    isLoading: state => state.isLoading
})

export default {
    components: { Alert },
    name: 'ResetPassword',
    data() {
        return {
            valid: false,
            screenTitle: 'Esqueci a senha',
            email: '',
            emailRules: [
                v => !!v || 'O endereço de e-mail é obrigatório',
                v => /.+@.+/.test(v) || 'O endereço de email deve ser válido'
            ]
        }
    },

    computed: Object.assign({}, computed, computedGeneral),
    
    methods: {
      ...mapActions("setup", ["readLogo", "readCompanyName"]),

      ...mapActions("general", ["resetAllMessages"]),

      ...mapActions("auth", ["resetPassword"]),

      go() {
        this.resetPassword({
            email: this.email
        })
      },

      reset() {
        this.email = ''
      }

    },

    mounted() {
    this.resetAllMessages()
    this.readLogo()
    this.readCompanyName()
  }

}
</script>
<style>

</style>