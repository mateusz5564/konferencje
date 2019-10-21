<template>
  <div class="login mt-12">
    <v-snackbar v-model="snackbar" :color="color" top :timeout="timeout">
      <div>
        <v-icon class="mr-2">{{icon}}</v-icon>
        {{ text }}
      </div>
      <v-btn text @click="snackbar = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>

    <v-card class="login__card pa-5" max-width="600px">
      <v-card-title class="justify-center">
        <h2>Logowanie</h2>
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="login">
          <v-text-field label="Email" type="email" v-model="email"></v-text-field>
          <v-text-field label="Hasło" type="password" v-model="password"></v-text-field>
          <p class="text-left font-weight-medium">
            <a @click.stop="dialog = true">Przypomnij hasło</a>
          </p>
          <p v-if="feedback" class="red--text">{{ feedback }}</p>
          <v-btn class="ma-3" color="blue" type="submit" large dark>Zaloguj się</v-btn>
          <br />

          <br />
          <hr />
          <v-btn color="blue" outlined class="ma-3 mt-10" :to="{name: 'rejestracja'}">Załóż konto</v-btn>
        </v-form>
      </v-card-text>
    </v-card>

    <v-dialog v-model="dialog" max-width="500px">
      <ResetPassword @resetPasswordSent="setSnackbar" />
    </v-dialog>
  </div>
</template>

<script>
import firebase from "firebase";
import ResetPassword from "@/components/ResetPassword";

export default {
  components: {
    ResetPassword
  },
  data() {
    return {
      email: null,
      password: null,
      feedback: null,
      dialog: false,
      snackbar: false,
      color: '',
      icon: '',
      text: '',
      timeout: 5000
    };
  },
  methods: {
    login() {
      if (this.email && this.password) {
        firebase
          .auth()
          .signInWithEmailAndPassword(this.email, this.password)
          .then(user => {
            console.log(user);
            this.$router.push({ name: "home" });
          })
          .catch(err => {
            this.feedback = err.message;
          });
        this.feedback = null;
      } else {
        this.feedback = "Wypełnij wszystkie pola";
      }
    },
    setSnackbar(){
      this.dialog = false
      this.color = "success"
      this.icon = "mdi-check-circle"
      this.text = "Pomyślnie wysłano wiadomość!"
      this.snackbar = true
    }
  }
};
</script>

<style>
/* .login{
        margin-top: 
    } */
.login__card {
  margin: 0 auto;
  text-align: center;
}
</style>