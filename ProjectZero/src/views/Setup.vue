<template>
<div class="setup">
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
        <v-icon right class="white--text">build</v-icon>
        </v-toolbar>
        <Alert class="mt-2 ml-1 mr-1" />
            <v-form @submit.prevent="saveConfiguration">
              <v-row>
                <v-col class='ms-6 me-6'>
                  <v-select 
                  :items="options" 
                  :label="themeSelectLabel" 
                  v-model="selectedTheme" 
                  @change="setSelectedTheme($event)"
                  ></v-select>
                </v-col>
              </v-row>
            <v-row>
              <v-col class='ms-6 me-6'>
                <v-text-field
                  v-model="companyName"
                  :label="companyNameLabel"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col class='ms-6 me-6'>
                <v-text-field
                  v-model="companyContact"
                  :label="companyContactLabel"
                />
             </v-col>
            </v-row>
            <v-row>
              <v-col class='ms-6 me-6'>
                <v-text-field
                  v-model="companyEmail"
                  :label="companyEmailLabel"
                />
              </v-col>
            </v-row>
            <v-row justify='center'>
              <v-col class='ms-6 me-6'>
                <div style="text-align: center;">
                  <img :src="imgUrl" height="50"/>
                </div>
              </v-col>
            </v-row>
            <v-row justify='center'>
              <v-col class='ms-6 me-6'>
                <div style="text-align: center;">
                  <v-btn raised class="primary" @click="uploadLogoButtonClick">Upload logo
                    <v-icon style="margin-left:8px;">publish</v-icon>
                  </v-btn>
                  <input 
                    type="file" 
                    style="display: none" 
                    ref="uploadLogo" 
                    accept="image/*"
                    @change="onFilePicked"/>
                </div>
              </v-col>
            </v-row>
            <v-row >
              <v-col class='ms-6 me-6' >
                 <v-btn
                    color="success"
                    depressed
                    @click="readConfiguration"
                  > 
                    Carregar padrão
                    <v-icon style="margin-left:8px;">cloud_download
                    </v-icon>
                  </v-btn>
                  </v-col>
                  <v-col  class="d-flex justify-end ms-6 me-6">
                   <v-btn
                    color="primary"
                    depressed
                    type="submit"
                  > 
                    Salvar
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


const computed = mapState("setup", {
  id: state => state.id,
  selectedTheme: state => state.selectedTheme,
  companyName: state => state.companyName,
  companyContact: state => state.companyContact,
  companyEmail: state => state.companyEmail,
  imgUrl: state => state.imgUrl,
  image: state => state.image
})

const computedGeneral = mapState("general", {
    isLoading: state => state.isLoading
})

const methods = mapActions("setup", [
  "readConfiguration",
  "onFilePicked",
  "saveConfiguration"
])

export default {
  components: { Alert },
  name: "Configurações",
  data() {
    return {
      screenTitle: 'Configurações',
      themeSelectLabel: 'Tema',
      options: [
        'Light', 
        'Dark'
        ], 
      companyNameLabel: 'Razão social',
      companyContactLabel: 'Contato',
      companyEmailLabel: 'E-mail',
    } 
  },
  
  methods: Object.assign({}, methods, {
    uploadLogoButtonClick(){
        this.$refs.uploadLogo.click()
      },
    setSelectedTheme(value) {
        this.$vuetify.theme.light = value == 'Light'
        this.$vuetify.theme.dark = value == 'Dark'
      }
  }),

  computed: Object.assign({}, computed, computedGeneral),

  mounted() {
    this.readConfiguration()
  }
}
</script>

<style>

</style>