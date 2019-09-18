<template>
  <v-container class="grey lighten-5">
    <h2 class="mb-6 headline font-weight-black" >Lista konferencji</h2>
    <v-row>
      <v-col v-for="n in 6" :key="n" cols="12" xs="12" md="6" xl="4">
        <v-card class="mx-auto">
          <v-list-item>
            <v-list-item-content>
              <h2 class="headline font-weight-medium pb-4 pt-4">14th FEDERATED CONFERENCE ON COMPUTER SCIENCE AND INFORMATION SYSTEMS</h2>
              <p class="pb-2 headline">24 września - 26 września</p>
              <v-divider class="blue lighten-1"></v-divider>
              <div class="pt-2 pb-2 body-1 font-weight-medium">
              <v-icon>mdi-map-marker</v-icon> Kraków, Tauron Arena
              </div>
            </v-list-item-content>
          </v-list-item>

          <v-img src="https://cdn.vuetifyjs.com/images/cards/mountain.jpg" height="294"></v-img>

          <v-card-text class="headline mb-5">
            <div class="text--primary">
              The mission of the FedCSIS Conference Series is to provide a presentation, discussion and a reputable publication forum in computer science and information systems. The forum invites researchers and practitioners from around the world to contribute their research results focused on their scientific and professional interests in a chosen conference track.

              The FedCSIS conference consists of Tracks divided into Technical Sessions. Sessions are preannounced in a Call for Papers and refer to a significant number of recurring events. Each year, new events are solicited in Calls for Technical Sessions. Technical sessions can accentuate special formats of events (symposia, workshops, seminars, focussed conferences, etc.) reflecting the common interests of research or professional communities proposing the sessions.
            </div>
          </v-card-text>

          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn text color="blue accent-4">więcej informacji</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  components: {}
};
</script>
