<template>
  <div class="import">
    <v-row style="min-width:70vw;">
      <v-col>
        <v-card>
          <v-toolbar class="primary white--text">
            <h3>{{ screenTitle }}</h3>
            <v-spacer></v-spacer>
            <v-icon right class="white--text">import_export</v-icon>
          </v-toolbar>
          <Alert class="mt-2 ml-1 mr-1" />
          <v-row >
            <v-col cols="9" class="ms-6 me-6">
              <v-radio-group v-model="picked" label="O que deseja fazer?" row>
                <v-radio label="Exportar" value="Export" @change="clear('export')"></v-radio>
                <v-radio label="Importar" value="Import" @change="clear('import')"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
          <v-row v-if="picked === 'Export'" >
            <v-col cols="9" class="ms-6 me-6">
              <v-radio-group v-model="pickedExport" label="O que deseja exportar:" row>
                <v-radio label="Clientes" value="clients"></v-radio>
                <v-radio label="Usuários" value="users"></v-radio>
                <v-radio label="Notificações" value="notifications"></v-radio>
                <v-radio label="Ordem de Serviço" value="serviceOrders"></v-radio>
                <v-radio label="Ordem ERP" value="erp"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
          <v-row v-if="pickedExport !== ''" >
            <v-col cols="9" class="ms-6 me-6">
              <v-radio-group v-model="typeFile" label="Qual o tipo do arquivo de saída:" row>
                <v-radio label="CSV" value="csv"></v-radio>
                <v-radio label="XLS" value="xls" ></v-radio>
                <v-radio label="XLSX" value="xlsx" ></v-radio>
                <v-radio label="JSON" value="json"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
          <v-row v-if="picked === 'Import'" >
            <v-col cols="9" class="ms-6 me-6">
              <v-radio-group v-model="pickedImport" label="O que deseja importar:" row>
                <v-radio label="Clientes" value="clients" @change="sendInfoMessage('clients')"></v-radio>
                <v-radio label="Usuários" value="users" @change="sendInfoMessage('users')"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
          <div v-if="pickedImport === 'clients'">
            <v-row>
              <v-col cols="5" xl="10" md="10" lg="10" class="ms-6 me-6">
                <v-file-input
                  v-model="file"
                  accept=".xls, .xlsx, .csv"
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
                  @click="addFiles('clients', checkSuccess)"
                >
                  <v-icon style="padding-right:8px; padding-left:0px;">mdi-import</v-icon>Importar
                </v-btn>
              </v-col>
            </v-row>
          </div>
          <div v-if="pickedImport === 'users'">
            <v-row>
              <v-col cols="5" xl="10" md="10" lg="10" class="ms-6 me-6">
                <v-file-input
                  v-model="file"
                  placeholder="Selecione "
                  label="Anexo de usuários:"
                  prepend-icon="mdi-paperclip"
                >
                  <template v-slot:selection="{ text }">
                    <v-chip small label color="primary">{{ text }}</v-chip>
                  </template>
                </v-file-input>
              </v-col>
              <v-col cols="1">
                <v-btn v-if="file" dark color="primary" class="mt-4" @click="addFiles('users')">
                  <v-icon style="padding-right:8px; padding-left:0px;">mdi-import</v-icon>Importar
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
import { mapActions } from "vuex"
import XLSX from "xlsx"
import saveClientsBatch from "@/utilities/saveClientsBatch"
import { functions } from "@/main"

function readFileContent(file, saveFileContent) {
  let reader = new FileReader();
  reader.onload = function(e) {
    let data = new Uint8Array(e.target.result);
    let workbook = XLSX.read(data, { type: "array" });
    let sheetName = workbook.SheetNames[0];
    let worksheet = workbook.Sheets[sheetName];
    saveFileContent(worksheet);
  };
  reader.readAsArrayBuffer(file);
}

export default {
  components: { Alert },
  name: "Importação",
  data() {
    return {
      screenTitle: "Exportar/Importar dados",
      picked: '',
      pickedExport: '',
      pickedImport: '',
      file: null,
      typeFile: ''
    };
  },

  methods: {
    ...mapActions("general", [
      "setSuccessMessage",
      "setInfoMessage",
      "setWarningMessage",
      "resetAllMessages"
    ]),

    clear(payload){
      if(payload === 'import') {
        this.resetAllMessages()
        this.pickedExport = ''
        this.typeFile = ''
      }
      else {
        this.resetAllMessages()
        this.pickedImport = ''
        this.file = null
      }

    },

    sendInfoMessage(payload) {
      this.resetAllMessages()
      if (payload === "users") {
        this.setInfoMessage(
          "O arquivo deve conter ao menos duas colunas com títulos: email, name."
        )
      } else {
        this.setInfoMessage(
          "O arquivo deve conter ao menos três colunas com títulos: cnpj, name, email."
        )
      }
    },

    checkSuccess(errors) {
      this.resetAllMessages();
      if (!errors || errors.length == 0) {
        this.setSuccessMessage("Clientes importados com sucesso!");
        return;
      }
      this.setWarningMessage(errors.join("\n"));
    },

    addFiles(payload, callback) {
      if (payload === "clients") {
        readFileContent(this.file, worksheet => {
          saveClientsBatch(XLSX.utils.sheet_to_json(worksheet)).then(
            function() {
              callback();
            },
            function(errors) {
              callback(errors);
            }
          );
        });
      } else if (payload === "users") {
        readFileContent(this.file, worksheet => {
          let importUsers = functions.httpsCallable("importUsers");
          importUsers(XLSX.utils.sheet_to_json(worksheet));
        });
        this.setSuccessMessage(
          "Os dados estão sendo carregados, em instantes estarão disponíveis."
        );
      }
      this.file = undefined;
    }
  },

  mounted() {
    this.resetAllMessages();
  }
};
</script>