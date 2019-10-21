<template>
  <div class="reset-password">
    <v-card class="login__card pa-5" max-width="500px">
      <v-card-title class="justify-center">
        <h2>Zresetuj hasło</h2>
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="reset">
          <p class="mt-3 pl-10 pr-10 font-weight-bold">Aby zresetować hasło, podaj adres email swojego konta, zostanie na niego wysłany link resetujący hasło</p>
          <v-text-field label="Email" type="email" v-model="email"></v-text-field>
          <p v-if="feedback" class="red--text">{{ feedback }}</p>
          <v-btn class="ma-3" color="blue" type="submit" large dark>Wyślij</v-btn>
        </v-form>
      </v-card-text>
    </v-card>

    <v-snackbar
      v-model="snackbar"
        :color="color"
        top
        timeout="5000"
        absolute
    >
    <div>
      <v-icon class="mr-2">{{icon}}</v-icon>
      {{ text }}
    </div>
      <v-btn
        text
        @click="snackbar = false"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>

  </div>
</template>

<script>
export default {
  data() {
    return {
      snackbar: false,
      color: 'success',
      icon: 'mdi-check-circle',
      text: 'Wysłano link resetujący'
    }
  },
  methods: {
    reset(){
      this.snackbar = true
      this.icon = "mdi-alert-circle"
      this.color = "error"
      this.text = "Nie udało się wysłać linku"
    }
  }
}
</script>

<style>

</style>