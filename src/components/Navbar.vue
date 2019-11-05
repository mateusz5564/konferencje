<template>
  <nav>
    <v-app-bar class="pr-5 blue darken-3" flat clipped-left dark app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>
        <router-link :to="{name: 'home'}" tag="span" style="cursor: pointer;"><span class="font-weight-bold headline">konferencje</span></router-link>
      </v-toolbar-title>

      <div class="flex-grow-1"></div>

      <v-btn v-if="!user" outlined large color="white" :to="{ name: 'logowanie'}">
        <v-icon class="pr-2" size="28" left>mdi-account-circle</v-icon>Logowanie
      </v-btn>

      <v-btn v-if="user" class="mx-2" small icon fab :to="{ name: 'dodaj_konferencje'}">
        <v-icon >mdi-calendar-plus</v-icon>
      </v-btn>

      <!-- current user's menu -->
      <v-menu v-if="user" offset-y min-width="300px">
        <template v-slot:activator="{ on }">
          <v-btn icon small v-on="on" fab>
            <v-avatar v-if="avatarSrc" size="24">
              <img :src="avatarSrc" alt="user's avatar" />
            </v-avatar>
          </v-btn>
        </template>

        <v-list>
          <v-list-item v-if="profil" class="mb-2">
            <v-avatar size="40" class="mr-4">
              <img :src="avatarSrc" alt />
            </v-avatar>
            <v-list-item-title>{{ profil.username }}</v-list-item-title>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item link :to="{name: 'moje_konferencje'}">
            <v-list-item-icon>
              <v-icon>mdi-calendar-star</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Moje konferencje</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item link v-if="profil" :to="{name: 'profil', params: {username: profil.username}}">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Profil</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item @click="logout" link>
            <v-list-item-icon>
              <v-icon>mdi-account-circle</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Wyloguj</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>




    <!-- NAVIGATION DRAWER -->
    <v-navigation-drawer app v-model="drawer" width="260" clipped color="blue darken-3" dark>
      <v-list dense nav>
        <v-list-item-group>
          <v-list-item v-if="user && isAdmin" :to="{ name: 'admin_panel'}" link>
            <v-list-item-icon>
              <v-icon>mdi-wrench</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Panel Administracyjny</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item exact :to="{ name: 'home'}">
            <v-list-item-icon>
              <v-icon>mdi-calendar</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Wydarzenia</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item :to="{ name: 'kalendarz'}" link>
            <v-list-item-icon>
              <v-icon>mdi-calendar-month</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Kalendarz</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
import firebase from "firebase"
import db from '@/firebase/init'
import { bus } from '../main'

export default {
  data() {
    return {
      right: null,
      drawer: true,
      user: null,
      isAdmin: null,
      profil: null,
      avatarSrc: "https://firebasestorage.googleapis.com/v0/b/konferencje-95600.appspot.com/o/avatars%2FdefaultAvatar.png?alt=media&token=f5fbdbef-b80e-41e5-bf48-e99b0d6f91a6"
    };
  },
  methods: {
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.push({ name: "logowanie" });
        });
    }
  },
  created() {
    // this.avatarSrc = "https://firebasestorage.googleapis.com/v0/b/konferencje-95600.appspot.com/o/avatars%2FdefaultAvatar.png?alt=media&token=f5fbdbef-b80e-41e5-bf48-e99b0d6f91a6"
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = user;
        db.collection('users').where("user_id", "==", user.uid)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            this.profil = doc.data()
            if(this.profil.logo){
                this.avatarSrc = this.profil.logo
            }
          })
        })
        user.getIdTokenResult().then((token) => {
           this.isAdmin = token.claims.admin
        })
      } else {
        this.user = null;
      }
    })

    bus.$on('updateAvatar', (data) =>{
      this.avatarSrc = data
    })

  
  },
};
</script>

<style>
</style>