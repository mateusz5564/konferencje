<template>
  <div class="user-profile mx-auto">
    <v-card class="mb-5 pa-10" max-width="800px" v-if="profile">
      <div class="d-flex flex-row">
        <div class="avatar">
          <v-avatar class="avatar__img" size="200" @click="$refs.imageInput.click()">
            <img :src="avatarSrc" />
          </v-avatar>
          <a v-if="isOwner" class="d-block text-center mt-3" @click="$refs.imageInput.click()">zmień avatar</a>
          <input v-if="isOwner" type="file" style="display: none" ref="imageInput" @change="onImageSelected">

        </div>
        <div class="user-info ml-10">
          <div class="d-flex flex-column">
            <div class="username d-flex flex-row">
              <h2 class="mb-4 mr-5 headline">{{ profile.username }}</h2>
              <v-btn
                v-if="isOwner"
                small
                dark
                color="blue"
                outlined
                @click="showSettings = !showSettings"
              >Ustawienia</v-btn>
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
            <v-icon left>mdi-account</v-icon>Edycja profilu
          </v-tab>
          <v-tab class="tab">
            <v-icon left>mdi-lock</v-icon>Zmień hasło
          </v-tab>
          <v-tab class="tab">
            <v-icon left>mdi-access-point</v-icon>Zmień Email
          </v-tab>

          <!-- EDIT PROFILE -->
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <v-form @submit.prevent="updateProfile">
                  <v-text-field outlined v-model="profile.username" label="Nazwa użytkownika"></v-text-field>
                  <v-text-field outlined v-model="profile.fullname" label="Imię i nazwisko"></v-text-field>
                  <v-textarea outlined v-model="profile.bio" label="Biogram"></v-textarea>
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
                <v-form @submit.prevent="changePassword">
                  <v-text-field outlined type="password" v-model="currentPassword" label="Aktualne hasło"></v-text-field>
                  <v-text-field outlined type="password" v-model="newPassword" label="Nowe hasło"></v-text-field>
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
                <v-form @submit.prevent="changeEmail">
                  <v-text-field v-model="email" outlined label="Adres Email"></v-text-field>
                  <v-text-field v-model="currentPasswordEmailTab" outlined type="password" label="Podaj aktualne hasło"></v-text-field>
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
      <ResetPassword :uemail="currentUser.email" @resetPasswordSent="setSnackbar" />
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
import db from "@/firebase/init";
import firebase from "firebase";
import ResetPassword from "@/components/ResetPassword";
import { bus } from '../main'

export default {
  components: {
    ResetPassword
  },
  data() {
    return {
      profile: null,
      isOwner: false,
      showSettings: true,
      currentUser: null,
      dialog: false,
      snackbar: false,
      color: "",
      icon: "",
      text: "",
      timeout: 5000,
      currentPassword: null,
      currentPasswordEmailTab: null,
      email: null,
      newPassword: null,
      selectedImage: null,
      avatarSrc: "https://firebasestorage.googleapis.com/v0/b/konferencje-95600.appspot.com/o/avatars%2FdefaultAvatar.png?alt=media&token=f5fbdbef-b80e-41e5-bf48-e99b0d6f91a6"
    };
  },
  created() {
    var user = firebase.auth().currentUser;
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        db.collection("users")
          .where("username", "==", this.$route.params.username)
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              this.profile = doc.data();
              if(this.profile.logo){
                this.avatarSrc = this.profile.logo
              }
              if (doc.data().user_id === user.uid) {
                this.isOwner = true;
                this.currentUser = user;
                this.email = user.email
              }
            });
          });
      }
    });
  },
  methods: {
    onImageSelected(event){
      var user = firebase.auth().currentUser;
      this.selectedImage = event.target.files[0]

      if(this.selectedImage){
        const filename = this.selectedImage.name
        const extension = filename.substring(
          filename.lastIndexOf("."),
          filename.length
        );
      
      if(this.profile.logo){
        firebase.storage().refFromURL(this.profile.logo)
        .delete().then(() => {
          console.log('usunieto obecny avatar')
          firebase
          .storage()
          .ref("avatars/" + user.uid + extension)
          .put(this.selectedImage)
          .then(response => {
            response.ref.getDownloadURL().then(downloadURL => {
              db.collection("users")
                .doc(user.uid)
                .update({ logo: downloadURL })
                .then(response => {
                  console.log("pomyslnie ustawiono avatar")
                  this.avatarSrc = downloadURL
                  this.profile.logo = downloadURL
                  bus.$emit('updateAvatar', downloadURL)
                  this.setSnackbar2("success", "Avatar został zmieniony!")
                });
            });
          });
        })
        .catch(err => {
          console.log(err)
          this.setSnackbar2("error", "Nie udało się zmienić avataru!")
        })
      } else {
         firebase
          .storage()
          .ref("avatars/" + user.uid + extension)
          .put(this.selectedImage)
          .then(response => {
            response.ref.getDownloadURL().then(downloadURL => {
              db.collection("users")
                .doc(user.uid)
                .update({ logo: downloadURL })
                .then(response => {
                  console.log("pomyslnie ustawiono avatar")
                  this.avatarSrc = downloadURL
                  this.profile.logo = downloadURL
                  bus.$emit('updateAvatar', downloadURL)
                  this.setSnackbar2("success", "Avatar został zmieniony!")
                });
            });
          });
      }
      
      }
    },
    updateProfile() {
      const prof = {};
      if (this.profile.username != null && this.profile.username !== "") {
        prof.username = this.profile.username;
      }
      if (this.profile.fullname != null && this.profile.fullname !== "") {
        prof.fullname = this.profile.fullname;
      }
      if (this.profile.bio != null && this.profile.bio !== "") {
        prof.bio = this.profile.bio;
      }

      db.collection("users")
        .doc(this.currentUser.uid)
        .update(prof)
        .then(response => {
          this.color = "success";
          this.icon = "mdi-check-circle";
          this.text = "Pomyślnie edytowano profil!";
          this.snackbar = true;
        });
    },
    changePassword() {
      let user = firebase.auth().currentUser
      let newPassword = this.newPassword
      const credential = firebase.auth.EmailAuthProvider.credential(user.email, this.currentPassword)

        user.reauthenticateWithCredential(credential)
        .then(() => {
          firebase.auth().currentUser.updatePassword(newPassword)
            .then(() => {
              console.log("zmieniono hasło")
              this.setSnackbar2("success", "Hasło zostało zmienione!")
              this.currentPassword = ""
              this.newPassword = ""
            })
            .catch(err => {
              console.log(err)
              this.setSnackbar2("error", "Nie udało się zmienić hasła!")
              this.currentPassword = ""
            })
        })
        .catch(err => {
          console.log(err)
          this.setSnackbar2("error", "Nie udało się zmienić hasła!")
          this.currentPassword = ""
        })
    },
    changeEmail(){
      let user = firebase.auth().currentUser
      let newEmail = this.newPassword
      const credential = firebase.auth.EmailAuthProvider.credential(user.email, this.currentPasswordEmailTab)

        user.reauthenticateWithCredential(credential)
        .then(() => {
          firebase.auth().currentUser.updateEmail(this.email)
            .then(() => {
              console.log("zmieniono email")
              this.setSnackbar2("success", "Adres email został zmieniony!")
              this.currentPassword = ""
            })
            .catch(err => {
              console.log(err)
              this.setSnackbar2("error", "Nie udało się zmienić adresu email!")
              this.currentPassword = ""
            })
        })
        .catch(err => {
          console.log(err)
          this.setSnackbar2("error", "Nie udało się zmienić adresu email!")
          this.currentPassword = ""
        })
    },
    setSnackbar() {
      this.dialog = false
      this.color = "success"
      this.icon = "mdi-check-circle"
      this.text = "Pomyślnie wysłano wiadomość!"
      this.snackbar = true
    },
    setSnackbar2(color, text) {
      this.color = color
      this.text = text
      if(color == "success"){
        this.icon = "mdi-check-circle"
      } else {
        this.icon = "mdi-alert-circle"
      }
      this.snackbar = true
    }
  }
};
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
.v-avatar img{
  border: 1px solid grey
}
.avatar__img{
  cursor: pointer;
}
</style>