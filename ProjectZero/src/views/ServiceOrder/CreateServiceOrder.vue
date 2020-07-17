<template>
  <v-row justify="center">
    <v-dialog :value="dialog" persistent max-width="800px" @click:outside="closeCreateOrderModal">
      <v-card>
        <v-toolbar class="primary" dark>
          <v-toolbar-title>Criar nova ordem de serviço</v-toolbar-title>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <v-form v-model="valid">
            <v-row>
              <v-col cols="12" style="padding-bottom: 0px">
                <v-text-field label="Nome: " 
                 v-model="newOrder.name"
                 required
                 :rules="nameRules"
                 >
                 </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-autocomplete
                  v-model="newOrder.template"
                  :items="orderTemplates"
                  color="primary"
                  item-text="name"
                  label="Criar a partir de um template?"
                  return-object
                  dense
                  single
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                  <v-autocomplete
                    v-model="newOrder.client"
                    :items="clientList"
                    color="primary"
                    item-text="name"
                    label="Cliente"
                    return-object
                    dense
                    required
                    :rules="clientRules"
                  ></v-autocomplete>
                </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="no-top-bottom-padding">
                <v-row>
                  <v-col cols="12" md="4" lg="4" xl="4" sm="12" class="no-top-bottom-padding">
                    <DatePicker
                      dateLabel="Data de criação:"
                      :value="newOrder.creation_date"
                      ref="DatePicker"
                      :disable="true"
                    />
                  </v-col>
                  <v-col cols="12" md="4" lg="4" xl="4" sm="12" class="no-top-bottom-padding">
                    <DatePicker
                      dateLabel="Data de Início:"
                      :value="newOrder.start_date"
                      ref="DatePicker"
                      v-on:update="updateNewOrderStartDate"
                    />
                  </v-col>
                  <v-col cols="12" md="4" lg="4" xl="4" sm="12" class="no-top-bottom-padding">
                    <DatePicker
                     dateLabel="Data de encerramento:"
                     :value="newOrder.end_date"
                     ref="DatePicker"
                     v-on:update="updateNewOrderEndDate"
                    />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-autocomplete
                  v-model="newOrder.administrator"
                  :items="users"
                  color="primary"
                  item-text="name"
                  label="Administrador"
                  return-object
                  dense
                  single
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-autocomplete
                  v-model="newOrder.users"
                  :items="users"
                  color="primary"
                  item-text="name"
                  label="Definir time por usuário"
                  return-object
                  dense
                  multiple
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-autocomplete
                  v-model="newOrder.userGroups"
                  :items="userGroups"
                  color="primary"
                  item-text="name"
                  label="Definir time por grupo de usuário"
                  return-object
                  dense
                  multiple
                ></v-autocomplete>
              </v-col>
            </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeCreateOrderModal">Fechar</v-btn>
          <v-btn color="blue darken-1" :disabled="!valid" text @click="saveNewOrder">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapState, mapActions } from "vuex"
import DatePicker from "@/components/shared/DatePicker"

const computed = mapState({
    dialog: state => state.serviceOrders.showCreateOrderDialog,
    newOrder: state => state.serviceOrders.newOrder,
    users: state => state.users.userList,
    userGroups: state => state.users.userGroups,
    orderTemplates: state => state.erp.erpOrders,
    clientList: state => state.clients.activeClients
})

const userMethods = mapActions("users", ["readUsers"])

const methods = mapActions("serviceOrders", [
  "closeCreateOrderModal",
  "saveNewOrder",
  "updateNewOrderStartDate",
  "updateNewOrderEndDate"
])

const erpMethods = mapActions("erp", [
  "loadErpOrders"
])

const clientsMethods = mapActions("clients", [
  "loadClients"
])

export default {
    components: {
      DatePicker
    },
    data() {
        return { 
          valid: false,
          nameRules: [
            v => !!v || 'É obrigatório selecionar um nome para a ordem'
          ],
          clientRules: [
            v => !!v || 'É obrigatório selecionar um cliente para a ordem'
          ],
         }
    },
    methods:  Object.assign({}, methods, userMethods, erpMethods, clientsMethods),
    computed,
    mounted() {
      this.readUsers()
      this.loadErpOrders()
      this.loadClients()
    }
}
</script>