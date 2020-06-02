<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-toolbar class="primary" dark>
          <v-toolbar-title>Adicionar notificação</v-toolbar-title>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Título*" v-model="title" @change="setTitle" required></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Nome" v-model="name"  @change="setName"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Detalhes" v-model="detail" @change="setDetail"></v-text-field>
              </v-col>
            </v-row>
                        <v-row>
              <v-col cols="12">
                <v-text-field label="Data" v-model="date" @change="formatDate"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <small>*Obrigatório</small>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn  color="blue darken-1" text @click="deleteNotification">Apagar</v-btn>
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
  props: ['refreshNotificationsMethod'],
  data() {
    return {
      dialog: false,
      menu1: false,
      title: '',
      name: '',
      detail: '',
      date:'',

    };
  },
  methods: {

    setTitle(value){
      this.title = value
    },
    setName(value){
      this.name = value
    },
    setDetail(value){
      this.detail = value
    },
    formatDate (date) {
        if (!date) return null

        const [year, month, day] = date.split('-')
        return `${month}/${day}/${year}`
      },
    openEdit(dto){
      this.id = dto.id
      this.title = dto.title
      this.name = dto.name
      this.detail = dto.detail
      this.date = dto.date
      this.show()
    },
    openCreate(){
      this.show()
    },
    show() {
      this.dialog = true
    },
    close() {
      this.title = ''
      this.name = ''
      this.detail =''
      this.date= ''
      this.dialog = false
    },
    save(){
      if(this.id){
        db.collection("notifications")
                .doc(this.id)
                .update({
                  title: this.title,
                  name: this.name,
                  detail: this.detail,
                  date: this.date
                })
                .then(()=>{
                  this.close()
                })
                .catch((error) => {
                  console.error("Error updating document: ", error)
                });
      }
      else{
        db.collection("notifications")
                .add({
                  title: this.title,
                  name: this.name,
                  detail: this.detail,
                  date: this.date
                })
                .then(()=>{
                  this.close()
                })
                .catch((error) => {
                  console.error("Error inserting document: ", error)
                });
      }
      this.refreshNotificationsMethod();
    },
    deleteNotification(){
        if(this.id){
        db.collection("notifications")
                .doc(this.id)
                .delete()
                .then(()=>{
                  this.close();
                })
                .catch((error) => {
                  console.error("Error deleting: ", error)
                });
        }
        this.refreshNotificationsMethod()
    }
  }

  }

</script>
<style lang="stylus"></style>