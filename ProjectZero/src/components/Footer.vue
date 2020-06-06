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
        :href="link.href"
        text
        rounded
        target="_blank"
        class="my-2"
      >
        {{ link.name }}
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
        {name:'Home', href: 'https://project42-saas.web.app/#/'},
        {name: 'Sobre', href: 'https://project42-saas.web.app/#/about'},
        {name:'Entre em contato', href: 'https://project42-saas.web.app/#/contact'}
      ]
    }),
  }
</script>