<template> 
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <h1 class="primary--text">Configurações</h1>
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
              :value="configurationData.selectedTheme" 
              @input="setSelectedTheme"
              ></v-select>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field
                v-model="configurationData.companyName"
                :label="companyNameLabel"
              />
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field
                v-model="configurationData.companyContact"
                :label="companyContactLabel"
              />
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field
                v-model="configurationData.companyEmail"
                :label="companyEmailLabel"
              />
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <!--<v-btn raised class="primary" @click="uploadLogoButtonClick">Upload logo</v-btn>
              <input 
                type="file" 
                style="display: none" 
                ref="uploadLogo" 
                accept="image/*"
                @change="onFilePicked"/>-->
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-btn
                color="success"
                depressed
                type="submit"
              > 
                Salvar
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
      configurationData: {
        id: '',
        selectedTheme: 1,
        companyName: '',
        companyContact: '',
        companyEmail: '',
        image: null,
        imageUrl: ''
      }
};    
  },
  watch:{
    configurationData: function (newValue) {
      this.$vuetify.theme.light = newValue.selectedTheme == 'Light';
        this.$vuetify.theme.dark = newValue.selectedTheme == 'Dark';
    }
  },
  methods: {
      setSelectedTheme(value) {
          console.log('teste')
        this.$vuetify.theme.light = value.selectedTheme == 'Light';
        this.$vuetify.theme.dark = value.selectedTheme == 'Dark';
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
    readConfiguration() {
      db.collection("systemConfiguration")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.configurationData = {
              id: doc.id,
              companyName: doc.data().company_name,
              companyContact: doc.data().company_phone,
              companyEmail: doc.data().company_email,
              selectedTheme: doc.data().theme_code
            };
            console.log(doc.id, " => ", doc.data());
          });
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    },
    saveConfiguration() {
      db.collection("systemConfiguration")
        .doc(this.configurationData.id)
        .update({
          company_name: this.configurationData.companyName,
          company_phone: this.configurationData.companyContact,
          company_email: this.configurationData.companyEmail,
          theme_code: this.configurationData.selectedTheme,
        })
        .then(() => {
          console.log("Document successfully updated!");
          this.readConfiguration();
        })
        .catch((error) => {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
        });
    },
  },
  mounted() {
    this.readConfiguration();
  },
};
</script>