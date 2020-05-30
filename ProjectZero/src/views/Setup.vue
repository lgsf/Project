<template> 
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <h1 class="primary--text">Configurações</h1>
      </v-flex>
    </v-layout>
    <v-layout row v-if="error">
      <v-flex xs12 sm6 offset-sm3>
        <app-alert @dismissed="onDismissed" :text="error.message"></app-alert>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12> 
        <form @submit.prevent="saveConfiguration">
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-select 
              :items="options" 
              :label="themeSelectLabel" 
              :value="selectedTheme" 
              @input="setSelectedTheme"
              item-text="description"
              item-value="code"
              ></v-select>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field
                v-model="companyName"
                :label="companyNameLabel"
              />
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field
                v-model="companyContact"
                :label="companyContactLabel"
              />
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field
                v-model="companyEmail"
                :label="companyEmailLabel"
              />
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-btn raised class="primary" @click="uploadLogoButtonClick">Upload logo</v-btn>
              <input 
                type="file" 
                style="display: none" 
                ref="uploadLogo" 
                accept="image/*"
                @change="onFilePicked"/>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-btn
                color="success"
                depressed
                type="submit"
                :disabled="loading"
                :loading="loading"
              > 
                Salvar
                <span slot="loader" class="custom-loader">
                  <v-icon light>cached</v-icon>
                </span>
              </v-btn>
            </v-flex>
          </v-layout>
        </form>
      </v-flex>
    </v-layout>
  </v-container>
</template> 

<script> 
  import { db } from '@/main'
  export default { 
    data: () => ({ 
      screenTitle: 'Configurações',
      themeSelectLabel: 'Tema',
      options: [
        { code: 1, description: 'Light'}, 
        { code: 2, description: 'Dark'}, 
        ], 
      companyNameLabel: 'Razão social',
      companyContactLabel: 'Contato',
      companyEmailLabel: 'E-mail',
      selectedTheme: '',
      companyName: '',
      companyContact: '',
      companyEmail: ''
    }),
    computed: {
      configuration () {
        return this.$store.actions
      },
      error (){
        return this.$store.getters.error
      },
      loading (){
        return this.$store.getters.loading
      }
    },
    mounted () {
      this.getConfigurations()
    },
    methods: {
      async getConfigurations () {
        let snapshot = await db.collection('systemConfiguration').get()
        const events = []
        snapshot.forEach(config => {
          let appData = config.data()
          this.selectedTheme = appData.theme_code;
          this.companyName = appData.company_name;
          this.companyContact = appData.company_phone;
          this.companyEmail = appData.company_email;
          events.push(appData)
        })
        this.events = events
      },
      setSelectedTheme(value) {
        this.$vuetify.theme.light = value == 1;
        this.$vuetify.theme.dark = value == 2;
      },
      uploadLogoButtonClick(){
        this.$refs.uploadLogo.click();
      },
      onFilePicked (event){
        const inputFile = event.target.files[0];
        let fileName = inputFile.name;
        if(fileName.lastIndexOf('.') <= 0){
          return alert('Por favor, insira um arquivo válido.');
        }
        const fileReader = new FileReader();
        fileReader.addEventListener('load', () => {
          this.imageUrl = fileReader.result;
        });
        fileReader.readAsDataURL(inputFile);
        this.image = inputFile
      },
      saveConfiguration() {
        const configuration = {
          themeCode: this.selectedTheme,
          companyName: this.companyName,
          companyContact: this.companyContact,
          companyEmail: this.companyEmail,
          image: this.image
        }
        this.$store.dispatch('saveConfiguration', configuration)
      },
      onDismissed() {
        this.$store.dispatch('clearError')
      }
    }
  } 
</script>