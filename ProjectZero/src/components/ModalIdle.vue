<template>
  <v-row justify="center">
    <v-dialog v-model="isIdle" persistent max-width="600px">
      <v-card>
        <v-toolbar class="primary" dark>
          <v-toolbar-title>Inatividade</v-toolbar-title>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                 <div class="p-3">
                    <p>Você deixou o browser inativo por 20 minutos.</p>
                    <p>Você será automaticamente deslogado após {{ time/1000 }} segundos</p>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapActions  } from "vuex"

export default {
	data() {
		return {
			time: 10000
		}
    },
     methods: {
    logout() {
      this.userSignOut
        }
     },
     computed: {
      ...mapActions("auth", ["userSignOut"]),
    isIdle(){
      return this.$store.state.idleVue.isIdle;
    }
  },
	created() {
    let timerId = setInterval(() => {
      this.time -= 1000;
      if (!this.$store.state.idleVue.isIdle) clearInterval(timerId)

      if (this.time < 1) {
        clearInterval(timerId)
        this.logout()
      }
    }, 1000)
  }
};
</script>