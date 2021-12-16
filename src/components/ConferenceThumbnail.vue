<template>
  <div class="conference_thumbnail">
    <v-card class="mx-auto">
      <slot name="floating-btn"></slot>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title font-weight-regular mt-2">{{conference.title}}</v-list-item-title>
          <p class="pb-2 caption">
            {{conference.start_date.toDate() | dateFilter}}
            <span v-if="notOneDay">- {{conference.end_date.toDate() | dateFilter}}</span>
          </p>
          <v-divider class="blue lighten-1"></v-divider>
          <div class="location d-flex pt-2 pb-2 caption font-weight-medium grey--text">
            <div class="location__icon">
              <v-icon>mdi-map-marker</v-icon>
            </div>
            <div class="d-flex flex-column ml-1">
              <div class="location__name">{{ conference.address }}</div>
              <div class="location__link">
                <a
                  class="font-weight-medium"
                  :href="conference.link"
                  target="_blank"
                >zobacz na mapie</a>
              </div>
            </div>
          </div>
        </v-list-item-content>
      </v-list-item>

      <v-img :src="conference.logo" aspect-ratio="16/9" height="200"></v-img>

      <v-card-actions>
        <div class="flex-grow-1"></div>
        <v-btn
          text
          :to="{name: 'konferencja', params: { conference_id: conference.id}}"
          color="blue accent-4"
        >więcej informacji</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  props: ["conference"],
  data() {
    return {
      notOneDay: true
    };
  },
  created() {
    let start_date = this.conference.start_date.toDate();
    let end_date = this.conference.end_date.toDate();
    if (start_date.toISOString().substring(0, 10) == end_date.toISOString().substring(0, 10)) {
      this.notOneDay = false;
    }
  }
};
</script>

<style>
.location {
  height: 60px;
}
</style>