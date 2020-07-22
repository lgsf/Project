<template>
<div class="import">
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
        <v-icon right class="white--text">import_export</v-icon>
        </v-toolbar>
        <Alert class="mt-2 ml-1 mr-1" />
              <v-row>
                <v-col cols="9" class='ms-6 me-6'>
                <v-radio-group v-model="picked" label="O que deseja importar:" row>
                  <v-radio label="Clientes" value="clients"></v-radio>
                  <v-radio label="Usuários" value="users"   ></v-radio>
                </v-radio-group>
                </v-col>
                </v-row>
                <div v-if="picked === 'clients'" >
                <v-row>
                    <v-col cols="5" xl="10" md="10" lg="10" class='ms-6 me-6'>
                    <v-file-input
                        v-model="file"
                        placeholder="Selecione"
                        label="Anexo de clientes:"
                        prepend-icon="mdi-paperclip"
                    >
                        <template v-slot:selection="{ text }">
                        <v-chip small label color="primary">{{ text }}</v-chip>
                        </template>
                    </v-file-input>
                    </v-col>
                    <v-col cols="1">
                    <v-btn
                        v-if="file"
                        dark
                        color="primary"
                        class="mt-4"
                        @click="addFiles('clients')"
                    >
                        <v-icon>mdi-import</v-icon>Importar
                    </v-btn>
                    
                    </v-col>
                </v-row>
                </div>
                  <div v-if="picked === 'users'" >
                <v-row>
                    <v-col cols="9">
                    <v-file-input
                        v-model="file"
                        placeholder="Selecione o arquivo de usuários"
                        label="Anexos:"
                        prepend-icon="mdi-paperclip"
                    >
                        <template v-slot:selection="{ text }">
                        <v-chip small label color="primary">{{ text }}</v-chip>
                        </template>
                    </v-file-input>
                    </v-col>
                    <v-col cols="2">
                    <v-btn
                        v-if="file"
                        dark
                        color="primary"
                        class="mt-4"
                        @click="addFiles('users')"
                    >
                        <v-icon>mdi-plus</v-icon>Adicionar
                    </v-btn>
                    </v-col>
                </v-row>
                </div>

        </v-card>
        </v-col>
    </v-row>
  </div>
</template>
<script>
import Alert from "@/components/shared/Alert"
import {  mapState, mapActions  } from "vuex"
import XLSX from "xlsx"
import sendToDatabase from '@/utilities/sendDataToDB'

const computedGeneral = mapState("general", {
    isLoading: state => state.isLoading
})


export default {
  components: { Alert },
  name: "Importação",
  data() {
    return {
      screenTitle: 'Importações',
      picked: '',
      file: null
    } 
  },
  
  methods:  {
    ...mapActions("general", ["setSuccessMessage"]),

    addFiles(payload) {
     if(payload === "clients") {
      let clientsFile = this.file
      let reader = new FileReader()
      reader.onload = function(e) {
            let data = new Uint8Array(e.target.result)
            let workbook = XLSX.read(data, {type: 'array'})
            let sheetName = workbook.SheetNames[0]
            let worksheet = workbook.Sheets[sheetName]
            sendToDatabase(XLSX.utils.sheet_to_json(worksheet))
          }
          reader.readAsArrayBuffer(clientsFile)
          this.setSuccessMessage("Os clientes foram importados com sucesso!")
       }
     else if(payload === "users") {
        let usersFile = this.file
        let reader = new FileReader()
        reader.onload = function(e) {
                let data = new Uint8Array(e.target.result)
                let workbook = XLSX.read(data, {type: 'array'})
                let sheetName = workbook.SheetNames[0]
                let worksheet = workbook.Sheets[sheetName]
                console.log(worksheet)
                //to implement cloud functions
            }
            reader.readAsArrayBuffer(usersFile)
            this.setSuccessMessage("Os usuários foram importados com sucesso!")
        }
      this.file = []
    },
  },

  computed: Object.assign({}, computedGeneral),
  
}
</script>