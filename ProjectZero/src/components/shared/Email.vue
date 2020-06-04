<template>
  <v-text-field
    :label="label"
    :error="error"
    :rules="rules"
    :value="value"
    v-on:input="$emit('input', $event)"
  ></v-text-field>
</template>

<script>
const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export default {
  props: ["label", "value"],
  data: () => ({
    error: undefined,
    rules: [
      value => {
        return !value || pattern.test(value) || "E-mail inválido.";
      }
    ]
  }),
  methods: {
    isValid() {
      return !this.value || pattern.test(this.value);
    }
  }
};
</script>