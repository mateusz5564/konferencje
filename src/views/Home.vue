<template>
  <v-container class="grey lighten-5">
    <h2 class="mb-6 headline font-weight-black" >Lista konferencji</h2>
    <v-row>
      <v-col v-for="(conference, index) in conferences" :key="index" cols="12" xs="12" md="6" xl="4">
        <v-card class="mx-auto">
          <v-list-item>
            <v-list-item-content>
              <h2 class="headline font-weight-medium pb-4 pt-4">{{conference.title}}</h2>
              <p class="pb-2 ">{{conference.start_date.toDate() | dateFilter}} - {{conference.end_date.toDate() | dateFilter}}</p>
              <v-divider class="blue lighten-1"></v-divider>
              <div class="pt-2 pb-2 body-1 font-weight-medium">
              <v-icon>mdi-map-marker</v-icon> {{ conference.location }}
              </div>
            </v-list-item-content>
          </v-list-item>
        
          <v-img :src="conference.logo" height="294"></v-img>

          <!-- <v-card-text class="headline mb-5">
            <div class="text--primary">
              {{conference.description}}
            </div>
          </v-card-text> -->

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
import axios from 'axios'

export default {
  components: {},
  data(){
    return {
      conferences: []
    }
  },
  created(){
     db.collection('conferences')
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
             axios.post('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + doc.data().location.latitude + ',' + doc.data().location.longitude + '&key=AIzaSyDtYbZokAi1OVXplmLIpuxlJpppE0fijPA')
              .then(response => {
                let address = response.data.results[0].formatted_address
                let dataRef = doc.data()
                dataRef.location = address
                this.conferences.push(dataRef)
              })
              .catch(e => {
                console.log(e)
            })
          })
        })
  }
}
</script>
