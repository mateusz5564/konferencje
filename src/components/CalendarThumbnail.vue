<template>
  <div class="conference_thumbnail">
    
    <v-card class="mx-auto" >
      <v-list-item>
        <v-list-item-content>
          <div class="d-flex justify-end">
            <slot name="close-btn"></slot>
          </div>
          <h2 class="headline font-weight-medium pb-1">{{conference.title}}</h2>
          <p class="pb-2 caption">{{conference.start_date.toDate() | dateFilter}} - {{conference.end_date.toDate() | dateFilter}}</p>
          <v-divider class="blue lighten-1"></v-divider>
          <div class="location d-flex pt-2 pb-2 caption font-weight-medium grey--text">
            <div class="location__icon">
              <v-icon>mdi-map-marker</v-icon>
            </div>
              <div class="d-flex flex-column ml-1">
                <div class="location__name">
                {{ conference.location }}
                </div>
                <div class="location__link">
                  <a class="font-weight-medium" :href="conference.link" target="_blank">zobacz na mapie</a>
                </div>
              </div>
          </div>
        </v-list-item-content>
      </v-list-item>

      <v-card-actions>
        <div class="flex-grow-1"></div>
        <v-btn text :href="link" target="_blank" color="blue accent-4">więcej informacji</v-btn>
        {{generateLink}}
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  props: ["conference"],
  data() {
    return {
      link: null,
    }
  },
  created(){
    this.link = `/#/konferencja/${this.conference.id}`
  },
  beforeUpdate(){
    this.link = `/#/konferencja/${this.conference.id}`
  }
}
</script>

<style>
</style>