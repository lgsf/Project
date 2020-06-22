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
  export default {
    props: ["dateLabel", "disable"],
    data: () => ({
      date: new Date().toISOString().substr(0, 10),
      dateFormatted: '',
      menu: false,
      modal: false,
      menu2: false,
    }),
    methods: {
        updateValue(value){
            this.$refs.menu.save(value)
            this.dateFormatted = this.formatDate(value)
            this.$emit('update', this.dateFormatted)
        },
        formatDate (date) {
            if (!date) return null  
            const [year, month, day] = date.split('-')
            return `${day}/${month}/${year}`
        }
    }
  }
</script>