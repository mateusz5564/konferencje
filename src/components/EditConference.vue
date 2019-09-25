<template>
  <div class="edit_conference">
    <v-card class="register__card pa-5" max-width="800px">
      <v-card-title class="justify-center">
        <h2>Edytuj konferencje</h2>
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="">
          <v-textarea v-model="title" auto-grow label="Tytuł" rows="1"></v-textarea>
          <v-textarea v-model="description" auto-grow label="Opis" rows="1"></v-textarea>

          <!-- <v-text-field type="text" label="Lokalizacja" prepend-icon="mdi-map-marker" v-model="location"></v-text-field> -->
          <v-autocomplete
            label="Lokalizacja"
            prepend-icon="mdi-map-marker"
            v-model="select"
            :loading="loading"
            :items="items"
            :search-input.sync="search"
            :return-object=true
            item-text="name"
            cache-items
            class="mx-4"
            flat
            hide-no-data
            hide-details
            clearable
            append-icon="mdi-map-search-outline"
          ></v-autocomplete>

          <v-row>
            <!-- START DATE AND TIME PICKERS -->
            <v-col cols="12" sm="6">
              <v-menu
                ref="start_date_menu"
                v-model="start_date_menu"
                :close-on-content-click="false"
                :return-value.sync="start_date"
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="start_date"
                    label="Data rozpoczęcia"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="start_date" no-title scrollable>
                  <div class="flex-grow-1"></div>
                  <v-btn text color="primary" @click="start_date_menu = false">Cancel</v-btn>
                  <v-btn text color="primary" @click="$refs.start_date_menu.save(start_date)">OK</v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>

            <!-- START TIME PICKER -->
            <v-col cols="12" sm="6">
              <v-menu
                ref="start_time_menu"
                v-model="start_time_menu"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="start_time"
                transition="scale-transition"
                offset-y
                full-width
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="start_time"
                    label="Godzina rozpoczęcia"
                    prepend-icon="mdi-clock-outline"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-if="start_time_menu"
                  v-model="start_time"
                  format="24hr"
                  full-width
                  @click:minute="$refs.start_time_menu.save(start_time)"
                ></v-time-picker>
              </v-menu>
            </v-col>
          </v-row>

          <!-- END DATE AND TIME PICKERS -->
          <v-row>
            <v-col cols="12" sm="6">
              <v-menu
                ref="end_date_menu"
                v-model="end_date_menu"
                :close-on-content-click="false"
                :return-value.sync="end_date"
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="end_date"
                    label="Data zakończenia"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="end_date" no-title scrollable>
                  <div class="flex-grow-1"></div>
                  <v-btn text color="primary" @click="end_date_menu = false">Cancel</v-btn>
                  <v-btn text color="primary" @click="$refs.end_date_menu.save(end_date)">OK</v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>

            <!-- END TIME PICKER -->
            <v-col cols="12" sm="6">
              <v-menu
                ref="end_time_menu"
                v-model="end_time_menu"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="end_time"
                transition="scale-transition"
                offset-y
                full-width
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="end_time"
                    label="Godzina zakończenia"
                    prepend-icon="mdi-clock-outline"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-if="end_time_menu"
                  v-model="end_time"
                  format="24hr"
                  full-width
                  @click:minute="$refs.end_time_menu.save(end_time)"
                ></v-time-picker>
              </v-menu>
            </v-col>
          </v-row>

          <v-file-input
            show-size
            label="Wybierz logo"
            prepend-icon="mdi-camera"
            v-model="image"
          ></v-file-input>

          <p id="feedback" style="font-size: 30px; color: red;">{{ feedback }}</p>
          <v-btn class="ma-3" type="submit" color="blue" large dark>Dodaj konferencje</v-btn>
          <br />
          <br />
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: null,
      start_date: null,
      start_time: null,
      end_date: null,
      end_time: null,
      location: null,
      description: null,
      logo: null,
      feedback: null,
      modal: true,
      start_date_menu: false,
      end_date_menu: false,
      start_time_menu: false,
      end_time_menu: false,
      image: null,
      loading: false,
      items: [],
      search: null,
      select: null,
      candidates: []
    }
  }
}
</script>

<style>

</style>