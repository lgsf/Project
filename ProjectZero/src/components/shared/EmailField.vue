<template>
  <v-text-field
    :label="label"
    :error="error"
    :rules="getRules()"
    :value="value"
    v-on:input="$emit('input', $event)"
  ></v-text-field>
</template>

<script>
const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export default {
  props: ["label", "value", "required"],
  data: () => ({
    error: undefined
  }),
  methods: {
    getRules() {
      let rules = [
        value => !value || pattern.test(value) || "E-mail inválido."
      ];
      if (this.required)
        rules.push(value => !!value || `O campo ${this.label} é obrigatório.`);
      return rules;
    }
  }
};
</script>