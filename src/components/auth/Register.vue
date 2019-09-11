<template>
  <div class="register mt-12">
    <v-card class="register__card pa-5" max-width="600px">
      <v-card-title class="justify-center">
        <h2>Rejestracja</h2>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field type="email" label="Email" v-model="email"></v-text-field>
          <v-text-field type="password" label="Hasło" v-model="password"></v-text-field>

          <v-btn class="ma-3" color="blue" large dark>Zarejestruj się</v-btn>
          <br />
          <br />
        </v-form>
        <hr />
        <v-btn color="blue" outlined class="ma-3" :to="{name: 'logowanie'}">Logowanie</v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>


<script>
export default {
  data() {
    return {
      email: null,
      password: null
    };
  }
};
</script>

<style>
.register__card {
  margin: 0 auto;
  text-align: center;
}
</style>