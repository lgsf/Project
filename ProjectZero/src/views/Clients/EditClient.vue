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
                  <v-text-field label="Razão Social*" :value="name" @input="editName" required></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <cnpj-field label="CNPJ" :value="cnpj" @input="editCnpj" required="true"></cnpj-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <email-field label="Email" :value="email" @input="editEmail" required="true"></email-field>
                </v-col>
              </v-row>
            </v-container>
            <small>*Obrigatório</small>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeSelectionClient(false)">Fechar</v-btn>
            <v-btn color="blue darken-1" :disabled="!isNotValid" text @click="saveClient">Salvar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-form>
</template>
<script>
import { mapState, mapActions } from "vuex";
import EmailField from "@/components/shared/EmailField";
import CnpjField from "@/components/shared/CnpjField";

const computed = mapState("clients", {
  title: state => state.editTitle,
  dialog: state => state.editClient,
  name: state => state.editingName,
  cnpj: state => state.editingCnpj,
  email: state => state.editingEmail
});

const methods = mapActions("clients", [
  "editName",
  "editEmail",
  "editCnpj",
  "loadClients",
  "editClient",
  "saveClient",
  "closeSelectionClient"
]);

export default {
  components: { EmailField, CnpjField },
  data() {
    return {
      isNotValid: false
    };
  },
  computed,
  methods
};
</script>
<style lang="stylus"></style>