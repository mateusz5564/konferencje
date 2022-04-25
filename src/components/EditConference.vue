<template>
  <div class="edit_conference">
    <v-card class="register__card pa-5" max-width="900px">
      <v-card-title class="justify-center">
        <h3 class="mb-5 headline">Edycja konferencji</h3>
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="updateConference" ref="edit_form">
          <v-textarea
            v-model="title"
            outlined
            auto-grow
            label="Tytuł"
            rows="1"
            :rules="[rules.required]"
          ></v-textarea>
          <v-autocomplete
            v-model="selectedCategory"
            :items="categories"
            label="Kategoria"
            outlined
            :rules="[rules.required]"
          ></v-autocomplete>

          <div class="editor mb-8">
            <ckeditor :editor="editor" :config="editorConfig" v-model="editorData"></ckeditor>
          </div>

          <v-text-field
            v-model="website"
            :rules="[rules.www]"
            label="Adres WWW"
            outlined
            hint="adres URL musi rozpoczynać się od https:// np. https://www.google.pl/"
          ></v-text-field>

          <h2 class="mt-4">Lokalizacja</h2>
          <div class="pt-2 pb-2 mb-2 body-1 font-weight-medium">
            <v-icon>mdi-map-marker</v-icon>
            {{ location }}
            <v-spacer></v-spacer>
            <a :href="location_link" target="_blank">zobacz na mapie</a>
          </div>

          <v-autocomplete
            label="Wybierz nową lokalizację"
            v-model="select"
            :loading="loading"
            :items="items"
            :search-input.sync="search"
            :return-object="true"
            item-text="name"
            no-filter
            flat
            hide-no-data
            hide-details
            clearable
            append-icon
            outlined
            prepend-inner-icon="mdi-map-search-outline"
          ></v-autocomplete>

          <h2 class="mt-10">Data rozpoczęcia</h2>
          <v-row class="mt-2">
            <!-- START DATE PICKER -->
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
                    prepend-inner-icon="mdi-calendar"
                    readonly
                    outlined
                    v-on="on"
                    :rules="[rules.required]"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="start_date" no-title scrollable>
                  <div class="flex-grow-1"></div>
                  <v-btn text color="primary" @click="start_date_menu = false">Cancel</v-btn>
                  <v-btn text color="primary" @click="$refs.start_date_menu.save(start_date)"
                    >OK</v-btn
                  >
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
                    prepend-inner-icon="mdi-clock-outline"
                    readonly
                    outlined
                    v-on="on"
                    :rules="[rules.required]"
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

          <h2 class>Data zakończenia</h2>
          <v-row class="mt-2">
            <!-- END DATE PICKER -->
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
                    prepend-inner-icon="mdi-calendar"
                    readonly
                    outlined
                    v-on="on"
                    :rules="[rules.required]"
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
                    prepend-inner-icon="mdi-clock-outline"
                    readonly
                    outlined
                    v-on="on"
                    :rules="[rules.required]"
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

          <h2 class="mt-5 mb-5">Aktualne logo</h2>
          <v-img class="elevation-3 mb-6" :src="logo" max-width="100%" height="auto"></v-img>

          <v-file-input
            show-size
            label="Wybierz nowe logo"
            prepend-inner-icon="mdi-camera"
            prepend-icon
            outlined
            v-model="image"
          ></v-file-input>

          <v-card max-width="840" class="mx-auto mb-10">
            <h3 class="elevation-1 pt-4 pb-4 title font-weight-regular text-center mb-3">
              Ważne terminy
            </h3>

            <div v-for="(date, index) in importantDates" :key="index">
              <ImportantDate :importantDate="date">
                <div slot="number">{{ index + 1 }}</div>
                <div slot="delete-btn">
                  <v-icon @click="deleteImportantDate(index)" color="darken-2">mdi-delete</v-icon>
                </div>
              </ImportantDate>
            </div>

            <v-card class="pt-5 elevation-1">
              <div class="ml-4 mt-4 mr-4 pt-4">
                <v-text-field v-model="id_name" label="Nazwa" outlined></v-text-field>

                <v-menu
                  ref="id_date_menu"
                  v-model="id_date_menu"
                  :close-on-content-click="false"
                  :return-value.sync="id_date"
                  transition="scale-transition"
                  offset-y
                  full-width
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      class="test2"
                      v-model="id_date"
                      label="Data"
                      prepend-inner-icon="mdi-calendar"
                      readonly
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="id_date" no-title scrollable>
                    <div class="flex-grow-1"></div>
                    <v-btn text color="primary" @click="id_date_menu = false">Cancel</v-btn>
                    <v-btn text color="primary" @click="$refs.id_date_menu.save(id_date)">OK</v-btn>
                  </v-date-picker>
                </v-menu>
              </div>
              <v-card-actions>
                <v-btn @click="addImportantDate" text class="mb-5" color="blue accent-4">
                  <v-icon dark left>mdi-plus</v-icon>Dodaj termin
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-card>

          <p id="feedback" style="font-size: 30px; color: red;">{{ feedback }}</p>
          <v-btn class="ma-3" type="submit" color="blue" large dark>Zapisz konferencje</v-btn>
          <br />
          <br />
        </v-form>
      </v-card-text>
    </v-card>

    <v-snackbar v-model="snackbar" :color="color" top :timeout="timeout">
      <div>
        <v-icon class="mr-2">{{ icon }}</v-icon>
        {{ text }}
      </div>
      <v-btn text @click="snackbar = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import db from "@/firebase/init";
import firebase from "firebase";
import axios from "axios";
import ImportantDate from "@/components/ImportantDate";
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import pl from "@ckeditor/ckeditor5-build-classic/build/translations/pl.js";

export default {
  components: {
    ImportantDate,
    ckeditor: CKEditor.component,
  },
  data() {
    return {
      id: null,
      title: null,
      start_date: null,
      start_time: null,
      id_name: null,
      id_date: null,
      end_date: null,
      end_time: null,
      location: null,
      location_link: null,
      description: null,
      logo: "",
      feedback: null,
      modal: true,
      id_date_menu: false,
      start_date_menu: false,
      end_date_menu: false,
      start_time_menu: false,
      end_time_menu: false,
      image: null,
      loading: false,
      items: [],
      search: null,
      select: null,
      candidates: [],
      selectedCategory: null,
      categories: [],
      website: null,
      isAccepted: false,
      importantDates: [],
      editor: ClassicEditor,
      editorData: null,
      editorConfig: {
        language: {
          ui: "pl",
          content: "pl",
        },
        placeholder: "Opis konferencji",
      },
      rules: {
        required: value => !!value || "pole wymagane",
        counter: value => value.length <= 100 || "maksymalnie 100 znaków",
        www: value => {
          const pattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
          return (
            pattern.test(value) ||
            "adres URL musi rozpoczynać się od https:// np. https://www.google.pl/"
          );
        },
      },
      snackbar: false,
      color: "",
      icon: "",
      text: "",
      timeout: 5000,
    };
  },
  created() {
    this.id = this.$route.params.conference_id;
    let ref = db.collection("conferences").doc(this.$route.params.conference_id);
    this.getCategories();
    ref.get().then(doc => {
      if (doc.exists) {
        let data = doc.data();
        this.title = data.title;
        this.selectedCategory = data.category_id;
        this.website = data.website;
        this.editorData = data.description;
        this.convertedStartDate(data.start_date);
        this.convertedEndDate(data.end_date);
        this.logo = data.logo;
        axios
          .post(
            "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
              doc.data().location.latitude +
              "," +
              doc.data().location.longitude +
              "&key=" +
              process.env.VUE_APP_GEOCODING_KEY
          )
          .then(response => {
            let address = response.data.results[0].formatted_address;
            this.location = address;
            const link = `https://maps.google.com/?q=${address}`;
            this.location_link = link;
          })
          .catch(e => {
            console.log(e);
          });

        db.collection("conferences")
          .doc(this.$route.params.conference_id)
          .collection("important_dates")
          .get()
          .then(querySnapshot => {
            if (!querySnapshot.empty) {
              querySnapshot.forEach(doc => {
                let important_date = doc.data();
                const date = new Date(doc.data().important_date.seconds * 1000);
                important_date.deadline = date.toISOString().substring(0, 10);
                important_date.id = this.id;
                this.importantDates.push(important_date);
              });
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        console.log("Taka konferencja nie istenieje!");
      }
    });
  },
  watch: {
    search(val) {
      val && val !== this.select && this.querySelections(val);
    },
  },
  computed: {
    preparedStartDate() {
      const date = new Date(this.start_date);
      if (typeof this.start_time === "string") {
        let hours = this.start_time.match(/^(\d+)/)[1];
        let minutes = this.start_time.match(/:(\d+)/)[1];
        date.setHours(hours);
        date.setMinutes(minutes);
      } else {
        date.setHours(this.start_time.getHours());
        date.setMinutes(this.start_time.getMinutes());
      }
      return date;
    },
    preparedEndDate() {
      const date = new Date(this.end_date);
      if (typeof this.end_time === "string") {
        let hours = this.end_time.match(/^(\d+)/)[1];
        let minutes = this.end_time.match(/:(\d+)/)[1];
        date.setHours(hours);
        date.setMinutes(minutes);
      } else {
        date.setHours(this.end_time.getHours());
        date.setMinutes(this.end_time.getMinutes());
      }
      return date;
    },
  },
  methods: {
    convertedStartDate(timestamp) {
      const date = new Date(timestamp.seconds * 1000);
      this.start_date = date.toISOString().substring(0, 10);
      this.start_time = date.toISOString().substring(11, 16);
    },
    convertedEndDate(timestamp) {
      const date = new Date(timestamp.seconds * 1000);
      this.end_date = date.toISOString().substring(0, 10);
      this.end_time = date.toISOString().substring(11, 16);
    },
    //update data
    updateConference() {
      if (this.$refs.edit_form.validate()) {
        const conf = {};
        if (this.title != null && this.title !== "") {
          conf.title = this.title;
        }

        if (this.selectedCategory) {
          conf.category_id = this.selectedCategory;
        }

        if (this.website) {
          conf.website = this.website;
        }

        if (this.editorData) {
          conf.description = this.editorData;
        }

        if (this.select !== null) {
          const latitude = this.select.geometry.location.lat();
          const longitude = this.select.geometry.location.lng();
          const geopoint = new firebase.firestore.GeoPoint(latitude, longitude);
          conf.location = geopoint;
        }

        if (this.start_date !== null) {
          conf.start_date = this.preparedStartDate;
        }

        if (this.end_date !== null) {
          conf.end_date = this.preparedEndDate;
        }

        if (this.$admin) {
          this.isAccepted = true;
        }

        conf.isAccepted = this.isAccepted;

        if (!this.isEmpty(conf)) {
          db.collection("conferences")
            .doc(this.id)
            .update(conf)
            .then(response => {
              this.setSnackbar("success", "Zaaktualizowano konferencje");
              // if (this.image == null) {
              db.collection("conferences")
                .doc(this.$route.params.conference_id)
                .collection("important_dates")
                .get()
                .then(querySnapshot => {
                  if (!querySnapshot.empty) {
                    querySnapshot.forEach(doc => {
                      db.collection("conferences")
                        .doc(this.$route.params.conference_id)
                        .collection("important_dates")
                        .doc(doc.id)
                        .delete();
                    });
                  }
                  for (let i in this.importantDates) {
                    db.collection("conferences")
                      .doc(this.id)
                      .collection("important_dates")
                      .add({
                        name: this.importantDates[i].name,
                        important_date: new Date(this.importantDates[i].deadline),
                      })
                      .then(response => {
                        console.log("zaaktualizowano konferencje");
                        this.$router.push({
                          name: "konferencja",
                          params: { conference_id: this.id },
                        });
                      })
                      .catch(err => {
                        console.log(err);
                      });
                  }
                })
                .catch(err => {
                  console.log(err);
                });
              // }
            })
            .catch(err => {
              this.setSnackbar("error", "Nie udało się zaaktualizować!");
              console.log(err);
            });
        }

        //update logo
        if (this.image !== null) {
          const filename = this.image.name;
          const extention = filename.substring(filename.lastIndexOf("."), filename.length);

          firebase
            .storage()
            .refFromURL(this.logo)
            .delete()
            .then(() => {
              console.log("usunieto obecne logo");
              firebase
                .storage()
                .ref("conferences/" + this.id + extention)
                .put(this.image)
                .then(response => {
                  response.ref.getDownloadURL().then(downloadURL => {
                    db.collection("conferences")
                      .doc(this.id)
                      .update({ logo: downloadURL })
                      .then(response => {
                        console.log("pomyslnie edytowano konferencje");
                        this.$router.push({
                          name: "konferencja",
                          params: { conference_id: this.id },
                        });
                      });
                  });
                });
            })
            .catch(err => {
              console.log(err);
            });
        }
      }
    },
    isEmpty(obj) {
      for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          return false;
        }
      }
      return JSON.stringify(obj) === JSON.stringify({});
    },
    querySelections(v) {
      this.loading = true;
      const service = new google.maps.places.PlacesService(document.createElement("div"));

      service.textSearch(
        { query: v, fields: ["name", "geometry", "formatted_address"] },
        (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            this.items = results;
            this.items.forEach(item => {
              item.name = `${item.name}, ${item.formatted_address}`;
            });
          }
        }
      );
      this.loading = false;
    },
    getCategories() {
      db.collection("categories")
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            this.categories.push(doc.id);
          });
        });
    },
    addImportantDate() {
      let event = {};
      event.name = this.id_name;
      event.deadline = this.id_date;
      this.id_name = null;
      this.id_date = null;
      this.importantDates.push(event);
    },
    deleteImportantDate(index) {
      this.importantDates.pop(index);
    },
    setSnackbar(color, text) {
      this.color = color;
      this.text = text;
      if (color == "success") {
        this.icon = "mdi-check-circle";
      } else {
        this.icon = "mdi-alert-circle";
      }
      this.snackbar = true;
    },
  },
};
</script>

<style>
.edit-logo {
  border: 1px solid black;
}
</style>
