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
            <v-row>
                <v-col class='ms-6 me-6'>
                  <v-select 
                  :items="options" 
                  label="Tema" 
                  v-model="selectedTheme" 
                  disabled
                  ></v-select>
                </v-col>
              </v-row>
            <v-row>
              <v-col class='ms-6 me-6 d-none d-sm-flex' >
                 <v-btn
                    color="success"
                    depressed
                    @click="changeThemeDB"
                  > 
                    Mudar o tema
                    <v-icon style="margin-left:8px;">cloud_download
                    </v-icon>
                  </v-btn>
                  </v-col>
                  <v-col class="justify-end ms-6 me-6 d-none d-sm-flex">
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
              <v-col class='justify-center d-flex d-sm-none' cols="12">
                 <v-btn
                    color="success"
                    depressed
                    @click="changeThemeDB"
                  > 
                    Mudar o tema
                    <v-icon style="margin-left:8px;">cloud_download
                    </v-icon>
                  </v-btn>
                  </v-col>
                  <v-col  class="justify-center d-flex d-sm-none" cols="12">
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

const computedAuth = mapState("auth", {
  selectedTheme: state => state.selectedTheme
})

const methods = mapActions("users", [
  "readUsers"
])

const authMethods = mapActions("auth", [
  "changePasswordStore",
  "changeThemeDB"
])

export default {
  components: { Alert },
  name: "Perfil",
  data() {
    return {
      options: [
        'Light', 
        'Dark'
        ], 
      screenTitle: 'Perfil',
      width: window.innerWidth,
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
    }
  }),
  
  computed: Object.assign({}, computed, computedGeneral, computedAuth),

  mounted() {
    this.readUsers(true)
  }
}
</script>
