<template>
  <v-footer
    color="grey-3"
    padless
  >
    <v-row
      justify="center"
      no-gutters
    >
      <v-btn
        v-for="link in links"
        :key="link"
        color="grey--text"
        text
        rounded
        class="my-2"
      >
        {{ link }}
      </v-btn>
      <v-col
        class="grey-3 py-4 text-center"
        cols="12"
      >
      &copy;
        {{ new Date().getFullYear() }}.  Todos os direitos reservados — <strong>Project Zero</strong>

      </v-col>
    </v-row>
  </v-footer>
</template>

<script>
  export default {
    data: () => ({
      links: [
        'Home',
        'Services',
        'Contact Us',
      ],
    }),
  }
</script>