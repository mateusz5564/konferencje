<template>
  <div class="login mt-12">
    <v-card class="login__card pa-5" max-width="600px">
      <v-card-title class="justify-center">
        <h2>Logowanie</h2>
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="login">
          <v-text-field label="Email" type="email" v-model="email"></v-text-field>
          <v-text-field label="Hasło" type="password" v-model="password"></v-text-field>
          <p v-if="feedback" class="red--text">{{ feedback }}</p>
          <!-- <router-link :to="{name: 'home'}">Przypomnij hasło</router-link>
          <br />
          <br /> -->
          <v-btn class="ma-3" color="blue" type="submit" large dark>Zaloguj się</v-btn>
          <br />
          <br />
          <hr />
          <v-btn color="blue" outlined class="ma-3" :to="{name: 'rejestracja'}">Załóż konto</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  data(){
    return {
      email: null,
      password: null,
      feedback: null
    }
  },
  methods: {
    login(){
      if(this.email && this.password){
        firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        .then(user => {
          console.log(user)
          this.$router.push({name: 'home'})
        })
        .catch(err => {
          this.feedback = err.message
        })
        this.feedback = null
      } else {
        this.feedback = 'Wypełnij wszystkie pola'
      }
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