<template>
  <div v-if="alertMessages.length">
    <v-alert
      class="mb-0 multi-line"
      v-for="(item, i) in alertMessages"
      :key="item.type + i"
      :type="item.type"
      dismissible
      @input="clearMessages(item.type)"
    >{{ item.message }}</v-alert>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

const computed = mapState({
  errorMessage: state => state.general.errorMessage,
  infoMessage: state => state.general.infoMessage,
  successMessage: state => state.general.successMessage,
  warningMessage: state => state.general.warningMessage,
  alertMessages: function(state) {
    let messages = [];
    if (state.general.errorMessage)
      messages.push({ type: "error", message: state.general.errorMessage });
    if (state.general.infoMessage)
      messages.push({ type: "info", message: state.general.infoMessage });
    if (state.general.successMessage)
      messages.push({ type: "success", message: state.general.successMessage });
    if (state.general.warningMessage)
      messages.push({ type: "warning", message: state.general.warningMessage });
    return messages;
  }
});

const methods = mapActions("general", [
  "setErrorMessage",
  "setInfoMessage",
  "setSuccessMessage",
  "setWarningMessage"
]);

export default {
  data() {
    return {};
  },
  computed,
  methods: Object.assign({}, methods, {
    clearMessages(type) {
      if (type == "error") this.setErrorMessage("");
      if (type == "info") this.setInfoMessage("");
      if (type == "success") this.setSuccessMessage("");
      if (type == "warning") this.setWarningMessage("");
    }
  })
};
</script>
<style scoped>
.multi-line {
  white-space: pre-line;
}
</style>