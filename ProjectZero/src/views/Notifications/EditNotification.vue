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
                <v-text-field label="Título*" :value="title" @input="editTitle" required></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Autor*" :value="name" @input="editName" required></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Detalhes*" :value="detail" @input="editDetail" required></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-autocomplete
                  v-model="editingUser"
                  :items="users"
                  color="primary"
                  item-text="name"
                  label="Definir usuários para receber a mensagem"
                  return-object
                  dense
                  multiple
                  @input="editUser"
                ></v-autocomplete>
              </v-col>
              </v-row>
              <v-row>
              <v-col cols="12">
                <v-autocomplete
                  v-model="editingGroup"
                  :items="groups"
                  color="primary"
                  item-text="name"
                  label="Definir grupos para receber a mensagem"
                  return-object
                  dense
                  multiple
                  @input="editGroup"
                ></v-autocomplete>
              </v-col>
              </v-row>
             <v-row>
              <v-col cols="12">
                <DatePicker
                  dateLabel="Data"
                  :value="date"
                  v-on:update="editDate"
                  ref="DatePicker"
                />
              </v-col>
            </v-row>
          </v-container>
          <small>*Obrigatório</small>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="error" v-if="selected.length > 0" text @click="deleteNotification">Deletar</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="editNotification(false)">Fechar</v-btn>
          <v-btn color="blue darken-1" text @click="saveNotification">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import { mapState, mapActions } from "vuex"
import DatePicker from "@/components/shared/DatePicker"

const computed = mapState("notifications", {
  selected: state => state.selected || [],
  title: state => state.editingTitle,
  dialog: state => state.editNotification,
  name: state => state.editingName,
  detail: state => state.editingDetail,
  date: state => state.editingDate,
})

const computedUsers = mapState("users", {
users: state => state.userList,
groups: state => state.userGroups
}
)

const userMethods = mapActions("users", [
  "readGroups",
  "readUsers"
  ])

const methods = mapActions("notifications", [
  "editTitle",
  "editName",
  "editDetail",
  "editDate",
  "editUser",
  "editGroup",
  "editNotification",
  "saveNotification",
  "deleteNotification"
])

export default {
  components: {DatePicker},
  data() {
    return {}
  },
  computed: Object.assign({}, computed, computedUsers) ,
  methods: Object.assign({}, methods, userMethods),
  mounted(){
    this.readUsers()
  }

  
};
</script>
<style lang="stylus"></style>