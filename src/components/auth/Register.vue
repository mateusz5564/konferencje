<template>
  <div class="register mt-12">
    <v-card class="register__card pa-5" max-width="600px">
      <v-card-title class="justify-center">
        <h2>Rejestracja</h2>
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="signup">
          <v-text-field type="email" label="Email" v-model="email"></v-text-field>
          <v-text-field type="password" label="Hasło" v-model="password"></v-text-field>
          <v-text-field
            @keyup="isUsernameValid"
            type="text"
            label="Nazwa użytkownika"
            v-model="username"
          ></v-text-field>
          <p class="body-1 red--text" id="unFeedback">{{ usernameFeedback }}</p>
          <p class="body-1 red--text">{{ feedback }}</p>
          <v-btn class="ma-3" type="submit" color="blue" large dark>Zarejestruj się</v-btn>
          <br />
          <br />
        </v-form>
        <hr />
        <v-btn color="blue" outlined class="ma-3 mt-10" :to="{name: 'logowanie'}">Logowanie</v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>


<script>
import db from "@/firebase/init";
import firebase from "firebase";

export default {
  data() {
    return {
      email: null,
      password: null,
      username: null,
      feedback: null,
      usernameFeedback: null
    };
  },
  methods: {
    isUsernameValid() {
      if (this.username) {
        db.collection("users")
          .where("username", "==", this.username)
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              this.usernameFeedback = "Nazwa użytkownika zajęta!";
              return true;
            });
          });
        this.usernameFeedback = "";
        return false;
      } else {
        this.usernameFeedback = "Nie podano nazwy użytkownika!";
        return true
      }
    },
    signup() {
      if (this.email && this.password && !this.isUsernameValid()) {
        firebase
          .auth()
          .createUserWithEmailAndPassword(this.email, this.password)
          .then(response => {
            db.collection("users")
              .doc(response.user.uid)
              .set({ user_id: response.user.uid, username: this.username })
              .then(() => {
                this.$router.push({ name: "home" });
              });
          })
          .catch(err => {
            this.feedback = err.message;
          });
      } else {
        this.feedback = "Wszystkie pola muszą być wypełnione"
      }
    }
  }
};
</script>

<style>
.register__card {
  margin: 0 auto;
  text-align: center;
}
</style>