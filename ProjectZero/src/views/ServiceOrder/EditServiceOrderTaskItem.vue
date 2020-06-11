<template>
  <v-row justify="center">
    <v-dialog :value="dialog" persistent max-width="300px">
      <v-card>
        <v-toolbar class="primary" dark>
          <v-toolbar-title>Descrição</v-toolbar-title>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field :label="selectedTaskItem.description" :value="selectedTaskItem.description" @input="updateSelectedTaskItemDescription"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeEditTaskItemModal">Fechar</v-btn>
          <v-btn color="blue darken-1" text @click="saveTaskItem">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapState, mapActions } from "vuex";

const computed = mapState("productionOrders", {
    selectedTaskItem: state => state.selectedTaskItem,
    dialog: state => state.showTaskItemDialog
});

const methods = mapActions("productionOrders", [
  "updateSelectedTaskItem",
  "closeEditTaskItemModal",
  "saveTaskItem",
  "updateSelectedTaskItemDescription"
]);

export default {
    data() {
        return { }
    },
    methods,
    computed
}
</script>

<style>
</style>