<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="lg-6">
        <v-card class="mx-auto">
          <v-toolbar color="primary" dark>
            <v-toolbar-title>
              {{ screenTitle }}
            </v-toolbar-title>
          </v-toolbar>
          <v-card-title>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              :label="searchLabel"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-row>
            <v-col cols="12">
              <v-data-table
                :headers="headers"
                :items="desserts"
                :search="search"
                show-select
                single-select
                item-key="name"
                v-model="selected"
              ></v-data-table>
            </v-col>
          </v-row>
          <v-btn color="red" dark fixed bottom right fab>
            <v-icon v-show="selected.length == 0" @click="editGroup">mdi-plus</v-icon>
            <v-icon v-show="selected.length == 1" @click="editGroup">mdi-pen</v-icon>
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      search: '',
      screenTitle: 'Usuários',
      searchLabel: "Buscar",
      selected: [],
      headers: [
        {
          text: "Nome",
          align: "start",
          value: "name"
        }
      ],
      desserts: [
        {
          name: "Admin"
        },
        {
          name: "Operador"
        }
      ]
    };    
  },
  methods: {
  },
  mounted() {
  },
};
</script>