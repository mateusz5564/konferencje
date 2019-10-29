<template>
  <div class="conference-page">
    <div v-if="exist">
      <v-container>
        <v-row justify="center">
          <v-col lg="auto">
            <v-card class="mx-auto" outlined max-width="800px">
              <v-card-text class="headline font-weight-light mt-2 black--text">{{title}}</v-card-text>

              <v-img :src="logo" height="auto"></v-img>

              <v-card-text class="body-2 mb-5 mt-5">
                <div class="text--primary">{{description}}</div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col lg="auto">
            <v-card class="mx-auto" outlined width="400">
              <div class="d-flex flex-row pa-5">
                <v-icon class="pr-3" color="blue" large>mdi-calendar</v-icon>
                <div class="d-flex flex-column">
                  <span class="body-1">{{start_date | dateFilter}} - {{end_date | dateFilter}}</span>
                    <a @click.stop="dialog = true">dodaj do kalendarza</a>
                </div>
              </div>

              <v-divider class="blue lighten-1"></v-divider>

              <div class="d-flex flex-row pa-5">
                <v-icon class="pr-3" color="blue" large>mdi-map-marker-radius</v-icon>
                <div class="d-flex flex-column">
                  <span class="body-1">{{ location }}</span>
                  <a class="body-2" :href="link" target="_blank">zobacz na mapie</a>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

    <v-dialog v-model="dialog" max-width="350px">
      <ExportConference :conference="conference"/>
    </v-dialog>
      

    </div>

    <div v-if="!exist" class="test">
      <h2>Nie znaleziono konferencji</h2>
    </div>
  </div>
</template>

<script>
import db from "@/firebase/init";
import firebase from "firebase";
import axios from "axios";
import { saveAs } from "file-saver";
import ExportConference from '@/components/ExportConference'

export default {
  components: {
    ExportConference
  },
  data() {
    return {
      dialog: false,
      exist: false,
      id: null,
      title: null,
      start_date: null,
      start_time: null,
      end_date: null,
      end_time: null,
      location: null,
      geo: null,
      link: null,
      description: null,
      logo: "",
      feedback: null,
      image: null,
      conference: {}
    };
  },
  created() {
    this.id = this.$route.params.conference_id;
    let ref = db
      .collection("conferences")
      .doc(this.$route.params.conference_id);
    ref.get().then(doc => {
      if (doc.exists) {
        let data = doc.data();
        this.exist = true;
        this.title = data.title;
        this.description = data.description;
        this.start_date = data.start_date.toDate();
        this.end_date = data.end_date.toDate();
        this.logo = data.logo;
        this.geo = data.location;
        axios
          .post(
            "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
              doc.data().location.latitude +
              "," +
              doc.data().location.longitude +
              "&key=AIzaSyDtYbZokAi1OVXplmLIpuxlJpppE0fijPA"
          )
          .then(response => {
            let address = response.data.results[0].formatted_address;
            this.location = address; 
            const link = `https://maps.google.com/?q=${address}`;
            this.link = link;
            this.conference.id = this.id
            this.conference.title = this.title
            this.conference.start_date = this.start_date.toISOString()
            this.conference.end_date = this.end_date.toISOString()
            this.conference.location = this.location
            this.conference.link = this.link
            this.conference.description = this.description
            this.conference.logo = this.logo
            this.conference.geo = this.geo
          })
          .catch(e => {
            console.log(e);
          });
      } else {
        console.log("Taka konferencja nie istenieje!");
      }
    });
  }
};
</script>


<style>
</style>