<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    :return-value.sync="date"
    transition="scale-transition"
    offset-y
    min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        prepend-icon="event"
        v-model="dateFormatted"
        :label="dateLabel"
        readonly
        v-on="on"
        :disabled="disable"
      ></v-text-field>
    </template>
    <v-date-picker :disabled="disable" v-model="date" no-title scrollable locale="pt-br">
      <v-spacer></v-spacer>
      <v-btn :disabled="disable" text color="primary" @click="menu = false">Cancelar</v-btn>
      <v-btn :disabled="disable" text color="primary" @click="updateValue(date)">OK</v-btn>
    </v-date-picker>
  </v-menu>
</template>

<script>
const moment = require("moment");

export default {
  props: ["dateLabel", "disable", "value"],
  computed: {
    dateFormatted() {
      if (!this.value && !this.dateInputText) return "";
      if (!this.value) return this.dateInputText;
      let momentObj = this.value;
      if (!(momentObj instanceof moment)) {
        if (typeof momentObj == "string")
          momentObj = moment(momentObj, "DD/MM/YYYY");
        if (typeof momentObj == "number") momentObj = moment.unix(momentObj);
      }
      return momentObj.format("DD/MM/YYYY");
    }
  },
  data: () => ({
    date: new Date().toISOString().substr(0, 10),
    dateInputText: "",
    menu: false
  }),
  methods: {
    updateValue(value) {
      this.$refs.menu.save(value);
      this.dateInputText = this.formatDate(value);
      this.$emit("update", this.dateInputText);
      this.$emit("input", moment(this.dateInputText, "DD/MM/YYYY"));
    },
    formatDate(date) {
      if (!date) return null;
      var regex = RegExp("[0-9]{2}/[0-9]{2}/[0-9]{4}");
      if (regex.test(date)) return date;
      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    }
  }
};
</script>