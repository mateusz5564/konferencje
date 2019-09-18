<template>
  <v-container class="grey lighten-5">
    <h2 class="mb-6 headline font-weight-black" >Lista konferencji</h2>
    <v-row>
      <v-col v-for="(conference, index) in conferences" :key="index" cols="12" xs="12" md="6" xl="4">
        <v-card class="mx-auto">
          <v-list-item>
            <v-list-item-content>
              <h2 class="headline font-weight-medium pb-4 pt-4">{{conference.title}}</h2>
              <p class="pb-2 headline">{{conference.start_date}} - {{conference.end_date}}</p>
              <v-divider class="blue lighten-1"></v-divider>
              <div class="pt-2 pb-2 body-1 font-weight-medium">
              <v-icon>mdi-map-marker</v-icon> {{conference.location}}
              </div>
            </v-list-item-content>
          </v-list-item>

          <v-img src="https://cdn.vuetifyjs.com/images/cards/mountain.jpg" height="294"></v-img>

          <v-card-text class="headline mb-5">
            <div class="text--primary">
              {{conference.description}}
            </div>
          </v-card-text>

          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn text color="blue accent-4">więcej informacji</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'

export default {
  components: {},
  data(){
    return {
      conferences: [],
    }
  },
  created(){
     db.collection('conferences')
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            this.conferences.push(doc.data())
            console.log(this.conferences)
          })
        })
  }
}
</script>
