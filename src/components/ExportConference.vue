<template>
  <div class="export-calendar">
    <v-btn text icon color="orange" @click="addToGoogleCalendar"> 
      <v-icon>mdi-calendar-plus</v-icon>
    </v-btn>
    <v-btn @click="downloadIcsFile">CLICK</v-btn>
  </div>
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
DTSTART:${this.conference.start_date}
DTEND:${this.conference.end_date}
LOCATION:${this.conference.location}
TRANSP:OPAQUE
SEQUENCE:0
UID:
DTSTAMP:20191023T133357Z
SUMMARY:${this.conference.title}
DESCRIPTION:${this.conference.description} <br><br> Strona konferencji: http://localhost:8080/#/konferencje/${this.conference.id}
URL:http://localhost:8080/#/konferencje/${this.conference.id}
PRIORITY:1
CLASS:PUBLIC
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