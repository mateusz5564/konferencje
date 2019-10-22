<template>
  <div class="conference-page">
    <div v-if="exist">
    <v-card class="mx-auto" >
      <slot name="floating-btn"></slot>
    
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title font-weight-regular mt-2">{{title}}</v-list-item-title>
          <p class="pb-2 body-2">{{start_date | dateFilter}} - {{end_date | dateFilter}}</p>
          <v-divider class="blue lighten-1"></v-divider>
          <div class="pt-2 pb-2 body-2 font-weight-medium grey--text">
            <v-icon>mdi-map-marker</v-icon>
            {{ location }}
            <v-spacer></v-spacer>
            <a class="body-2" :href="link" target="_blank">zobacz na mapie</a>
          </div>
        </v-list-item-content>
      </v-list-item>

      <v-img :src="logo" height="500"></v-img>

      <v-card-text class="headline mb-5">
        <div class="text--primary">{{description}}</div>
      </v-card-text>
    </v-card>
  </div>

  <div v-if="!exist" class="test">
    <h2>Nie znaleziono konferencji</h2>
  </div>

  </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'
import axios from 'axios'

export default {
  data () {
    return {
      exist: false,
      id: null,
      title: null,
      start_date: null,
      start_time: null,
      end_date: null,
      end_time: null,
      location: null,
      link: null,
      description: null,
      logo: "",
      feedback: null,
      image: null,
    }
  },
  created(){
    this.id = this.$route.params.conference_id
    let ref = db.collection('conferences').doc(this.$route.params.conference_id)
    ref.get().then(doc => {
      if (doc.exists){
        let data = doc.data()
        this.exist = true
        this.title = data.title 
        this.description = data.description
        // this.convertedStartDate(data.start_date)
        // this.convertedEndDate(data.end_date)
        this.start_date = data.start_date.toDate()
        this.end_date = data.end_date.toDate()
        this.logo = data.logo
        axios.post('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + doc.data().location.latitude + ',' + doc.data().location.longitude + '&key=AIzaSyDtYbZokAi1OVXplmLIpuxlJpppE0fijPA')
              .then(response => {
                let address = response.data.results[0].formatted_address
                this.location = address
                const link = `https://maps.google.com/?q=${address}`
                this.location_link = link
              })
              .catch(e => {
                console.log(e)
            })
      } else {
        console.log('Taka konferencja nie istenieje!')
      }
    })
  },
  // computed: {
  //   //read data
    
  //   //updating
  //   preparedStartDate() {
  //     const date = new Date(this.start_date)
  //     if (typeof this.start_time === "string") {
  //       let hours = this.start_time.match(/^(\d+)/)[1]
  //       let minutes = this.start_time.match(/:(\d+)/)[1]
  //       date.setHours(hours)
  //       date.setMinutes(minutes)
  //     } else {
  //       date.setHours(this.start_time.getHours())
  //       date.setMinutes(this.start_time.getMinutes())
  //     }
  //     return date;
  //   },
  //   preparedEndDate() {
  //     const date = new Date(this.end_date)
  //     if (typeof this.end_time === "string") {
  //       let hours = this.end_time.match(/^(\d+)/)[1]
  //       let minutes = this.end_time.match(/:(\d+)/)[1]
  //       date.setHours(hours)
  //       date.setMinutes(minutes)
  //     } else {
  //       date.setHours(this.end_time.getHours())
  //       date.setMinutes(this.end_time.getMinutes())
  //     }
  //     return date;
  //   }
  // },
  // methods: {
  //   //read data
  //   convertedStartDate(timestamp){
  //     const date = new Date(timestamp.seconds*1000)
  //     this.start_date = date.toISOString().substring(0,10)
  //     this.start_time = date.toISOString().substring(11,16)
  //   },
  //   convertedEndDate(timestamp){
  //     const date = new Date(timestamp.seconds*1000)
  //     this.end_date = date.toISOString().substring(0,10)
  //     this.end_time = date.toISOString().substring(11,16)
  //   },
  // }
}
</script>


<style>

</style>