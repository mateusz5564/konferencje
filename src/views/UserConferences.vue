<template>
  <v-container class="grey lighten-5">
    <v-progress-linear
      class="mb-4"
      :active="loading"
      :indeterminate="loading"
      color="blue accent-4"
    ></v-progress-linear>

    <h2 class="mb-3 subtitle-1 font-weight-black">Moje konferencje</h2>
    <v-row>
      <v-col
        v-for="(conference, index) in conferences"
        class="mb-5"
        :key="index"
        cols="12"
        xs="12"
        md="4"
        xl="3"
      >
        <ConferenceThumbnail :conference="conference">
          <div class="pb-4" slot="floating-btn">
            <v-btn
              fab
              color="blue accent-2"
              :to="{ name: 'edytuj_konferencje', params: { conference_id: conference.id } }"
              top
              right
              absolute
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </div>
        </ConferenceThumbnail>
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
    ConferenceThumbnail,
  },
  data() {
    return {
      conferences: [],
      loading: false,
    };
  },
  created() {
    let user = firebase.auth().currentUser;
    this.loading = true;
    db.collection("conferences")
      .where("user_id", "==", user.uid)
      .get()
      .then(async querySnapshot => {
        let docs = [];
        querySnapshot.forEach(doc => {
          let dataRef = doc.data();
          dataRef.id = doc.id;
          docs.push(dataRef);
        });

        for (let i in docs) {
          const geocoding = axios.post(
            "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
              docs[i].location.latitude +
              "," +
              docs[i].location.longitude +
              "&key=" + process.env.VUE_APP_GEOCODING_KEY
          );
          let result = await geocoding;
          docs[i].address = result.data.results[0].formatted_address;
          const link = `https://maps.google.com/?q=${docs[i].location.latitude},${docs[i].location.longitude}`;
          docs[i].link = link;
        }
        this.conferences = docs;
        this.loading = false;
      });
    this.loading = false;
  },
};
</script>
