<template>
  <v-container class="grey lighten-5">
    <v-progress-linear
        class="mb-4"
        :active="loading"
        :indeterminate="loading"
        color="blue accent-4"
      ></v-progress-linear>

      <div class="d-flex justify-space-between">
        <h2 class="mb-3 subtitle-1 font-weight-black" >Lista konferencji</h2>
        <div class="category_box">
        <v-autocomplete
          v-model="selected"
          @change="sortByCategory"
          :items="items"
          label="Kategoria"
          solo
          flat
        ></v-autocomplete>
        </div>
      </div>

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
      conferences: [],
      items: [],
      loading: true,
      selected: null
    }
  },
  created(){
    this.getConferences()
    this.getCategories()

    let data = new Date(firebase.firestore.Timestamp.now().seconds*1000)
    console.log(data)
  },
  methods: {
    sortByCategory(){
      if(this.selected){
        this.loading = true
        if(this.selected === "Dowolna"){
          this.getConferences()
        } else {
        db.collection("conferences")
        .where("category_id", "==", this.selected)
        .orderBy("start_date", "asc")
        .get()
        .then(async querySnapshot => {
          let docs = []
          querySnapshot.forEach(doc => {
            let dataRef = doc.data()
            dataRef.id = doc.id
            docs.push(dataRef)
          })

          for(let i in docs) {
            const test = axios.post('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + docs[i].location.latitude + ',' + docs[i].location.longitude + '&key=AIzaSyDtYbZokAi1OVXplmLIpuxlJpppE0fijPA')
            let result = await test;
            docs[i].address = result.data.results[0].formatted_address
            // const link = `https://maps.google.com/?q=${address}`
            const link = `https://maps.google.com/?q=${docs[i].location.latitude},${docs[i].location.longitude}`
            docs[i].link = link
          }
          this.conferences = docs
          this.loading = false
          })
        }
      }
    },
    getConferences(){
      db.collection("conferences")
      .where("isAccepted", "==", true)
      .where("end_date", ">", firebase.firestore.Timestamp.now())
      .orderBy("end_date", "asc")
      .orderBy("start_date", "asc")
      .get()
      .then(async querySnapshot => {
        let docs = []
        querySnapshot.forEach(doc => {
          let dataRef = doc.data()
          dataRef.id = doc.id
          docs.push(dataRef)
        })

        for(let i in docs) {
          const test = axios.post('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + docs[i].location.latitude + ',' + docs[i].location.longitude + '&key=AIzaSyDtYbZokAi1OVXplmLIpuxlJpppE0fijPA')
          let result = await test;
          docs[i].address = result.data.results[0].formatted_address
          // const link = `https://maps.google.com/?q=${address}`
          const link = `https://maps.google.com/?q=${docs[i].location.latitude},${docs[i].location.longitude}`
          docs[i].link = link
        }
        this.conferences = docs
        this.loading = false
    })
    },
    getCategories(){
      db.collection("categories")
      .get()
      .then(querySnapshot => {
        this.items.push("Dowolna")
        querySnapshot.forEach(doc => {
          this.items.push(doc.id)
        })
      })
    }
  }
}

</script>

<style>
  .category_box {
    width: 376px;
  }
</style>

