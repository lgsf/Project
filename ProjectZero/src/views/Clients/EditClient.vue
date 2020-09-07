<template>
  <v-form v-model="isNotValid">
    <v-row justify="center">
      <v-dialog
        :value="dialog"
        persistent
        scrollable
        max-width="600px"
        @click:outside="closeSelectionClient(false)"
      >
        <v-card>
          <v-toolbar class="primary" dark>
            <v-toolbar-title>{{title}}</v-toolbar-title>
          </v-toolbar>
          <v-divider></v-divider>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="Razão Social*"
                    :value="name"
                    @input="editName"
                    :rules="[rules.nameRequired]"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <cnpj-field label="CNPJ*" :rules="[rules.cnpjRequired]" :value="cnpj" @input="editCnpj"></cnpj-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <email-field label="Email*" :value="email" @input="editEmail" ></email-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-text-field label="Data de criação" :value="date" disabled ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-text-field label="Cep" :value="cep" @input="checkCep" ></v-text-field>
                </v-col>
              </v-row>
              <v-row v-if="cep.length == 8">
                <v-col cols="12">
                  <v-text-field label="Rua" :value="street" @input="editStreet" ></v-text-field>
                </v-col>
              </v-row>
              <v-row v-if="cep.length == 8">
                <v-col cols="6">
                  <v-text-field label="Número" :value="number" @input="editNumber" ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field label="Complemento" :value="complement" @input="editComplement" ></v-text-field>
                </v-col>
              </v-row>
              <v-row v-if="cep.length == 8">
                <v-col cols="12">
                  <v-text-field label="Bairro" :value="neighborhood" @input="editNeighborhood" ></v-text-field>
                </v-col>
              </v-row>
              <v-row v-if="cep.length == 8">
                <v-col cols="6">
                  <v-text-field label="Cidade" :value="city" disabled></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field label="Estado" :value="stateOfClient" disabled></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                  <div>
                    <v-radio-group v-model="type" @change="editType" row>
                      <v-radio label="Cliente" value="Cliente"></v-radio>
                      <v-radio label="Fornecedor" value="Fornecedor"></v-radio>
                      <v-radio label="Ambos" value="Ambos"></v-radio>
                    </v-radio-group>
                  </div>
              </v-row>
              <v-row>
                <div>
                  <v-radio-group v-model="status" @change="editStatus" :mandatory="true" row>
                    <v-radio label="Ativo" value="Ativo"></v-radio>
                    <v-radio label="Inativo" value="Inativo"></v-radio>
                  </v-radio-group>
                </div>
              </v-row>
            </v-container>
            <small>*Obrigatório</small>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="cleanSelectionClient">Limpar</v-btn>
            <v-btn color="blue darken-1" text @click="closeSelectionClient('')">Fechar</v-btn>
            <v-btn color="blue darken-1" :disabled="!isNotValid" text @click="saveClient">Salvar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-form>
</template>
<script>
import { mapState, mapActions } from "vuex"
import EmailField from "@/components/shared/EmailField"
import CnpjField from "@/components/shared/CnpjField"
import { moment } from "@/main"
import * as cep from 'cep-promise'

const computed = mapState("clients", {
  title: state => state.editTitle,
  dialog: state => state.editClient,
  name: state => state.editingName,
  cnpj: state => state.editingCnpj,
  email: state => state.editingEmail,
  status: state => state.editingStatus,
  type: state => state.editingType,

  cep: state => state.editingCep,
  street: state => state.editingStreet,
  neighborhood: state => state.editingNeighborhood,
  number: state => state.editingNumber,
  complement: state => state.editingComplement,
  city: state => state.editingCity,
  stateOfClient: state => state.editingState,

  date: function(state) {
    if (state.editingDate == '') return moment().format('DD/MM/YYYY')
    else return state.editingDate
  }
})

const methods = mapActions("clients", [
  "editName",
  "editEmail",
  "editCnpj",
  "loadClients",
  "editClient",
  "saveClient",
  "closeSelectionClient",
  "cleanSelectionClient",
  "editType",
  "editStatus",
  "editAddress",
  "editNumber",
  "editComplement",
  "editStreet",
  "editNeighborhood"
])

export default {
  components: { EmailField, CnpjField },
  data() {
    return {
      isNotValid: false,
      rules: {
        nameRequired: value => !!value || `O campo Razão Social é obrigatório.`,
        cnpjRequired: value => !!value || `O campo CNPJ é obrigatório.`
      }
    }
  },
  computed,
  methods: Object.assign({}, methods, {
    checkCep(payload){
      if (payload.length == 8){
        cep(payload)
        .then(data => {
          this.editAddress(data)
        })
      }
      else return
    }
  }),
}
</script>
