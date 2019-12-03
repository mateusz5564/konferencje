<template>
  <div class="conference-page">
    <div v-if="exist">
      <v-container>
        <v-row justify="center">
          <v-col lg="auto">
            <v-card class="mx-auto" outlined width="800px">
              <div v-if="$admin" class="d-flex justify-center mt-4">
                <v-btn :color="acceptColor" dark @click="updateAccepted">
                  <v-icon v-if="!isAccepted" left>mdi-check-circle-outline</v-icon>
                  <v-icon v-if="isAccepted" left>mdi-cancel</v-icon>
                    {{acceptText}}
                </v-btn>
              </div>
              <v-card-text class="headline font-weight-light mt-2 black--text">{{title}}</v-card-text>
              <div class="d-flex justify-space-between">
              <v-chip class="ma-2" color="blue lighten-1" label text-color="white">
                <v-icon left>mdi-label</v-icon>
                {{category_id}}
              </v-chip>
              <v-chip v-if="user" class="ma-2" color="orange darken-1" text-color="white" @click="updateObserved">
                <v-icon v-if="!isObserved" left>mdi-star</v-icon>
                  {{observeText}}
              </v-chip>
              </div>
              <v-img :src="logo" height="auto"></v-img>

              <v-card-text class="body-2 mb-5 mt-5">
                <div id="description" class="text--primary">{{description}}</div>
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

              <v-divider v-if="website" class="blue lighten-1"></v-divider>

              <div v-if="website" class="d-flex flex-row pa-5 justify-center">
                <v-chip
                  class="ma-2"
                  color="primary"
                  :href="website"
                  target="_blank"
                  outlined
                  link
                  pill
                >
                  <v-icon left>mdi-web</v-icon>strona internetowa
                </v-chip>
              </div>
            </v-card>

            <v-card v-if="importantDates[0]" class="mx-auto mt-6" outlined width="400">
              <v-card-title class="d-block title text-center font-weight-regular">Ważne daty</v-card-title> 
              <v-divider class="blue lighten-1"></v-divider>
              <div v-for="(date, index) in importantDates" :key="index" class="d-flex flex-row pa-5">
                <ImportantDateView :importantDate="date"/>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <v-dialog v-model="dialog" max-width="350px">
        <ExportConference :conference="conference" />
      </v-dialog>
    </div>

    <div v-if="noExist" class="test">
      <h2>Nie znaleziono konferencji</h2>
    </div>
  </div>
</template>

<script>
import db from "@/firebase/init"
import firebase from "firebase"
import axios from "axios"
import { saveAs } from "file-saver"
import ExportConference from "@/components/ExportConference"
import ImportantDateView from "@/components/ImportantDateView"



export default {
  components: {
    ExportConference,
    ImportantDateView
  },
  data() {
    return {
      dialog: false,
      exist: false,
      noExist: false,
      id: null,
      title: null,
      start_date: null,
      start_time: null,
      end_date: null,
      end_time: null,
      location: null,
      website: null,
      geo: null,
      link: null,
      description: null,
      logo: "",
      feedback: null,
      image: null,
      conference: {},
      importantDates: [],
      user: null,
      isObserved: false,
      observeText: "Obserwuj",
      isAccepted: false,
      acceptText: "Zaakceptuj",
      acceptColor: "green"
    };
  },
  created() {




    firebase.auth().onAuthStateChanged(user => {
      this.user = user
      if (user) {
        db.doc(`users/${user.uid}`)
          .collection("observed_conferences")
          .doc(this.id)
          .get()
          .then(docSnapshot => {
            if (docSnapshot.exists) {
              this.isObserved = true
              this.observeText = "Przestań obserwować"
            } else {
              this.isObserved = false
              this.observeText = "Obserwuj"
            }
          });
      }
    });

    this.id = this.$route.params.conference_id
    db.collection("conferences")
    .doc(this.$route.params.conference_id)
    .get()
    .then(doc => {
      if (doc.exists) {
        let data = doc.data()
        this.exist = true
        this.isAccepted = data.isAccepted
        this.title = data.title
        this.category_id = data.category_id
        this.website = data.website
        this.description = data.description;
        this.start_date = data.start_date.toDate()
        this.end_date = data.end_date.toDate()
        this.logo = data.logo
        this.geo = data.location
        this.isAccepted ? this.setIsNotAccepted() : this.setAccepted()
        axios.post(
            "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
              doc.data().location.latitude +
              "," +
              doc.data().location.longitude +
              "&key=AIzaSyDtYbZokAi1OVXplmLIpuxlJpppE0fijPA"
          )
          .then(response => {
            let address = response.data.results[0].formatted_address
            console.log(address)
            this.location = address
            const link = `https://maps.google.com/?q=${address}`
            this.link = link;
            this.conference.id = this.id
            this.conference.isAccepted = this.isAccepted
            this.conference.title = this.title
            this.conference.start_date = this.start_date.toISOString()
            this.conference.end_date = this.end_date.toISOString()
            this.conference.location = this.location
            this.conference.link = this.link
            // this.conference.description = this.description
            document.getElementById("description").innerHTML = this.description
            this.conference.logo = this.logo
            this.conference.geo = this.geo
          })
          .catch(e => {
            console.log(e)
          })


          db.collection("conferences")
          .doc(this.$route.params.conference_id)
          .collection('important_dates')
          .get()
          .then(querySnapshot => {
            if(!querySnapshot.empty){
              querySnapshot.forEach(doc => {
                let important_date = doc.data()
                important_date.location = this.location
                important_date.geo = this.geo
                important_date.id = this.id
                this.importantDates.push(important_date)
              })
            }
          })
          .catch(err => {
            console.log(err)
          })
        } else {
          this.noExist = true;
          console.log("Taka konferencja nie istenieje!")
        }
    });
  },
  methods: {

    setAccepted(){
      this.isAccepted = false;
      this.acceptText = "Zaakceptuj"
      this.acceptColor = "green"
    },

    setIsNotAccepted(){
      this.isAccepted = true;
      this.acceptText = "Anuluj akceptację"
      this.acceptColor = "red"
    },

    updateAccepted(){
      if (this.isAccepted) {
        db.collection("conferences").doc(this.id)
          .update({isAccepted: false})
          .then(() => {
            this.isAccepted = false;
            this.acceptText = "Zaakceptuj"
            this.acceptColor = "green"
          })
          .catch(err => {
            console.log(err);
          })
      } else {
        console.log('ssssss')
          db.collection("conferences").doc(this.id)
          .update({isAccepted: true})
            .then(() => {
              this.isAccepted = true;
              this.acceptText = "Anuluj akceptację"
              this.acceptColor = "red"
            })
            .catch(err => {
              console.log(err)
            })
      }
    },
    updateObserved() {
      if (this.isObserved) {
        //unfollow conference
        db.doc(`users/${this.user.uid}`)
          .collection("observed_conferences")
          .doc(this.id)
          .delete()
          .then(() => {
            this.isObserved = false;
            this.observeText = "Obserwuj"
          })
          .catch(err => {
            console.log(err)
          });
      } else {
        //follow conference
        if (this.user) {
          db.doc(`users/${this.user.uid}`)
            .collection("observed_conferences")
            .doc(this.id)
            .set({})
            .then(() => {
              this.isObserved = true
              this.observeText = "Przestań obserwować"
            })
            .catch(err => {
              console.log(err)
            });
        }
      }
    }
  }
};
</script>


<style>
</style>