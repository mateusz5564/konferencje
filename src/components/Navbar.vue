<template>
  <nav>
    <v-app-bar class="pr-6 blue darken-3" elevate-on-scroll clipped-left dark app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>
        <router-link :to="{name: 'home'}" tag="span" style="cursor: pointer;">Konferencje</router-link>
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
            <v-avatar size="24">
              <img src="@/assets/testav.png" alt="user's avatar" />
            </v-avatar>
          </v-btn>
        </template>

        <v-list>
          <v-list-item class="mb-2">
            <v-avatar size="40" class="mr-3">
              <img src="@/assets/testav.png" alt />
            </v-avatar>
            <v-list-item-title>{{ user.email }}</v-list-item-title>
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
import firebase from "firebase";

export default {
  data() {
    return {
      right: null,
      drawer: true,
      user: null,
      isAdmin: null
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
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = user;
        user.getIdTokenResult().then((token) => {
           this.isAdmin = token.claims.admin
        })
      } else {
        this.user = null;
      }
    });
  }
};
</script>

<style>
</style>