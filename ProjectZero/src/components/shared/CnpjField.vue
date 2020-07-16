<template>
  <v-text-field
    maxlength="18"
    :label="label"
    :error="error"
    :rules="getRules()"
    :value="value"
    v-on:input="$emit('input', $event)"
    v-on:keydown="keyDownEvents"
    v-on:keyup="keyUpEvents"
  ></v-text-field>
</template>

<script>
const pattern = /^[0-9]{2}[.][0-9]{3}[.][0-9]{3}[/]0001[-][0-9]{2}$/;
export default {
  props: ["label", "value", "required"],
  data: () => ({
    error: undefined
  }),
  methods: {
    getRules() {
      let rules = [value => !value || pattern.test(value) || "CNPJ inválido."];
      if (this.required)
        rules.push(value => !!value || `O campo ${this.label} é obrigatório.`);
      return rules;
    },
    keyDownEvents(e) {
      if (e.ctrlKey || e.code == "Backspace") {
        return;
      }
      if (!this.isNumber(e.key)) {
        e.preventDefault();
      }
    },
    keyUpEvents() {
      let val = this.value.replace(/^(\d{2})$/, "$1.");

      val = val.replace(/^(\d{2})([.]*)(\d{1,3})$/, "$1.$3");

      val = val.replace(/^(\d{2})([.]*)(\d{3})([.]*)(\d{1,3})$/, "$1.$3.$5");

      val = val.replace(
        /^(\d{2})([.]*)(\d{3})([.]*)(\d{3})([/]*)(\d{1,4})$/,
        "$1.$3.$5/$7"
      );

      val = val.replace(
        /^(\d{2})([.]*)(\d{3})([.]*)(\d{3})([/]*)(\d{4})([-]*)(\d{1,2})$/,
        "$1.$3.$5/$7-$9"
      );
      this.value = val;
      this.$emit("input", this.value);
    },
    isNumber(n) {
      return !isNaN(parseFloat(n)) && !isNaN(n - 0);
    }
  }
};
</script>