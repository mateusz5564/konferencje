<template>
  <div class="reset-password">
    <v-card class="login__card pa-5" max-width="500px">
      <v-card-title class="justify-center">
        <h2>Zresetuj hasło</h2>
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="reset">
          <p class="mt-3 pl-10 pr-10 font-weight-bold">Aby zresetować hasło, podaj adres email swojego konta, zostanie na niego wysłany link resetujący hasło</p>
          <v-text-field label="Email" type="email" required v-model="email"></v-text-field>
          <!-- <p v-if="feedback" class="red--text text-left">{{ feedback }}</p> -->
          <v-btn class="ma-3" color="blue" type="submit" large dark>Wyślij</v-btn>
        </v-form>
      </v-card-text>
    </v-card>

    <v-snackbar
      v-model="snackbar"
        :color="color"
        top
        :timeout=timeout
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
import firebase from 'firebase'

export default {
  data() {
    return {
      email: null,
      snackbar: false,
      color: '',
      icon: '',
      text: '',
      timeout: 5000
    }
  },
  methods: {
    reset(){
      const auth = firebase.auth()
      if(this.email){
        this.feedback = ''
        auth.sendPasswordResetEmail(this.email).then(() => {
          this.email = ''
          this.$emit('resetPasswordSent')
        }).catch(err => {
          console.log(err)
          this.color = "error"
          this.icon = "mdi-alert-circle"
          this.text = "Błąd! Nie udało się wysłać wiadomości"
          this.snackbar = true
          switch(err.message){
            case "There is no user record corresponding to this identifier. The user may have been deleted.": 
              this.text = "Konto o podanym adresie nie istnieje!"
              break;
            case "The email address is badly formatted.":
              this.text = "Nie poprawny adres email!"
              break;
          }
        })
      } else {
        this.color = "error"
        this.icon = "mdi-alert-circle"
        this.text = "Podaj adres email!"
        this.snackbar = true
      }
    }
  }
}
</script>

<style>

</style>