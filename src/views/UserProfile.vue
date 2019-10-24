<template>
  <div class="user-profile mx-auto">

    <v-card class="mb-5 pa-10" max-width="800px" v-if="profile" >
      <div class="d-flex flex-row">
        <div class="avatar">
          <v-avatar size="200">
           <img src="@/assets/testav.png" />
        </v-avatar>
        </div>
        <div class="user-info ml-10">
          <div class="d-flex flex-column">
            <div class="username d-flex flex-row">
              <h2 class="mb-4 mr-5 headline">{{ profile.username }}</h2>
              <v-btn small dark color="blue" outlined @click="showSettings = !showSettings">Ustawienia</v-btn>
            </div>
            <p class="subtitle-1 font-weight-medium">{{ profile.fullname }}</p>
            <p clas="subtitle-1">{{ profile.bio }}</p>
          </div>
        </div>
      </div>
      
    </v-card>
    
 <v-card v-if="currentUser && showSettings" max-width="800px">

    <v-tabs vertical>
      <v-tab class="tab">
        <v-icon left>mdi-account</v-icon>
        Edycja profilu
      </v-tab>
      <v-tab class="tab">
        <v-icon left>mdi-lock</v-icon>
        Zmień hasło
      </v-tab>
      <v-tab class="tab">
        <v-icon left>mdi-access-point</v-icon>
        Zmień Email
      </v-tab>


      <!-- EDIT PROFILE -->
      <v-tab-item>
        <v-card flat>
          <v-card-text>
          <v-form @submit.prevent="">
            <v-text-field outlined v-model="profile.username"  label="Nazwa użytkownika" ></v-text-field>
            <v-text-field outlined v-model="profile.fullname"  label="Imię i nazwisko" ></v-text-field>
            <v-textarea outlined v-model="profile.bio" label="Biogram" ></v-textarea>
            <v-btn type="submit" color="blue" dark>Zapisz</v-btn>
            <br />
            <br />
          </v-form>
          </v-card-text>
        </v-card>
      </v-tab-item>


      <!-- CHANGE PASSWORD -->
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <v-form @submit.prevent="">
              <v-text-field outlined label="Aktualne hasło" ></v-text-field>
              <v-text-field outlined label="Nowe hasło" ></v-text-field>
              <v-btn type="submit" color="blue" dark>Zapisz</v-btn>
              <br />
              <br />
             </v-form>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item class="raz">
        <v-card flat>
          <v-card-text>
            <v-form @submit.prevent="">
              <v-text-field v-model="currentUser.email" outlined label="Adres Email" ></v-text-field>
              <v-btn type="submit" color="blue" dark>Zapisz</v-btn>
              <br />
              <br />
             </v-form>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-card>

  </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from "firebase";

export default {
  data(){
    return {
      profile: null,
      currentUser: null,
      currentUserProfile: null,
      showSettings: true
    }
  },
  created(){
    var user = firebase.auth().currentUser;
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.currentUser = user;
        db.collection('users').where("user_id", "==", user.uid)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            this.profile = doc.data()
          })
        })
      } else {
        this.currentUser = null
        let ref = db.collection('users')
        ref.doc(this.$route.params.username).get()
        .then(user => {
          this.profile = user.data()
        })
      }
    });
  }
}
</script>

<style>
.user-profile {
  max-width: 800px;
}
.tab {
  justify-content: flex-start !important;
}
p {
  margin: 0 !important;
}
</style>