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
  props: ["conference"],
  data(){
    return {
      
    }
  },
  methods: {
    addToGoogleCalendar(){
      console.log(this.conference)
      // const link = `https://calendar.google.com/calendar/r/eventedit?location=${event.location}&text=${event.title}&dates=${event.start}/${event.end}&details=${event.description}`
      let start = new Date(this.conference.start_date)
      let end = new Date(this.conference.end_date)

      let startString = start.toISOString().replace(/-|:|/g, '').substring(0, 15) + 'Z'
      let endString = end.toISOString().replace(/-|:|/g, '').substring(0, 15) + 'Z'

      const link = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${this.conference.title}&dates=${startString}/${endString}&details=${this.conference.description}`
      window.open(link, '_blank')
    },
    downloadIcsFile() {
      var blob = new Blob(
        [
`BEGIN:VCALENDAR
VERSION:2.0
METHOD:PUBLISH
BEGIN:VEVENT
SUMMARY:${this.conference.title}
DTSTART:${this.conference.start_date}
DTEND:${this.conference.end_date}
LOCATION:${this.conference.location}
GEO:${this.conference.geo.latitude};${this.conference.geo.longitude}
DESCRIPTION: Więcej informacji: http://localhost:8080/#/konferencja/${this.conference.id}
URL:http://localhost:8080/#/konferencja/${this.conference.id}
END:VEVENT
END:VCALENDAR
`
        ],
        { type: "text/plain;charset=utf-8" }
      );

      const filename = this.conference.title + ".ics"
      saveAs(blob, filename);
    }
  }
}
</script>