<template>
  <v-form v-model="isNotValid">
    <v-row justify="center">
      <v-dialog
        v-model="dialog"
        persistent
        scrollable
        max-width="600px"
        @click:outside="editGroup(false)"
      >
        <v-card>
          <v-toolbar class="primary" dark>
            <v-toolbar-title>Grupo</v-toolbar-title>
          </v-toolbar>
          <v-divider></v-divider>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field label="Grupo*" :value="name" @input="setName" :rules="[rules.required]"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <email-field label="Email" :value="email" @input="setEmail" ></email-field>
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
            <v-btn color="blue darken-1" text @click="clean">Limpar</v-btn>
            <v-btn color="blue darken-1" text @click="editGroup(false)">Fechar</v-btn>
            <v-btn color="blue darken-1" :disabled="!isNotValid" text @click="saveGroup">Salvar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-form>
</template>
<script>
import { mapState, mapActions } from "vuex"
import EmailField from "@/components/shared/EmailField"

const computed = mapState("groups", {
  selected: state => state.selected,
  name: state => state.groupName,
  email: state => state.groupEmail,
  items: state => state.menuItems,
  selection: state => state.selectedMenuItems,
  dialog: state => state.editGroup
})

const methods = mapActions("groups", [
  "loadMenuOptions",
  "editGroup",
  "saveGroup",
  "setName",
  "setEmail",
  "clean",
  "setSelectedMenuItems"
])

export default {
  components: { EmailField },
  computed,
  data() {
    return {
      isNotValid: false,
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