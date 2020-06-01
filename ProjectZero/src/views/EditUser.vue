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
                <v-text-field label="Nome*" v-model="name" @change="setName" required></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Email" v-model="email"  @change="setEmail"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Telefone" v-model="phone"  @change="setPhone"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
              <v-menu
          ref="menu1"
          v-model="menu1"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
        >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="dateFormatted"
                    label="Data de nascimento"
                    persistent-hint
                    prepend-icon="event"
                    @blur="date = parseDate(dateFormatted)"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="birthDate" no-title @input="setBirthDate"></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-select 
                  :items="userGroups" 
                  label="Grupos" 
                  v-model="group" 
                  item-text="name"
                  item-value="name"
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
          <small>*Obrigatório</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">Fechar</v-btn>
          <v-btn color="blue darken-1" text @click="save">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import { db } from "@/main";

export default {
  props: ['refreshUsersMethod'],
  data() {
    return {
      dialog: false,
      menu1: false,
      dateFormatted: this.formatDate(new Date().toISOString().substr(0, 10)), 
      name: '',
      email: '',
      phone: '',
      birthDate: '',
      group: '',
      userGroups: []
    };
  },
  methods: {
    setName(value){
      this.name = value
    },
    setEmail(value){
      this.email = value
    },
    setPhone(value){
      this.phone = value
    },
    setBirthDate(value){
      this.birthDate = value
    },
    formatDate (date) {
        if (!date) return null

        const [year, month, day] = date.split('-')
        return `${month}/${day}/${year}`
      },
    openEdit(id, name, email, phone, birthDate, group){
      this.id = id
      this.name = name
      this.email = email
      this.phone = phone
      this.birthDate = birthDate
      this.group = { name: group }
      this.show()
    },
    openCreate(){
      this.show()
    },
    show() {
      this.dialog = true
    },
    close() {
      this.name = ''
      this.email = ''
      this.phone =''
      this.birthDate = ''
      this.group = ''
      this.dialog = false
    },
    save(){
      if(this.id){
        db.collection("users")
                .doc(this.id)
                .update({
                  name: this.name,
                  email: this.email,
                  phone: this.phone,
                  birth_date: this.birthDate,
                  group: this.group,
                })
                .then(()=>{
                  this.close();
                })
                .catch((error) => {
                  console.error("Error updating document: ", error);
                });
      }
      else{
        db.collection("users")
                .add({
                  name: this.name,
                  email: this.email,
                  phone: this.phone,
                  birth_date: this.birthDate,
                  group_name: this.group,
                })
                .then(()=>{
                  this.close();
                })
                .catch((error) => {
                  console.error("Error inserting document: ", error);
                });
      }
      this.refreshUsersMethod();
    },
    readGroups() {
      db.collection("groups")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => { this.userGroups.push({
              name: doc.data().name
            })
          });
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    }
  },
  mounted() {
    this.readGroups()
  }
};
</script>
<style lang="stylus"></style>