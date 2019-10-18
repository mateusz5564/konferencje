<template>
  <div class="admin_panel">
    <v-form @submit.prevent="makeAdmin">
      <v-text-field label="Email" type="email" v-model="email"></v-text-field>
      <!-- <p v-if="feedback" class="red--text">{{ feedback }}</p> -->
      <v-btn class="ma-3" color="blue" type="submit" large dark>Dodaj Administratora</v-btn>
    </v-form>
  </div>
</template>

<script>
import firebase from 'firebase'
import functions from 'firebase/functions'

export default {
  data(){
    return{
      email: null
    }
  },
  methods: {
    makeAdmin(){
      let addAdmin = firebase.functions().httpsCallable('addAdminRole')
      addAdmin({email: this.email}).then(result => {
        console.log(result)
      })
    }
  }
};
</script>

<style>
</style>