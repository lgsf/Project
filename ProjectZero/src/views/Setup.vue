<template>
<div class="setup">
    <v-row justify="center">
        <v-card>
        <v-toolbar class="primary white--text" >
          <h3>
            {{ screenTitle }}
          </h3>
          <v-spacer></v-spacer>
        <v-icon right class="white--text">build</v-icon>
        </v-toolbar>
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
                  <img :src="imageUrl" height="150"/>
                </div>
              </v-col>
            </v-row>
            <v-row justify='center'>
              <v-col class='ms-6 me-6'>
                <div style="text-align: center;">
                  <v-btn raised class="primary" @click="uploadLogoButtonClick">Upload logo</v-btn>
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
                  </v-btn>
                  </v-col>

                  <v-col class='ms-6 me-6'>
                   <v-btn
                    color="primary"
                    depressed
                    type="submit"
                  > 
                    Salvar
                  </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
    </v-row>
  </div>
</template>

<script>
import { db } from '@/main'
import { fileStorage } from '@/main'
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
      id: '',
      selectedTheme: 'Light',
      companyName: '',
      companyContact: '',
      companyEmail: '',
      image: null,
      imageUrl: ''
};    
  },
  methods: {
    uploadLogoButtonClick(){
        this.$refs.uploadLogo.click();
      },
    setSelectedTheme(value) {
        this.$vuetify.theme.light = value == 'Light';
        this.$vuetify.theme.dark = value == 'Dark';
      },
    onFilePicked (event){
        const inputFile = event.target.files[0];
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
          this.imageUrl = e.target.result;
        };

        fileReader.readAsDataURL(inputFile);
        this.image = inputFile
    },
    readConfiguration() {
      db.collection("systemConfiguration")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.id = doc.id
            this.companyName = doc.data().company_name
            this.companyContact = doc.data().company_phone
            this.companyEmail = doc.data().company_email
            this.selectedTheme = doc.data().theme_code
            });
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });

        fileStorage.ref().listAll()
        .then(result => {
          result.items[0].getDownloadURL()
          .then((url) => { this.imageUrl = url });
        })
        .catch((error) => {
          console.log("Error getting logo image: ", error);
        });
    },
    saveConfiguration() {
      db.collection("systemConfiguration")
        .doc(this.id)
        .update({
          company_name: this.companyName,
          company_phone: this.companyContact,
          company_email: this.companyEmail,
          theme_code: this.selectedTheme,
        })
        .then(() => {
          const fileName = 'logo' + this.image.name.slice(this.image.name.lastIndexOf('.'))
          const storageRef = fileStorage.ref(fileName)
          storageRef.put(this.image)
        })
        .then(()=>{
          this.readConfiguration();
        })
        .catch((error) => {
          console.error("Error updating document: ", error);
        });
    },
  },
  mounted() {
    this.readConfiguration();
  },
};
</script>

<style>
#outer {
  width: 100%;
  text-align: center;
}
</style>