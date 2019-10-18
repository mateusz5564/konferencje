<template>
  <div class="conference_thumbnail">
    
    <v-card class="mx-auto" >
      <v-list-item>
        <v-list-item-content>
          <div class="d-flex justify-end">
            <slot name="close-btn"></slot>
          </div>
          <h2 class="headline font-weight-medium pb-4">{{conference.title}}</h2>
          <p class="pb-2">{{conference.start_date.toDate() | dateFilter}} - {{conference.end_date.toDate() | dateFilter}}</p>
          <v-divider class="blue lighten-1"></v-divider>
          <div class="pt-2 pb-2 body-1 font-weight-medium">
            <v-icon>mdi-map-marker</v-icon>
            {{ conference.location }}
            <v-spacer></v-spacer>
            <a :href="conference.link" target="_blank">zobacz na mapie</a>
          </div>
        </v-list-item-content>
      </v-list-item>

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