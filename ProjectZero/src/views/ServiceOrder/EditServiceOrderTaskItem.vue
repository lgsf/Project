<template>
  <v-row justify="center">
    <v-dialog :value="dialog" persistent max-width="600px">
      <v-text-field label="Descrição: " :value="description" @input="updateTaskName"></v-text-field>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapState, mapActions } from "vuex";

const computed = mapState("productionOrders", {
    selectedTask: state => state.selectedTask
});

const methods = mapActions("productionOrders", [
  "updateTaskItemDescription"
]);

export default {
    data() {
        return { }
    },
    methods,
    computed
}
</script>

<style>
</style>