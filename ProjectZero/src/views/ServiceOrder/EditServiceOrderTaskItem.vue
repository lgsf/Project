<template>
  <v-row justify="center">
    <v-dialog :value="dialog" persistent max-width="100px">
      <v-text-field label="Descrição: " :value="selectedTaskItem.description" @input="updateSelectedTaskItem"></v-text-field>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapState, mapActions } from "vuex";

const computed = mapState("productionOrders", {
    selectedTaskItem: state => state.selectedTaskItem
});

const methods = mapActions("productionOrders", [
  "updateSelectedTaskItem"
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