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
          <v-text-field @keyup="isUsernameTaken" type="text" label="Nazwa użytkownika" v-model="username"></v-text-field>
          <p id="unFeedback" style="font-size: 40px; color: red;">{{ usernameFeedback }}</p>
          <p class="red--text">{{ feedback }}</p>
          <v-btn class="ma-3" type="submit" color="blue" large dark>Zarejestruj się</v-btn>
          <br />
          <br />
        </v-form>
        <!-- <v-btn @click="signupGoogle" color="red" outlined class="ma-3">Zarejestruj z Google</v-btn> -->
        <hr />
        <v-btn color="blue" outlined class="ma-3" :to="{name: 'logowanie'}">Logowanie</v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>


<script>
import db from '@/firebase/init'
import firebase from 'firebase'
import router from '@/router'

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
    isUsernameTaken(){
      if(this.username){
        db.collection('users').doc(this.username)
        .get()
        .then(doc => {
          if(doc.exists) {
            this.usernameFeedback = "Nazwa użytkownika zajęta!"
            document.getElementById("unFeedback").style.color = "red";
            return true
        } else {
            this.usernameFeedback = "Nazwa użytkownika wolna"
            document.getElementById("unFeedback").style.color = "green";
            return false
        }
        })
      }
    },
    signup(){
      if(this.email && this.password && !this.isUsernameTaken()){
        console.log(this.isUsernameTaken)
        firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
        .then(response => {
          db.collection('users').doc(this.username).set({user_id: response.user.uid})
        })
        .catch(err => {
          console.log(err)
          this.feedback = err.message
        })
      }
    },
    // signupGoogle(){

    
    //   let provider = new firebase.auth.GoogleAuthProvider();

    //   firebase.auth().signInWithPopup(provider).then(result => {
    //   // This gives you a Google Access Token. You can use it to access the Google API.
    //   let token = result.credential.accessToken;
    //   // The signed-in user info.
    //   let user = result.user;

    //   const usersRef = db.child('users')
    //   const query = usersRef.orderByChild('username').equalTo(user.displayName)
    //   console.log(query)

    //   db.collection('users').doc(user.uid).set({username: user.displayName}).then(router.push({ name: 'home'}))
    //   }).catch(error => {
    //   // Handle Errors here.
    //   let errorCode = error.code;
    //   let errorMessage = error.message;
    //   // The email of the user's account used.
    //   let email = error.email;
    //   // The firebase.auth.AuthCredential type that was used.
    //   let credential = error.credential;

    // });
    // }
  }
};
</script>

<style>
.register__card {
  margin: 0 auto;
  text-align: center;
}
</style>