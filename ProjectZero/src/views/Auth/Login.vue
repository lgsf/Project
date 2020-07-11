<template>
  <div class="login" >
    <br />
    <v-banner>
      <a href="Home"><v-img :src="imgUrl"></v-img></a>
      <template v-slot:actions>
        <h3>{{screenCompany}}</h3>
      </template>
    </v-banner>
    <br />
    <v-row class="dark" justify="center">
      <v-card class="mx-auto">
        <v-toolbar class="primary">
          <h3 class="white--text">{{ screenTitle }}</h3>
          <v-spacer></v-spacer>
          <v-icon right class="white--text">account_box</v-icon>
        </v-toolbar>
        <Alert class="mt-2 ml-1 mr-1" />
        <v-card-text>
          <v-container>
            <v-form v-model="valid">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    name="email"
                    label="Email"
                    type="email"
                    v-model="email"
                    :rules="emailRules"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    name="password"
                    label="Password"
                    type="password"
                    autocomplete="on"
                    v-model="password"
                    :rules="passwordRules"
                    required
                    @keyup.13.native="login"
                  ></v-text-field>
                </v-col>
                <v-btn v-if="checkWidth" color="error" router :to="{name: 'ResetPassword'}"> 
                  <v-icon light style="margin-right:8px;">vpn_key</v-icon>
                  Esqueci a senha  </v-btn>
                  <v-btn v-if="!checkWidth" color="error" router :to="{name: 'ResetPassword'}"> 
                  <v-icon light >vpn_key</v-icon>
                  </v-btn>
                <v-spacer></v-spacer>
                <v-btn v-if="checkWidth"
                @click="login" :loading="isLoading" color="primary" :disabled="!valid">
                  Login <v-icon light style="margin-left:8px;">send</v-icon>
                  <template v-slot:loader>
                    <span class="custom-loader">
                      <v-icon light>cached</v-icon>
                    </span>
                  </template>
                </v-btn>
                <v-btn v-if="!checkWidth"
                @click="login" :loading="isLoading" color="primary" :disabled="!valid">
                 <v-icon light>send</v-icon>
                  <template v-slot:loader>
                    <span class="custom-loader">
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
import Alert from "@/components/shared/Alert"
import { mapActions, mapState  } from "vuex"

const computed = mapState("setup", {
  screenCompany: state => state.companyName,
  imgUrl: state => state.imgUrl
})

const computedGeneral = mapState("general", {
    isLoading: state => state.isLoading
})

export default {
  components: { Alert },
  name: "Login",
  data() {
    return {
      width: 0,
      valid: false,
      screenTitle: "Login",
      email: "",
      password: "",
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+/.test(v) || "E-mail must be valid"
      ],
      passwordRules: [
        v => !!v || "Password is required",
        v => v.length >= 6 || "Password must be greater than 6 characters"
      ]
    };
  },

  methods: {
    ...mapActions("auth", ["userLogin"]),

    ...mapActions("setup", ["readLogo", "readCompanyName"]),

    login() {
      this.userLogin( {
        email: this.email,
        password: this.password
      })
    },
    checkScreenWidth() {
            setInterval(() => {
                this.width = window.innerWidth
            }, 100)
        }
    
  },

  computed: Object.assign({}, computed, computedGeneral, {
    checkWidth() {
            if(this.width > 620){
              return true
            }
            else return false
        }
  }),

  mounted() {
    this.readLogo()
    this.readCompanyName()
    this.checkScreenWidth()
  }
  
}
</script>
