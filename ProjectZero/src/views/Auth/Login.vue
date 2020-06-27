<template>
  <div class="login" >
    <br />
    <v-banner>
      <a href="Home"><v-img :src="imageUrl"></v-img></a>
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
                <v-btn color="error" router :to="{name: 'ResetPassword'}"> 
                  <v-icon light style="margin-right:8px;">vpn_key</v-icon>
                  Esqueci a senha  </v-btn>
                <v-spacer></v-spacer>
                <v-btn 
                
                @click="login" :loading="isLoading" color="primary" :disabled="!valid">
                  Login <v-icon light style="margin-left:8px;">send</v-icon>
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
import { mapActions  } from "vuex"
import { fileStorage } from "@/main"
import { db } from "@/main"




export default {
  components: { Alert },
  name: "Login",
  data() {
    return {
      imageUrl: "",
      valid: false,
      screenTitle: "Login",
      screenCompany: "",
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

    login() {
      this.userLogin( {
        email: this.email,
        password: this.password
      })
    },

    readLogo() {
      fileStorage
        .ref("logo")
        .listAll()
        .then(result => {
          result.items[0].getDownloadURL().then(url => {
            this.imageUrl = url
          })
        })
        .catch(error => {
          console.log("Error getting logo image: ", error)
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
          console.log("Error getting documents: ", error)
        })

      
    }
  },
  computed: {
    isLoading() {
      return this.$store.state.general.isLoading
    }
  },
  mounted() {
    this.readLogo()
    this.readCompanyName()
  }
};
</script>
