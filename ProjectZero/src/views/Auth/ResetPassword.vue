<template>
<div class="resetPassword" >
  <br>
    <v-banner >
      <a href="Home"><v-img :src="imageUrl"></v-img></a>
      <template v-slot:actions>
        <h3>{{screenCompany}}</h3>
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
import { mapActions  } from "vuex"
import { fileStorage } from "@/main"
import { db } from "@/main"
import catchError from '@/utilities/firebaseErrors'
import Alert from "@/components/shared/Alert"

export default {
    components: { Alert },
    name: 'ResetPassword',
    data() {
        return {
          links: [
                    {name:'Home', href: 'https://project42-saas.web.app/#/'}
                    ],
            imageUrl: "",
            valid: false,
            screenCompany: "",
            screenTitle: 'Esqueci a senha',
            email: '',
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /.+@.+/.test(v) || 'E-mail must be valid'
            ]
        }
    },

    computed: {
      isLoading(){
        return this.$store.state.general.isLoading
      }
    },
    
    methods: {
      readLogo() {
        fileStorage.ref("logo")
        .listAll()
        .then(result => {
          result.items[0].getDownloadURL().then(url => {
            this.imageUrl = url
          })
        })
        .catch((error) => {
                let errorMessage = catchError(error)
                this.dispatch('general/setErrorMessage', errorMessage)
            })
    },

    readCompanyName(){
      db.collection("systemConfiguration")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.screenCompany = doc.data().company_name
            })
        })
       .catch((error) => {
                let errorMessage = catchError(error)
                this.dispatch('general/setErrorMessage', errorMessage)
            })
    },

      ...mapActions("auth", ["resetPassword"]),
        go() {
                this.resetPassword({
                    email: this.email
                })
        },
        reset () {
        this.email = ''
      }
    },

    mounted() {
    this.readLogo()
    this.readCompanyName()
  }
}

</script>
<style>

</style>