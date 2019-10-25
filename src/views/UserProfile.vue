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
              <v-btn v-if="isOwner" small dark color="blue" outlined @click="showSettings = !showSettings">Ustawienia</v-btn>
            </div>
            <p class="subtitle-1 font-weight-medium">{{ profile.fullname }}</p>
            <p clas="subtitle-1">{{ profile.bio }}</p>
          </div>
        </div>
      </div>
      
    </v-card>
    
  <v-expand-transition>
 <v-card v-if="isOwner && showSettings" max-width="800px">

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
          <v-form @submit.prevent="updateProfile">
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
              <p class="text-left font-weight-medium mb-8">
                <a @click.stop="dialog = true">Zapomniałem hasła</a>
              </p>
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
  </v-expand-transition>

  <v-dialog v-if="currentUser" v-model="dialog" max-width="500px">
    <ResetPassword :uemail="currentUser.email" @resetPasswordSent="setSnackbar"/>
  </v-dialog>

  <v-snackbar v-model="snackbar" :color="color" top :timeout="timeout">
      <div>
        <v-icon class="mr-2">{{icon}}</v-icon>
        {{ text }}
      </div>
      <v-btn text @click="snackbar = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from "firebase";
import ResetPassword from '@/components/ResetPassword'

export default {
  components: {
    ResetPassword
  },
  data(){
    return {
      profile: null,
      isOwner: false,
      showSettings: true,
      currentUser: null,
      dialog: false,
      snackbar: false,
      color: '',
      icon: '',
      text: '',
      timeout: 5000
    }
  },
  created(){
    var user = firebase.auth().currentUser;
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        db.collection('users').where("username", "==", this.$route.params.username)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            this.profile = doc.data()
            if(doc.data().user_id === user.uid){
              this.isOwner = true
              this.currentUser = user
            } 
          })
        })
      } 
    })
  },
  methods: {
    updateProfile() {
      const prof = {}
      if(this.profile.username != null && this.profile.username !== ''){
        prof.username = this.profile.username
      }
      if(this.profile.fullname != null && this.profile.fullname !== ''){
        prof.fullname = this.profile.fullname
      }
      if(this.profile.bio != null && this.profile.bio !== ''){
        prof.bio = this.profile.bio
      }

      db.collection('users').doc(this.currentUser.uid)
      .update(prof)
      .then(response => {
        console.log("pomyslnie edytowano profil")
      })
    },
    setSnackbar(){
      this.dialog = false
      this.color = "success"
      this.icon = "mdi-check-circle"
      this.text = "Pomyślnie wysłano wiadomość!"
      this.snackbar = true
    }
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