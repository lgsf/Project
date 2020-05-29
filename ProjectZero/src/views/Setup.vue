<template> 
  <v-card class="col-6" justify="center">
    <v-toolbar
        flat
        color="primary"
        dark
    >
    <v-toolbar-title>{{screenTitle}}</v-toolbar-title></v-toolbar>
    <v-card-text>
      <v-row>
        <v-col class="col-6">
          <v-select 
              :items="options" 
              :label="themeSelectLabel" 
              :v-model="selectedTheme" 
              item-text="description"
              item-value="code"
            ></v-select>
        </v-col>
        <v-col class="col-6" align-self="center">
          <v-tooltip right>
              <template #activator="{ on }">
                <v-icon color="blue-grey" dark v-on="on">help</v-icon>
              </template>
              <span>Escolha uma cor para servir de tema para o sistema.</span>
            </v-tooltip>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="col-6">
          <v-text-field
            v-model="companyName"
            :label="companyNameLabel"
          />
        </v-col>
        <v-col class="col-6" align-self="center">
          <v-tooltip right>
              <template #activator="{ on }">
                <v-icon color="blue-grey" dark v-on="on">help</v-icon>
              </template>
              <span>Escolha a razão social para a empresa, que será exibida no portal de login.</span>
            </v-tooltip>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="col-6">
          <v-text-field
            v-model="companyContact"
            :label="companyContactLabel"
          />
        </v-col>
                <v-col class="col-6" align-self="center">
          <v-tooltip right>
              <template #activator="{ on }">
                <v-icon color="blue-grey" dark v-on="on">help</v-icon>
              </template>
              <span>Escolha o contato da empresa, que será exibida no portal de login.</span>
            </v-tooltip>
        </v-col>
      </v-row>
      <v-btn
        color="success"
        depressed
      > Save</v-btn>
    </v-card-text>
    
  </v-card> 
</template> 

<script> 
  export default { 
    data: () => ({ 
      screenTitle: 'Configurações',
      themeSelectLabel: 'Tema',
      options: [
        { code: 1, description: 'Gray'}, 
        { code: 2, description: 'DarkBlue'}, 
        { code: 3, description: 'Orange'},
        ], 
      selectedTheme: { code: 1, description: 'Gray'},
      companyNameLabel: 'Razão social',
      companyName: '',
      companyContactLabel: 'Contato',
      companyContact: ''
    }), 
  } 
</script>