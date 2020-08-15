<template>
<div class="profile">
    <Alert class="mt-2"/>
    <v-row style="min-width:70vw;">
      <v-col>
        <div class="text-center screen-margin-top" v-if="isLoading">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
        <v-card v-if="!isLoading">
        <v-toolbar class="primary white--text" >
          <h3>
            {{ screenTitle }}
          </h3>
          <v-spacer></v-spacer>
        <v-icon right class="white--text">mdi-account</v-icon>
        </v-toolbar>
            <v-form v-model="valid">
            <v-row>
              <v-col class='ms-6 me-6'>
                <v-text-field
                  v-model="this.$store.state.auth.userName"
                  label="Nome"
                  :disabled="true"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col class='ms-6 me-6'>
                <v-text-field
                  v-model="this.$store.state.auth.user.email"
                  label="E-mail"
                  :disabled="true"
                />
             </v-col>
            </v-row>
            <v-row>
              <v-col class='ms-6 me-6'>
                <v-text-field
                  v-model="password"
                  label="Nova senha"
                  @input="setPassword"
                  :rules="passwordRules"
                  type="password"
                  autocomplete="on"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col class='ms-6 me-6'>
                <v-text-field
                  v-model="confirmedPassword"
                  label="Confirme a nova senha"
                  @input="confirmPassword"
                  :rules="passwordCompareRules"
                  type="password"
                  autocomplete="on"
                />
              </v-col>
            </v-row>
            <v-row v-if="checkWidth">
              <v-col class='ms-6 me-6' >
                 <v-btn
                    color="success"
                    depressed
                    @click="readConfiguration"
                  > 
                    Mudar o tema
                    <v-icon style="margin-left:8px;">cloud_download
                    </v-icon>
                  </v-btn>
                  </v-col>
                  <v-col  class="d-flex justify-end ms-6 me-6">
                   <v-btn
                    color="primary"
                    depressed
                    :disabled="!valid"
                    @click="changePassword"
                  > 
                    Mudar a senha
                    <v-icon style="margin-left:8px;">send</v-icon>
                  </v-btn>
              </v-col>
            </v-row>
            <v-row v-if="!checkWidth" >
              <v-col class='d-flex justify-center' cols="12">
                 <v-btn
                    color="success"
                    depressed
                    @click="readConfiguration"
                  > 
                    Mudar o tema
                    <v-icon style="margin-left:8px;">cloud_download
                    </v-icon>
                  </v-btn>
                  </v-col>
                  <v-col  class="d-flex justify-center" cols="12">
                   <v-btn
                    color="primary"
                    depressed
                    :disabled="!valid"
                    @click="changePassword"
                  > 
                    Mudar a senha
                    <v-icon style="margin-left:8px;">send</v-icon>
                  </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
        </v-col>
    </v-row>
  </div>
</template>

<script>
import Alert from "@/components/shared/Alert"
import { mapActions, mapState  } from "vuex"


const computed = mapState("users", {
  userJustMe: state => state.userJustMe
})

const computedGeneral = mapState("general", {
    isLoading: state => state.isLoading
})

const methods = mapActions("users", [
  "readUsers"
])

const authMethods = mapActions("auth", [
  "changePasswordStore"
])

export default {
  components: { Alert },
  name: "Perfil",
  data() {
    return {
      screenTitle: 'Perfil',
      width: 0,
      valid: false,
      password: '',
      confirmedPassword: '',
      passwordRules: [
        v => !!v || "A senha é obrigatória",
        v => v.length >= 6 || "A senha deve conter mais de 6 caracteres"
      ],
      passwordCompareRules: [
        v => !!v || "A senha é obrigatória",
        v => v == this.password || "As senhas não são iguais"
      ]
    } 
  },
  
  methods: Object.assign({}, methods, authMethods, {
    setPassword(payload){
        this.password = payload
      },
    confirmPassword(payload) {
        this.confirmedPassword = payload
      },
    changePassword(){
        this.changePasswordStore(this.password)
    },
    checkScreenWidth() {
      setInterval(() => {
        this.width = window.innerWidth
      }, 100)
    }
  }),
  computed: Object.assign({}, computed, computedGeneral, {
      checkWidth() {
      if (this.width > 620) {
        return true
      } else return false
    }
  }),

  mounted() {
    this.readUsers(true)
    this.checkScreenWidth()
  }
}
</script>
