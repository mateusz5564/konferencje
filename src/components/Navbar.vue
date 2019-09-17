<template>
  <nav>
    <v-app-bar clipped-left flat app color="blue accent-4" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>
        <router-link :to="{name: 'home'}" tag="span" style="cursor: pointer;">Konferencje</router-link>
      </v-toolbar-title>

      <div class="flex-grow-1"></div>

      <v-btn v-if="!user" class="ma-4" outlined x-large color="white" :to="{ name: 'logowanie'}">
        <v-icon class="pr-3" large left>mdi-account-circle</v-icon>Logowanie
      </v-btn>

      <v-menu v-if="user" offset-y min-width="300px">
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-avatar>
              <img src="@/assets/logo.png" alt />
            </v-avatar>
          </v-btn>
        </template>

        <v-list>
          <v-list-item>
            <v-avatar>
              <img src="@/assets/logo.png" alt />
            </v-avatar>
            <v-list-item-title>{{ user.email }}</v-list-item-title>
          </v-list-item>

          <v-divider></v-divider>

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
    <v-navigation-drawer app v-model="drawer" clipped color="blue accent-3" dark>
      

      <v-list dense nav>
        <v-list-item v-for="item in items" :key="item.title" link>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
import firebase from 'firebase'

export default {
  data() {
    return {
      items: [
        { title: "Wydarzenia", icon: "mdi-calendar" }
      ],
      right: null,
      drawer: true,
      user: null
    }
  },
  methods: {
    logout(){
      firebase.auth().signOut()
      .then(() => {
        this.$router.push({name: 'logowanie'})
      })
    }
  },
  created(){
    firebase.auth().onAuthStateChanged((user) => {
      if(user){
        this.user = user
      } else {
        this.user = null
      }
    })
  }
};
</script>

<style>
</style>