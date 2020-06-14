<template>
  <v-card class="pa-2" raised>
    <div>
      <span class="font-weight-medium">Tarefa:</span>
      <span class="font-weight-regular">{{task.name}}</span>
    </div>
    <v-row>
      <v-col  v-if="!!task.started_date" cols="6 text-sm-left body-2">
        <span class="font-weight-medium">Iníciada em</span>
        {{task.started_date}}
      </v-col>
      <v-col v-if="!!task.end_date" cols="6 text-sm-right body-2">
        <span class="font-weight-medium">Fim:</span>
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
