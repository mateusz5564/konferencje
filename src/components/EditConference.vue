<template>
  <div class="edit_conference ">
    <v-card class="register__card pa-5" max-width="1000px">
      <v-card-title class="justify-center">
        <h3 class="mb-5 headline">Edycja konferencji</h3>
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="updateConference">
          <v-textarea v-model="title" auto-grow label="Tytuł" rows="1"></v-textarea>
          <v-textarea v-model="description" auto-grow label="Opis" rows="1"></v-textarea>


          <h2 class="mt-10 mb-1">Bieżąca lokalizacja</h2>
          <div class="pt-2 pb-2 body-1 font-weight-medium">
            <v-icon>mdi-map-marker</v-icon>
            {{ location }}
            <v-spacer></v-spacer>
            <a :href="location_link" target="_blank">zobacz na mapie</a>
          </div>

          <v-autocomplete
            label="Wybierz nową lokalizację"
            v-model="select"
            :loading="loading"
            :items="items"
            :search-input.sync="search"
            :return-object=true
            item-text="name"
            cache-items
            flat
            hide-no-data
            hide-details
            clearable
            append-icon=""
            prepend-inner-icon="mdi-map-search-outline"
          ></v-autocomplete>

          <h2 class="mt-12">Data rozpoczęcia</h2>
          <v-row class="mt-2">
            <!-- START DATE AND TIME PICKERS -->
            <v-col cols="12" sm="6">
              <v-menu
                ref="start_date_menu"
                v-model="start_date_menu"
                :close-on-content-click="false"
                :return-value.sync="start_date"
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="start_date"
                    label="Data rozpoczęcia"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="start_date" no-title scrollable>
                  <div class="flex-grow-1"></div>
                  <v-btn text color="primary" @click="start_date_menu = false">Cancel</v-btn>
                  <v-btn text color="primary" @click="$refs.start_date_menu.save(start_date)">OK</v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>

            <!-- START TIME PICKER -->
            <v-col cols="12" sm="6">
              <v-menu
                ref="start_time_menu"
                v-model="start_time_menu"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="start_time"
                transition="scale-transition"
                offset-y
                full-width
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="start_time"
                    label="Godzina rozpoczęcia"
                    prepend-icon="mdi-clock-outline"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-if="start_time_menu"
                  v-model="start_time"
                  format="24hr"
                  full-width
                  @click:minute="$refs.start_time_menu.save(start_time)"
                ></v-time-picker>
              </v-menu>
            </v-col>
          </v-row>

          <!-- END DATE AND TIME PICKERS -->
          <h2 class="mt-12">Data zakończenia</h2>
          <v-row class="mt-2">
            <v-col cols="12" sm="6">
              <v-menu
                ref="end_date_menu"
                v-model="end_date_menu"
                :close-on-content-click="false"
                :return-value.sync="end_date"
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="end_date"
                    label="Data zakończenia"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="end_date" no-title scrollable>
                  <div class="flex-grow-1"></div>
                  <v-btn text color="primary" @click="end_date_menu = false">Cancel</v-btn>
                  <v-btn text color="primary" @click="$refs.end_date_menu.save(end_date)">OK</v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>

            <!-- END TIME PICKER -->
            <v-col cols="12" sm="6">
              <v-menu
                ref="end_time_menu"
                v-model="end_time_menu"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="end_time"
                transition="scale-transition"
                offset-y
                full-width
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="end_time"
                    label="Godzina zakończenia"
                    prepend-icon="mdi-clock-outline"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-if="end_time_menu"
                  v-model="end_time"
                  format="24hr"
                  full-width
                  @click:minute="$refs.end_time_menu.save(end_time)"
                ></v-time-picker>
              </v-menu>
            </v-col>
          </v-row>


          <h2 class="mt-5 mb-4">Aktualne logo</h2>
          <v-img :src="logo" max-width="100%" height="auto"></v-img>

          <v-file-input
            show-size
            label="Wybierz nowe logo"
            prepend-icon="mdi-camera"
            v-model="image"
          ></v-file-input>

          <p id="feedback" style="font-size: 30px; color: red;">{{ feedback }}</p>
          <v-btn class="ma-3" type="submit" color="blue" large dark>Zapisz konferencje</v-btn>
          <br />
          <br />
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'
import axios from 'axios'

export default {
  data() {
    return {
      id: null,
      title: null,
      start_date: null,
      start_time: null,
      end_date: null,
      end_time: null,
      location: null,
      location_link: null,
      description: null,
      logo: "",
      feedback: null,
      modal: true,
      start_date_menu: false,
      end_date_menu: false,
      start_time_menu: false,
      end_time_menu: false,
      image: null,
      loading: false,
      items: [],
      search: null,
      select: null,
      candidates: []
    }
  },
  created(){
    this.id = this.$route.params.conference_id
    let ref = db.collection('conferences').doc(this.$route.params.conference_id)
    ref.get().then(doc => {
      if (doc.exists){
        console.log(doc.data())
        let data = doc.data()
        this.title = data.title 
        this.description = data.description
        this.convertedStartDate(data.start_date)
        this.convertedEndDate(data.end_date)
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
  watch: {
    search(val) {
      val && val !== this.select && this.querySelections(val)
    }
  },
  computed: {
    //read data
    
    //updating
    preparedStartDate() {
      const date = new Date(this.start_date)
      if (typeof this.start_time === "string") {
        let hours = this.start_time.match(/^(\d+)/)[1]
        let minutes = this.start_time.match(/:(\d+)/)[1]
        date.setHours(hours)
        date.setMinutes(minutes)
      } else {
        date.setHours(this.start_time.getHours())
        date.setMinutes(this.start_time.getMinutes())
      }
      return date;
    },
    preparedEndDate() {
      const date = new Date(this.end_date)
      if (typeof this.end_time === "string") {
        let hours = this.end_time.match(/^(\d+)/)[1]
        let minutes = this.end_time.match(/:(\d+)/)[1]
        date.setHours(hours)
        date.setMinutes(minutes)
      } else {
        date.setHours(this.end_time.getHours())
        date.setMinutes(this.end_time.getMinutes())
      }
      return date;
    }
  },
  methods: {
    //read data
    convertedStartDate(timestamp){
      const date = new Date(timestamp.seconds*1000)
      this.start_date = date.toISOString().substring(0,10)
      this.start_time = date.toISOString().substring(11,16)
    },
    convertedEndDate(timestamp){
      const date = new Date(timestamp.seconds*1000)
      this.end_date = date.toISOString().substring(0,10)
      this.end_time = date.toISOString().substring(11,16)
    },
    //update data
    updateConference() {
      const conf = {}
      if(this.title != null && this.title !== ''){
        conf.title = this.title
      }
      if(this.description != null && this.description !== ''){
        conf.description = this.description
      }
      if(this.select !== null){
        const latitude = this.select.geometry.location.lat()
        const longitude = this.select.geometry.location.lng()
        const geopoint = new firebase.firestore.GeoPoint(latitude, longitude)
        conf.location = geopoint
      }
      if(this.start_date !== null){
        conf.start_date = this.preparedStartDate
      }
      if(this.end_date !== null){
        conf.end_date = this.preparedEndDate
      }

      if(!this.isEmpty(conf)){
        db.collection("conferences").doc(this.id)
        .update(conf)
        .then(response => {
          if(this.image == null){
            console.log('zapisano konferencje')
            // this.$router.push({name: 'moje_konferencje'})
            this.$router.go(-1)
          }
        })
        .catch(err => {
          console.log(err)
        });
      }

      //update logo
      if(this.image !== null){
        const filename = this.image.name
        const extention = filename.substring(
          filename.lastIndexOf("."),
          filename.length
        );

        firebase.storage().ref().child("conferences/" + this.id + extention)
        .delete().then(() => {
          console.log('usunieto obecne logo')
           firebase
          .storage()
          .ref("conferences/" + this.id + extention)
          .put(this.image)
          .then(response => {
            response.ref.getDownloadURL().then(downloadURL => {
              db.collection("conferences")
                .doc(this.id)
                .update({ logo: downloadURL })
                .then(response => {
                  console.log("pomyslnie edytowano konferencje")
                  // this.$router.push({name: 'moje_konferencje'})
                  this.$router.go(-1)
                });
            });
          });
        })
        .catch(err => {
          console.log(err)
        })
      }

    },
    isEmpty(obj) {
    for(var prop in obj) {
      if(obj.hasOwnProperty(prop)) {
        return false;
      }
    }
    return JSON.stringify(obj) === JSON.stringify({});
    },
    querySelections(v) {
      this.loading = true
      const service = new google.maps.places.PlacesService(document.createElement('div'))

      service.findPlaceFromQuery({query: v, fields: ['name', 'geometry', 'formatted_address']}, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          // this.candidates = results
          this.items = results.filter(place => {
            return (place.name || '').toLowerCase().match((v || '').toLowerCase())
          })
        }
      })
      this.loading = false
    }
  }
}
</script>

<style>

</style>