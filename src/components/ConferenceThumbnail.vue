<template>
  <div class="conference_thumbnail">
    <v-card class="mx-auto" >
      <slot name="floating-btn"></slot>
    
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title font-weight-regular mt-2">{{conference.title}}</v-list-item-title>
          <p class="pb-2 body-2">{{conference.start_date.toDate() | dateFilter}} - {{conference.end_date.toDate() | dateFilter}}</p>
          <v-divider class="blue lighten-1"></v-divider>
          <div class="pt-2 pb-2 body-2 font-weight-medium grey--text">
            <v-icon>mdi-map-marker</v-icon>
            {{ conference.location }}
            <v-spacer></v-spacer>
            <a class="body-2" :href="conference.link" target="_blank">zobacz na mapie</a>
          </div>
        </v-list-item-content>
      </v-list-item>

      <v-img :src="conference.logo" height="200"></v-img>

      <!-- <v-card-text class="headline mb-5">
        <div class="text--primary">{{conference.description}}</div>
      </v-card-text>-->

      <v-card-actions>
        <div class="flex-grow-1"></div>
        <v-btn text color="blue accent-4">więcej informacji</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  props: ["conference"],
  data() {
    return {};
  }
};
</script>

<style>

</style>