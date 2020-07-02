<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent scrollable max-width="600px" @click:outside="editGroup(false)">
      <v-card>
        <v-toolbar class="primary" dark>
          <v-toolbar-title>Grupo</v-toolbar-title>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Grupo*" v-model="selected.name" :rules="[rules.required]"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <Email label="Email" v-model="selected.email" ref="EmalCmp"></Email>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <h3 class="primary--text">Permissões</h3>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-treeview
                  :items="items"
                  :value="selection"
                  @input="setSelectedMenuItems"
                  dense
                  selectable
                  open-on-click
                  selected-color="accent"
                  color="primary"
                ></v-treeview>
              </v-col>
            </v-row>
          </v-container>
          <small>*Obrigatório</small>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="editGroup(false)">Fechar</v-btn>
          <v-btn color="blue darken-1" text @click="saveGroup">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import { mapState, mapActions } from "vuex"
import Email from "@/components/shared/Email"

const computed = mapState("groups", {
  selected: state => state.selected,
  items: state => state.menuItems,
  selection: state => state.selectedMenuItems,
  dialog: state => state.editGroup
})

const methods = mapActions("groups", [
  "loadMenuOptions",
  "editGroup",
  "saveGroup",
  "setSelectedMenuItems"
])

export default {
  components: { Email },
  computed,
  data() {
    return {
      rules: {
        required: value => !!value || "Campo obrigatório."
      }
    }
  },
  methods,
  mounted() {
    this.loadMenuOptions()
  }
}
</script>
<style lang="stylus"></style>