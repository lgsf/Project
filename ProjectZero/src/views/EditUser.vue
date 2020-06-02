<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-toolbar class="primary" dark>
          <v-toolbar-title>Usuario</v-toolbar-title>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Nome*" v-model="name" @change="setName" required></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Email" v-model="email" @change="setEmail"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Telefone" v-model="phone" @change="setPhone"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <DatePicker
                  dateLabel="Data de Nascimento"
                  :dateObj="birthDate"
                  v-on:update="updateDate"
                  ref="DatePicker"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-select
                  :items="userGroups"
                  label="Grupos"
                  v-model="group"
                  item-text="name"
                  item-value="id"
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
          <small>*Obrigatório</small>
        </v-card-text>
        <v-divider></v-divider>
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
import firebase from "firebase";
import DatePicker from "@/components/shared/DatePicker";

export default {
  components: { DatePicker },
  props: ["refreshUsersMethod"],
  data() {
    return {
      dialog: false,
      menu1: false,
      dateFormatted: this.formatDate(new Date().toISOString().substr(0, 10)),
      name: "",
      email: "",
      phone: "",
      birthDate: "",
      group: "",
      userGroups: []
    };
  },
  methods: {
    updateDate(value) {
      this.birthDate = value;
      console.log("update date");
      console.log(this.birthDate);
    },
    setName(value) {
      this.name = value;
    },
    setEmail(value) {
      this.email = value;
    },
    setPhone(value) {
      this.phone = value;
    },
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    },
    openEdit(dto) {
      this.id = dto.id;
      this.name = dto.name;
      this.email = dto.email;
      this.phone = dto.phone;
      this.birthDate = dto.birthDate;
      this.group = { name: dto.group.name, id: dto.group.id };
      this.show();
    },
    openCreate() {
      this.show();
    },
    show() {
      this.id = "";
      this.dialog = true;
    },
    close() {
      this.name = "";
      this.email = "";
      this.phone = "";
      this.birthDate = "";
      this.group = "";
      this.dialog = false;
    },
    save() {
      if (this.id) {
        db.collection("users")
          .doc(this.id)
          .update({
            name: this.name,
            email: this.email,
            phone: this.phone,
            birth_date: this.birthDate,
            group_id: this.group_id
          })
          .then(() => {
            this.close();
          })
          .catch(error => {
            console.error("Error updating document: ", error);
          });
      } else {
        let self = this;
        let uid = "";
        firebase
          .auth()
          .createUserWithEmailAndPassword(this.email, "temporario")
          .then(function(userRecord) {
            uid = userRecord.user.uid;
            return new Promise(function(resolve) {
              resolve(uid);
            });
          })
          .then(function(uid) {
            db.collection("users")
              .doc(uid)
              .set({
                name: self.name,
                email: self.email,
                phone: self.phone,
                birth_date: self.birthDate,
                group_id: self.group
              });
          })
          .then(() => {
            this.close();
          })
          .catch(error => {
            console.error("Error inserting document: ", error);
          });

        this.$store.dispatch("userSignUp", {
          email: this.email,
          password: "temporario"
        });
      }
      this.refreshUsersMethod();
    },
    createUser(){
      db.collection("users")
        .add({
          name: this.name,
          email: this.email,
          phone: this.phone,
          birth_date: this.birthDate,
          group_id: this.group,
        })
        .then(()=>{
          this.close();
        })
        .catch((error) => {
          console.error("Error inserting document: ", error);
        });

        this.$store.dispatch('userSignUp', { email: this.email, password: 'temporario' })
    },
    updateUser(){
      db.collection("users")
        .doc(this.id)
        .update({
          name: this.name,
          email: this.email,
          phone: this.phone,
          birth_date: this.birthDate,
          group_id: this.group.id,
        })
        .then(()=>{
          this.close();
        })
        .catch((error) => {
          console.error("Error updating document: ", error);
        });
    },
    readGroups() {
      db.collection("groups")
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            this.userGroups.push({
              name: doc.data().name,
              id: doc.id
            });
          });
        })
        .catch(error => {
          console.log("Error getting documents: ", error);
        });
    }
  },
  mounted() {
    this.readGroups();
  }
};
</script>
<style lang="stylus"></style>