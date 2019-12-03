<template>
  <v-container class="grey lighten-5">
    <v-progress-linear
      class="mb-4"
      :active="loading"
      :indeterminate="loading"
      color="blue accent-4"
    ></v-progress-linear>

    <div class="d-flex justify-space-between">
      <h2 class="mb-3 subtitle-1 font-weight-black">Obserwowane konferencje</h2>
    </div>

    <v-row>
      <v-col
        v-for="(conference, index) in conferences"
        :key="index"
        cols="12"
        xs="12"
        md="4"
        xl="3"
      >
        <ConferenceThumbnail :conference="conference" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ConferenceThumbnail from "@/components/ConferenceThumbnail.vue";
import db from "@/firebase/init";
import firebase from "firebase";
import axios from "axios";

export default {
  components: {
    ConferenceThumbnail
  },
  data() {
    return {
      conferences: [],
      loading: true
    };
  },
  created() {
    this.getConferences();
  },
  methods: {
    getConferences() {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
        db.doc(`users/${user.uid}`)
          .collection("observed_conferences")
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              db.collection("conferences")
                .doc(doc.id)
                .get()
                .then(async querySnapshot => {
                  let dataRef = querySnapshot.data();
                  dataRef.id = doc.id;
                  const test = axios.post(
                    "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
                      dataRef.location.latitude +
                      "," +
                      dataRef.location.longitude +
                      "&key=AIzaSyDtYbZokAi1OVXplmLIpuxlJpppE0fijPA"
                  );
                  let result = await test;
                  dataRef.address = result.data.results[0].formatted_address;
                  // const link = `https://maps.google.com/?q=${address}`
                  const link = `https://maps.google.com/?q=${
                    querySnapshot.data().location.latitude
                  },${dataRef.location.longitude}`;
                  dataRef.link = link;
                  this.conferences.push(dataRef);
                  this.loading = false;
                });
            });
          });
        }
      });
      this.loading = false;
    }
  }
};
</script>