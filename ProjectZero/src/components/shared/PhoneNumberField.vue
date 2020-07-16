<template>
  <v-text-field
    maxlength="14"
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
const pattern = /^\([0-9]{2}\)[0-9]{4,5}[-][0-9]{4}$/;
export default {
  props: ["label", "value", "required"],
  data: () => ({
    error: undefined
  }),
  methods: {
    getRules() {
      let rules = [
        value => !value || pattern.test(value) || "Telefone inválido."
      ];
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
      this.value = this.value.replace(/^(\d{2})$/, "($1)");

      let val = this.value.replace(
        /^([(]*)(\d{2})([)]*)(\d{4})([-]*)(\d{1,4})$/,
        "$2$4$6"
      );
      this.value = val.replace(/^(\d{2})(\d{4})(\d{1,4})$/, "($1)$2-$3");

      val = this.value.replace(
        /^([(]*)(\d{2})([)]*)(\d{4})([-]*)(\d{5})$/,
        "$2$4$6"
      );
      this.value = val.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1)$2-$3");
      this.$emit("input", this.value);
    },
    isNumber(n) {
      return !isNaN(parseFloat(n)) && !isNaN(n - 0);
    }
  }
};
</script>