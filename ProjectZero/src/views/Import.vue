<template>
<div class="import">
    <v-row style="min-width:70vw;">
      <v-col>
        <div class="text-center screen-margin-top" v-if="isLoading">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
        <v-card v-if="!isLoading">
        <v-toolbar class="primary white--text" >
          <h3>
            {{ screenTitle }}
          </h3>
          <v-spacer></v-spacer>
        <v-icon right class="white--text">import_export</v-icon>
        </v-toolbar>
        <Alert class="mt-2 ml-1 mr-1" />
            
              <v-row>
                <v-col class='ms-6 me-6'>
                 <div>
                <v-radio-group v-model="picked" label="O que deseja importar:" row>
                  <v-radio label="Clientes" value="clients" @change="check()"></v-radio>
                  <v-radio label="Usuários" value="users" @change="check()"></v-radio>
                </v-radio-group>
              </div>
                </v-col>
              </v-row>
        </v-card>
        </v-col>
    </v-row>
  </div>
</template>
<script>
import Alert from "@/components/shared/Alert"
import {  mapState  } from "vuex"

const computedGeneral = mapState("general", {
    isLoading: state => state.isLoading
})

export default {
  components: { Alert },
  name: "Importação",
  data() {
    return {
      screenTitle: 'Importações',
      picked: '',
    } 
  },
  
  methods: Object.assign({}, {
    uploadLogoButtonClick(){
        this.$refs.uploadLogo.click()
      },
      check(){
          console.log(this.picked)
      }
  }),

  computed: Object.assign({}, computedGeneral),
    mounted(){
        this.check()
    }
}
</script>