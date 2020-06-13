<template>
  <v-row justify="center">
    <v-dialog :value="dialog" persistent max-width="800px">
      <v-card>
        <v-toolbar class="primary" dark>
          <v-toolbar-title>Criar nova ordem de serviço</v-toolbar-title>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" style="padding-bottom: 0px">
                <v-text-field label="Nome: " v-model="newOrder.name"></v-text-field>
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
                  ></v-autocomplete>
                </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="no-top-bottom-padding">
                <v-row>
                  <v-col cols="5" class="no-top-bottom-padding">
                    <v-text-field label="Data de criação:" disabled v-model="newOrder.creation_date"></v-text-field>
                  </v-col>
                  <v-col cols="5" class="no-top-bottom-padding">
                    <v-text-field label="Data de encerramento:" v-model="newOrder.end_date"></v-text-field>
                  </v-col>
                </v-row>
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
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeCreateOrderModal">Fechar</v-btn>
          <v-btn color="blue darken-1" text @click="saveNewOrder">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapState, mapActions } from "vuex";

const computed = mapState({
    dialog: state => state.serviceOrders.showCreateOrderDialog,
    newOrder: state => state.serviceOrders.newOrder,
    users: state => state.users.userList,
    userGroups: state => state.users.userGroups,
    orderTemplates: state => state.erp.erpOrders,
    clientList: state => state.clients.clients
});

const userMethods = mapActions("users", ["readUsers"]);

const methods = mapActions("serviceOrders", [
  "closeCreateOrderModal",
  "saveNewOrder"
]);

const erpMethods = mapActions("erp", [
  "loadErpOrders"
]);

const clientsMethods = mapActions("clients", [
  "loadClients"
]);

export default {
    data() {
        return { }
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

<style>

</style>