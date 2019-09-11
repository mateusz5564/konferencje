<template>
  <div class="login mt-12">
    <v-card class="login__card pa-5" max-width="600px">
      <v-card-title class="justify-center">
        <h2>Logowanie</h2>
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent>
          <v-text-field label="Email"></v-text-field>
          <v-text-field label="Hasło"></v-text-field>
          <router-link :to="{name: 'home'}">Przypomnij hasło</router-link>
          <br />
          <br />
          <v-btn class="ma-3" color="blue" large dark>Zaloguj się</v-btn>
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
export default {};
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