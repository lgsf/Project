<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <h1 class="primary--text">Usuário</h1>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Nome*" :value="name" required></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Email" :value="email"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Telefone" :value="phone"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Data de nascimento" :value="birthDate"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-select 
                  :items="options" 
                  :label="themeSelectLabel" 
                  v-model="selectedTheme" 
                  @change="setSelectedTheme($event)"
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
          <small>*Obrigatório</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">Fechar</v-btn>
          <v-btn color="blue darken-1" text @click="close">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import { db } from "@/main";

var menuItems = [];

export default {
  data() {
    return {
      dialog: false,
      name: '',
      email: '',
      phone: '',
      birthDate: '',
      group: '',
      userGroups: []
    };
  },
  methods: {
    show() {
      this.dialog = true
    },
    close() {
      this.name: ''
      this.email: ''
      this.phone: ''
      this.birthDate: ''
      this.group: ''
      this.dialog = false
    }
  },
  mounted() {
  }
};
</script>
<style lang="stylus"></style>