<template>
  <div class="calendar_view mt-1">
    <v-container class="grey lighten-5">
    <v-row class="fill-height elevation-5">
      <v-col>
        <v-sheet height="65">
          <v-toolbar flat>
            <v-btn outlined class="mr-4" @click="setToday">Dzisiaj</v-btn>

            <v-btn fab text small @click="prev">
              <v-icon small>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn fab text small @click="next">
              <v-icon small>mdi-chevron-right</v-icon>
            </v-btn>
            <v-toolbar-title>{{ title }}</v-toolbar-title>
            <div class="flex-grow-1"></div>

            
            <v-menu bottom right>
              <template v-slot:activator="{ on }">
                <v-btn outlined v-on="on">
                  <span>{{ typeToLabel[type] }}</span>
                  <v-icon right>mdi-menu-down</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="type = 'day'">
                  <v-list-item-title>Dzień</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'week'">
                  <v-list-item-title>Tydzień</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'month'">
                  <v-list-item-title>Miesiąc</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = '4day'">
                  <v-list-item-title>4 dni</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar>
        </v-sheet>

        <v-sheet height="75vh">
          <v-calendar
          
            ref="calendar"
            v-model="focus"
            color="primary"
            :events="events"
            :event-color="getEventColor"
            :event-margin-bottom="3"
            :now="today"
            :type="type"
            @click:event="showEvent"
            @click:more="viewDay"
            @click:date="viewDay"
            @change="updateRange"
          ></v-calendar>
          <v-menu
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            full-width
            offset-x
          >
            <v-card color="grey lighten-4" max-width="400px" flat>
              <CalendarThumbnail :conference="selectedEvent"> 
                <div slot="close-btn">
                  <v-btn text icon color="blue" @click.stop="dialog = true"> 
                    <v-icon>mdi-calendar-plus</v-icon>
                  </v-btn>
                  <v-btn class="ml-4" text icon @click="selectedOpen = false"> 
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </div>

              </CalendarThumbnail>
              <!-- <v-card-actions>
                <v-btn text color="secondary" @click="selectedOpen = false">Zamknij</v-btn>
              </v-card-actions> -->
            </v-card>

            <v-dialog v-model="dialog" max-width="350px">
              <ExportConference :conference="conference"/>
            </v-dialog>
          
          </v-menu>
        </v-sheet>
      </v-col>
    </v-row>
    </v-container>
  </div>
</template>

<script>
import CalendarThumbnail from '@/components/CalendarThumbnail.vue'
import ExportConference from '@/components/ExportConference.vue'
import db from '@/firebase/init'
import firebase from 'firebase'
import axios from 'axios'


  export default {
    components: {
      CalendarThumbnail,
      ExportConference
    },
    data: () => ({
      dialog: false,
      today: '2019-10-07',
      focus: '2019-10-07',
      type: 'month',
      typeToLabel: {
        month: 'Miesiąc',
        week: 'Tydzień',
        day: 'Dzień',
        '4day': '4 Dni',
      },
      start: null,
      end: null,
      conference: {},
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
    }),
    computed: {
      title () {
        const { start, end } = this
        if (!start || !end) {
          return ''
        }

        const startMonth = this.monthFormatter(start)
        const endMonth = this.monthFormatter(end)
        const suffixMonth = startMonth === endMonth ? '' : endMonth

        const startYear = start.year
        const endYear = end.year
        const suffixYear = startYear === endYear ? '' : endYear

        const startDay = start.day
        const endDay = end.day 

        switch (this.type) {
          case 'month':
            return `${startMonth} ${startYear}`
          case 'week':
          case '4day':
            if(startYear !== endYear){
              return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`
            } else
            return `${startMonth} ${startDay} - ${endDay} ${suffixMonth} ${startYear} ${suffixYear}`
          case 'day':
            return `${startMonth} ${startDay} ${startYear}`
        }
        return ''
      },
      monthFormatter () {
        return this.$refs.calendar.getFormatter({
          timeZone: 'UTC', month: 'long',
        })
      },
    },
    mounted () {
      this.$refs.calendar.checkChange()
    },
    methods: {
      addToGoogleCalendar(event){
        console.log(event)
        // const link = `https://calendar.google.com/calendar/r/eventedit?location=${event.location}&text=${event.title}&dates=${event.start}/${event.end}&details=${event.description}`
        let start = new Date(event.start)
        let end = new Date(event.end)

        let startString = start.toISOString().replace(/-|:|/g, '').substring(0, 15) + 'Z'
        let endString = end.toISOString().replace(/-|:|/g, '').substring(0, 15) + 'Z'

        const link = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${event.title}&dates=${startString}/${endString}&details=${event.description}`
        window.open(link, '_blank')
      },
      convertedStartDate(timestamp){
        const date = new Date(timestamp.seconds*1000)
        return date.toISOString().substring(0,16)
      },
      convertedEndDate(timestamp){
        const date = new Date(timestamp.seconds*1000)
        return date.toISOString().substring(0,16)
      },
      viewDay ({ date }) {
        this.focus = date
        this.type = 'day'
      },
      getEventColor (event) {
        return event.color
      },
      setToday () {
        this.focus = this.today
      },
      prev () {
        this.$refs.calendar.prev()
      },
      next () {
        this.$refs.calendar.next()
      },
      showEvent ({ nativeEvent, event }) {
        const open = () => {
          this.selectedEvent = event
          this.conference.id = event.id
          this.conference.title = event.title
          this.conference.start_date = new Date(event.start_date.seconds *1000).toISOString()
          this.conference.end_date = new Date(event.end_date.seconds *1000).toISOString()
          this.conference.location = event.location
          this.conference.link = event.link
          this.conference.description = event.description
          this.conference.logo = event.logo
          this.selectedElement = nativeEvent.target
          setTimeout(() => this.selectedOpen = true, 10)
        }

        if (this.selectedOpen) {
          this.selectedOpen = false
          setTimeout(open, 10)
        } else {
          open()
        }

        nativeEvent.stopPropagation()
      },
      updateRange ({ start, end }) {
        // You could load events from an outside source (like database) now that we have the start and end dates on the calendar
        this.start = start
        this.end = end
      },
    },
    created(){
      this.today = new Date().toISOString().slice(0, 10)
     db.collection('conferences')
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
             axios.post('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + doc.data().location.latitude + ',' + doc.data().location.longitude + '&key=AIzaSyDtYbZokAi1OVXplmLIpuxlJpppE0fijPA')
              .then(response => {
                let address = response.data.results[0].formatted_address
                let dataRef = doc.data()
                dataRef.id = doc.id
                dataRef.location = address
                const link = `https://maps.google.com/?q=${address}`
                dataRef.link = link
                dataRef.name = dataRef.title
                dataRef.details = "szczegoly"
                dataRef.start = this.convertedStartDate(doc.data().start_date)
                dataRef.end = this.convertedStartDate(doc.data().end_date)
                dataRef.color = 'blue'
                this.events.push(dataRef)
              })
              .catch(e => {
                console.log(e)
            })
          })
        })
  }
  }
</script>

<style>
  a {
    text-decoration: none;
  }
</style>