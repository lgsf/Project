<template>
  <v-card class="pa-2" raised height="150px">
    <div>
      <v-tooltip bottom v-if="task.priority == 'Critica'">
        <template v-slot:activator="{ on, attrs }">
          <v-icon v-bind="attrs" v-on="on" color="error" v-if="task.priority == 'Critica'">arrow_upward</v-icon>
        </template>
        <span>{{task.priority}} prioridade</span>
      </v-tooltip>
      <v-tooltip bottom v-if="task.priority == 'Baixa'">
        <template v-slot:activator="{ on, attrs }">
          <v-icon v-bind="attrs" v-on="on" color="success" v-if="task.priority == 'Baixa'">expand_less</v-icon>
        </template>
        <span>{{task.priority}} prioridade</span>
      </v-tooltip>
      <v-tooltip bottom v-if="task.priority == 'Media'">
        <template v-slot:activator="{ on, attrs }">
          <v-icon v-bind="attrs" v-on="on" color="yellow" v-if="task.priority == 'Media'">expand_less</v-icon>
        </template>
        <span>{{task.priority}} prioridade</span>
      </v-tooltip>
      <v-tooltip bottom v-if="task.priority == 'Alta'">
        <template v-slot:activator="{ on, attrs }">
          <v-icon v-bind="attrs" v-on="on" color="error" v-if="task.priority == 'Alta'">expand_less</v-icon>
        </template>
        <span>{{task.priority}} prioridade</span>
      </v-tooltip>
      <span class="font-weight-medium">Tarefa: </span>
      <span class="font-weight-regular">{{task.name}}</span>
    </div>
    <v-row v-if="task.users && task.users.name" style="padding-bottom: 0px; padding-top: 0px">
      <v-col style="padding-bottom: 0px; padding-top: 0px">
        <span class="font-weight-medium">Responsável: </span>
          {{task.users.name}}
      </v-col>
    </v-row>
    <v-row>
      <v-col  v-if="!!task.started_date" cols="6 text-sm-left body-2">
        <span class="font-weight-small">Início: </span>
        {{task.started_date}}
      </v-col>
      <v-col v-if="!!task.end_date" cols="6 text-sm-right body-2">
        <span class="font-weight-small">Fim: </span>
        {{task.end_date}}
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
export default {
  props: {
    task: {
      type: Object,
      default: () => ({})
    }
  }
};
</script>
