<template>
  <div>
    <v-alert
      class="mb-0"
      v-if="errorMessage"
      type="error"
      dismissible
      v-model="errorMessage"
      @input="setErrorMessage('')"
    >{{ errorMessage }}</v-alert>
    <v-alert
      class="mb-0"
      v-if="infoMessage"
      type="info"
      dismissible
      v-model="infoMessage"
      @input="setInfoMessage('')"
    >{{ infoMessage }}</v-alert>
    <v-alert
      class="mb-0"
      v-if="successMessage"
      type="success"
      dismissible
      v-model="successMessage"
      @input="setSuccessMessage('')"
    >{{ successMessage }}</v-alert>
    <v-alert
      class="mb-0"
      v-if="warningMessage"
      type="warning"
      dismissible
      v-model="warningMessage"
      @input="setWarningMessage('')"
    >{{ warningMessage }}</v-alert>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex"

const computed = mapState({
  errorMessage: state => state.general.errorMessage,
  infoMessage: state => state.general.infoMessage,
  successMessage: state => state.general.successMessage,
  warningMessage: state => state.general.warningMessage
})

const methods = mapActions("general", [
  "setErrorMessage",
  "setInfoMessage",
  "setSuccessMessage",
  "setWarningMessage"
])

export default {
  data() {
    return {
      alertError: true,
      alertInfo: true,
      alertSuccess: true,
      alertWarning: true
    };
  },
  computed,
  methods
};
</script>