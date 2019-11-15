<template>
   <v-card
    class="mx-auto"
    max-width="350"
    tile
  >
    <v-list flat>
      <v-subheader class="title text-center">Dodaj do kalendarza</v-subheader>
      <v-divider></v-divider>
      <v-list-item-group exact>
        <v-list-item @click="addToGoogleCalendar">
          <v-list-item-icon>
            <v-icon>mdi-google</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Google Calendar</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="downloadIcsFile">
          <v-list-item-icon>
            <v-icon>mdi-calendar-multiple</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>iCalendar</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-card>

</template>

<script>
export default {
  props: ["importantDate"],
  data(){
    return {
      
    }
  },
  methods: {
    addToGoogleCalendar(){ 
      console.log(this.importantDate.important_date)
      let important_date = new Date(this.importantDate.important_date.seconds*1000)
      let important_dateString = important_date.toISOString().replace(/-|:|/g, '').substring(0, 15) + 'Z'


      const link = `https://calendar.google.com/calendar/r/eventedit?location=${encodeURIComponent(this.importantDate.location)}
      &text=${encodeURIComponent(this.importantDate.name)}&dates=${important_dateString}/${important_dateString}&details=${encodeURIComponent("Więcej informacji: http://localhost:8080/#/konferencja/")}${this.importantDate.id}`
      
      window.open(link, '_blank')
    },
    downloadIcsFile() {
      let important_date = new Date(this.importantDate.important_date.seconds*1000)
      var blob = new Blob(
        [
`BEGIN:VCALENDAR
VERSION:2.0
METHOD:PUBLISH
BEGIN:VEVENT
SUMMARY:${this.importantDate.name}
DTSTART:${important_date.toISOString()}
DTEND:${important_date.toISOString()}
LOCATION:${this.importantDate.location}
GEO:${this.importantDate.geo.latitude};${this.importantDate.geo.longitude}
DESCRIPTION: Więcej informacji: http://localhost:8080/#/konferencja/${this.importantDate.id}
URL:http://localhost:8080/#/konferencja/${this.importantDate.id}
END:VEVENT
END:VCALENDAR
`
        ],
        { type: "text/plain;charset=utf-8" }
      );

      const filename = this.importantDate.name + ".ics"
      saveAs(blob, filename);
    }
  }
}
</script>