<template>
  <v-card class="pa-2" raised height="150px">
    <div>
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
