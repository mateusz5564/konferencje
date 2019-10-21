<template>
  <div class="reset-password">
    <v-card class="login__card pa-5" max-width="600px">
      <v-card-title class="justify-center">
        <h2>Zresetuj hasło</h2>
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="login">
          <v-text-field label="Email" type="email" v-model="email"></v-text-field>
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
export default {
  
}
</script>

<style>

</style>