<template>
  <v-container class="grey lighten-5">
    <h2 class="mb-3 subtitle-1 font-weight-black" >Moje konferencje</h2>
    <v-row>
      <v-col v-for="(conference, index) in conferences" :key="index" cols="12" xs="12" md="4" xl="3">
        <ConferenceThumbnail :conference="conference">
          <div class="pb-4" slot="floating-btn">
            <v-btn fab color="blue accent-2" :to="{name: 'edytuj_konferencje', params: {conference_id: conference.id}}" top right absolute>
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </div>
        </ConferenceThumbnail>
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
      conferences: []
    }
  },
  created(){
    let user = firebase.auth().currentUser
     db.collection('conferences').where("user_id", "==", user.uid)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
             axios.post('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + doc.data().location.latitude + ',' + doc.data().location.longitude + '&key=AIzaSyDtYbZokAi1OVXplmLIpuxlJpppE0fijPA')
              .then(response => {
                let address = response.data.results[0].formatted_address
                let dataRef = doc.data()
                dataRef.id = doc.id
                dataRef.location = address
                const link = `https://maps.google.com/?q=${address}`
                dataRef.link = link
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