<template>
  <v-card class="pa-2" raised>
    <p class="text-gray-700 font-semibold font-sans tracking-wide text-sm">{{task.name}}</p>
    <span class="text-sm text-gray-600">{{task.creation_date}}</span>
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
