<template>
  <div class="new_conference mt-12">
    <v-card class="register__card pa-5" max-width="800px">
      <v-card-title class="justify-center">
        <h2>Dodaj konferencje</h2>
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="addConference">
          <v-textarea v-model="title" auto-grow label="Tytuł" rows="1"></v-textarea>
          <v-textarea v-model="description" auto-grow label="Opis" rows="1"></v-textarea>

          <!-- <v-text-field type="text" label="Lokalizacja" prepend-icon="mdi-map-marker" v-model="location"></v-text-field> -->
          <v-autocomplete
            label="Lokalizacja"
            prepend-icon="mdi-map-marker"
            v-model="select"
            :loading="loading"
            :items="items"
            :search-input.sync="search"
            :return-object=true
            item-text="name"
            cache-items
            class="mx-4"
            flat
            hide-no-data
            hide-details
            clearable
            append-icon="mdi-map-search-outline"
          ></v-autocomplete>

          <v-row>
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
          <v-row>
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

          <v-file-input
            show-size
            label="Wybierz logo"
            prepend-icon="mdi-camera"
            v-model="image"
            @change="uploadImage"
          ></v-file-input>

          <p id="feedback" style="font-size: 30px; color: red;">{{ feedback }}</p>
          <v-btn class="ma-3" type="submit" color="blue" large dark>Dodaj konferencje</v-btn>
          <br />
          <br />
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import firebase from "firebase";
import db from "@/firebase/init";
import axios from 'axios'

export default {
  data() {
    return {
      title: null,
      start_date: null,
      start_time: null,
      end_date: null,
      end_time: null,
      location: null,
      description: null,
      logo: null,
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
  watch: {
    search(val) {
      val && val !== this.select && this.querySelections(val)
      console.log(this.select)
      console.log(this.select.getGeometry)
    }
  },
  computed: {
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
    uploadImage() {
      // const filename = this.image.name
      // const extention = filename.substring(filename.lastIndexOf('.'), filename.length)
      // firebase.storage().ref('conferences/' + response.id + extention).put(this.image)
    },
    addConference() {
      const latitude = Number(this.location.split(",")[0])
      const longitude = Number(this.location.split(",")[1])
      const geopoint = new firebase.firestore.GeoPoint(latitude, longitude)
      let key
      db.collection("conferences")
        .add({
          title: this.title,
          description: this.description,
          location: geopoint,
          start_date: firebase.firestore.Timestamp.fromDate(
            this.preparedStartDate
          ),
          end_date: firebase.firestore.Timestamp.fromDate(this.preparedEndDate)
        })
        .then(response => {
          console.log(response)
          const filename = this.image.name
          const extention = filename.substring(
            filename.lastIndexOf("."),
            filename.length
          );
          key = response.id;
          firebase
            .storage()
            .ref("conferences/" + response.id + extention)
            .put(this.image)
            .then(response => {
              response.ref.getDownloadURL().then(downloadURL => {
                db.collection("conferences")
                  .doc(key)
                  .update({ logo: downloadURL })
                  .then(response => {
                    console.log("pomyslnie dodano konferencje")
                  });
              });
            });
        })
        .catch(err => {
          console.log(err)
        });
    },
    querySelections(v) {
      this.loading = true

      const service = new google.maps.places.PlacesService(document.createElement('div'))

      service.findPlaceFromQuery({query: v, fields: ['name', 'geometry', 'formatted_address']}, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          this.candidates = results
          this.items = results.filter(place => {
            return (place.name || '').toLowerCase().match((v || '').toLowerCase())
          })
        }
      })
      this.loading = false
    }
  },
};
</script>

<style>
</style>