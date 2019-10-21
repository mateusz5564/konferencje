<template>
  <v-container class="grey lighten-5">
    <h2 class="mb-3 subtitle-1 font-weight-black" >Lista konferencji</h2>
    <v-row>
      <v-col v-for="(conference, index) in conferences" :key="index" cols="12" xs="12" md="4" xl="3">
        <ConferenceThumbnail :conference="conference" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ConferenceThumbnail from '@/components/ConferenceThumbnail.vue'
import db from '@/firebase/init'
import firebase from 'firebase'
import axios from 'axios'

export default {
  components: {
    ConferenceThumbnail
  },
  data(){
    return {
      conferences: [
        // name: 'Wydarzenie 1',
        //   details: 'Pierwsze testowe wydarzenie',
        //   start: '2019-10-07',
        //   end: '2019-10-10',
        //   color: 'green',
      ]
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
                const link = `https://maps.google.com/?q=${address}`
                dataRef.link = link
                this.conferences.push(dataRef)
                console.log(dataRef)
              })
              .catch(e => {
                console.log(e)
            })
          })
        })
  }
}
</script>
