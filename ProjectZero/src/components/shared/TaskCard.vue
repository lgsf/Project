<template>
  <v-card class="pa-2" raised min-height="200px">
    <v-row>
      <v-col cols="12">
        <v-tooltip bottom v-if="task.priority == 'Critica'">
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              v-bind="attrs"
              v-on="on"
              color="error"
              v-if="task.priority == 'Critica'"
            >arrow_upward</v-icon>
          </template>
          <span>{{task.priority}} prioridade</span>
        </v-tooltip>
        <v-tooltip bottom v-if="task.priority == 'Baixa'">
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              v-bind="attrs"
              v-on="on"
              color="success"
              v-if="task.priority == 'Baixa'"
            >expand_less</v-icon>
          </template>
          <span>{{task.priority}} prioridade</span>
        </v-tooltip>
        <v-tooltip bottom v-if="task.priority == 'Media'">
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              v-bind="attrs"
              v-on="on"
              color="yellow"
              v-if="task.priority == 'Media'"
            >expand_less</v-icon>
          </template>
          <span>{{task.priority}} prioridade</span>
        </v-tooltip>
        <v-tooltip bottom v-if="task.priority == 'Alta'">
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              v-bind="attrs"
              v-on="on"
              color="error"
              v-if="task.priority == 'Alta'"
            >expand_less</v-icon>
          </template>
          <span>{{task.priority}} prioridade</span>
        </v-tooltip>

        <span class="font-weight-medium">Tarefa:</span>
        <span class="font-weight-regular">{{task.name}}</span>

        <span v-if="task.estimated_duration">
          &nbsp;
          <b>({{task.estimated_duration}} horas)</b>
        </span>
      </v-col>
    </v-row>
    <v-row v-if="task.users && task.users.name">
      <v-col cols="12" class="pt-0 pb-0">
        <span class="font-weight-medium">Responsável:</span>
        {{task.users.name}}
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="!!task.started_date" cols="12" lg="6" class="text-lg-left body-2">
        <span class="font-weight-small">
          <b>Início:</b>
        </span>
        {{task.started_date}}
      </v-col>
      <v-col v-if="!!task.end_date" cols="12" lg="6" class="text-lg-right body-2">
        <span class="font-weight-small">
          <b>Fim:</b>
        </span>
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
