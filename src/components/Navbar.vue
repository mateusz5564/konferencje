<template>
<nav>
    <v-app-bar
    clipped-left
    flat
    app
    color="blue accent-4"
    dark
    >
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>Konferencje</v-toolbar-title>

        <div class="flex-grow-1"></div>

        <v-btn class="ma-2" tile outlined color="white">
            <v-icon left>mdi-account-box</v-icon>Logowanie
        </v-btn>

        <v-menu
            left
            bottom
        >

        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-avatar>
                <img src="@/assets/logo.png" alt="">
            </v-avatar>
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            v-for="n in 5"
            :key="n"
            @click="() => {}"
          >
            <v-list-item-title>Option {{ n }}</v-list-item-title>
          </v-list-item>
        </v-list>


         </v-menu>
    </v-app-bar>


    <v-navigation-drawer app v-model="drawer" clipped color="blue accent-3" dark>
        <v-list-item>
            <v-list-item-content>
                <v-list-item-title class="title">
                    Application
                </v-list-item-title>
                <v-list-item-subtitle>
                    subtext
                </v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>

      <v-divider></v-divider>

        <v-list
        dense
        nav
        >
            <v-list-item
                v-for="item in items"
                :key="item.title"
                link
            >
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
export default {
    data () {
      return {
        items: [
          { title: 'Dashboard', icon: 'mdi-view-dashboard' },
          { title: 'Photos', icon: 'mdi-image' },
          { title: 'About', icon: 'mdi-help-box' },
        ],
        right: null,
        drawer: true
      }
    },
}
</script>

<style>

</style>