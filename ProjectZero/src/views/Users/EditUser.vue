<template>
  <v-form v-model="isNotValid">
    <v-row justify="center">
      <v-dialog :value="dialog" persistent max-width="600px" @click:outside="closeEditUserModal">
        <v-card>
          <v-toolbar class="primary" dark>
            <v-toolbar-title>Usuário</v-toolbar-title>
          </v-toolbar>
          <v-divider></v-divider>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field label="Nome*" :value="name" @input="setName" required></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <email-field label="Email*" :value="email" @input="setEmail" required="true"></email-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <phone-number-field label="Telefone" :value="phone" @input="setPhone"></phone-number-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <DatePicker
                    dateLabel="Data de Nascimento"
                    :value="birth_date"
                    v-on:update="setBirthDate"
                    ref="DatePicker"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-select
                    :items="userGroups"
                    label="Grupos"
                    @input="setGroup"
                    :value="group"
                    item-text="name"
                    item-value="id"
                    return-object
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
            <small>*Obrigatório</small>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeEditUserModal">Fechar</v-btn>
            <v-btn color="blue darken-1" :disabled="!isNotValid" text @click="save">Salvar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-form>
</template>

<script>
import DatePicker from "@/components/shared/DatePicker";
import PhoneNumberField from "@/components/shared/PhoneNumberField";
import EmailField from "@/components/shared/EmailField";
import { mapState, mapActions } from "vuex";

const computed = mapState("users", {
  dialog: state => state.showEditModal,
  name: state => state.editUserName,
  email: state => state.editUserEmail,
  phone: state => state.editUserPhone,
  group: state => state.editUserGroup,
  birth_date: state => state.editUserBirthDate,
  userGroups: state => state.userGroups
});

const methods = mapActions("users", [
  "setName",
  "setEmail",
  "setPhone",
  "setBirthDate",
  "setGroup",
  "save",
  "closeEditUserModal"
]);

export default {
  components: { DatePicker, PhoneNumberField, EmailField },
  data() {
    return {
      isNotValid: false
    };
  },
  methods,
  computed
};
</script>

<style lang="stylus"></style>