<template>
  <div class="new_conference mt-12">
    <v-card class="register__card pa-5" max-width="900px">
      <v-card-title class="justify-center">
        <h2 class="headline mb-5">Nowa konferencja</h2>
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="addConference" ref="form">
          <v-textarea
            outlined
            v-model="title"
            auto-grow
            label="Tytuł"
            rows="1"
            :rules="[rules.required]"
          ></v-textarea>
          <v-autocomplete v-model="selectedCategory" :items="categories" label="Kategoria" outlined :rules="[rules.required]"></v-autocomplete>

          <div class="editor mb-8">
            <ckeditor :editor="editor" :config="editorConfig" v-model="editorData" ></ckeditor>
          </div>

          <v-text-field
            v-model="website"
            :rules="[rules.www]"
            label="Adres WWW"
            outlined
            hint="adres URL musi rozpoczynać się od https:// np. https://www.google.pl/"
          ></v-text-field>

          <div class="test">
            <v-autocomplete
              class="mb-5"
              label="Lokalizacja"
              v-model="select"
              :loading="loading"
              :items="items"
              :search-input.sync="search"
              :return-object="true"
              item-text="name"
              no-filter
              auto-select-first
              flat
              outlined
              hide-no-data
              hide-details
              clearable
              append-icon="mdi-map-search-outline"
              :rules="[rules.required]"
            ></v-autocomplete>
          </div>
          <v-row>
            <!-- START DATE PICKER -->
            <v-col class="pb-0 ma-0" cols="12" sm="6">
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
                  <v-btn text color="primary" @click="$refs.start_date_menu.save(start_date)">OK</v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>

            <!-- START TIME PICKER -->
            <v-col class="pb-0 ma-0" cols="12" sm="6">
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

          <v-row>
            <!-- END DATE PICKER -->
            <v-col class="pb-0 pt-0 ma-0" cols="12" sm="6">
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
            <v-col class="pb-0 pt-0 ma-0" cols="12" sm="6">
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

          <v-file-input
            show-size
            label="Wybierz logo"
            prepend-icon
            prepend-inner-icon="mdi-camera"
            v-model="image"
            outlined
            :rules="[rules.required]"
          ></v-file-input>

          <v-card max-width="840" class="mx-auto mb-10">
            <h3
              class="elevation-1 pt-4 pb-4 title font-weight-regular text-center mb-3"
            >Ważne terminy</h3>

            <div v-for="(date, index) in importantDates" :key="index">
              <ImportantDate :importantDate="date">
                <div slot="number">{{index + 1}}</div>
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
                      class="date_field"
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
          <v-btn class="ma-3" type="submit" color="blue" large dark>Dodaj konferencje</v-btn>
          <br />
          <br />
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import firebase from "firebase";
import db from "@/firebase/init";
import axios from "axios";
import ImportantDate from "@/components/ImportantDate";
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import pl from "@ckeditor/ckeditor5-build-classic/build/translations/pl.js";

export default {
  components: {
    ImportantDate,
    ckeditor: CKEditor.component
  },
  data() {
    return {
      title: null,
      start_date: null,
      start_time: null,
      id_name: null,
      id_date: null,
      end_date: null,
      end_time: null,
      location: null,
      logo: null,
      isAccepted: false,
      feedback: null,
      modal: true,
      start_date_menu: false,
      id_date_menu: false,
      end_date_menu: false,
      start_time_menu: false,
      end_time_menu: false,
      image: null,
      loading: false,
      items: [],
      search: null,
      select: null,
      candidates: [],
      loading: false,
      selectedCategory: null,
      categories: [],
      website: null,
      importantDates: [],
      editor: ClassicEditor,
      editorData: null,
      editorConfig: {
        language: {
          ui: "pl",
          content: "pl"
        },
        placeholder: "Opis konferencji"
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
        }
      }
    };
  },
  created() {
    this.getCategories();
  },
  watch: {
    search(val) {
      val && val !== this.select && this.querySelections(val);
    }
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
    }
  },
  methods: {
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
    addConference() {
      if(this.$refs.form.validate()){
      const latitude = this.select.geometry.location.lat();
      const longitude = this.select.geometry.location.lng();
      const geopoint = new firebase.firestore.GeoPoint(latitude, longitude);
      let user = firebase.auth().currentUser;

      if (this.$admin) {
        this.isAccepted = true;
      }

      db.collection("conferences")
        .add({
          isAccepted: this.isAccepted,
          title: this.title,
          category_id: this.selectedCategory,
          website: this.website,
          description: this.editorData,
          location: geopoint,
          start_date: firebase.firestore.Timestamp.fromDate(
            this.preparedStartDate
          ),
          end_date: firebase.firestore.Timestamp.fromDate(this.preparedEndDate),
          user_id: user.uid
        })
        .then(response => {
          const key = response.id;
          for (let i in this.importantDates) {
            db.collection("conferences")
              .doc(key)
              .collection("important_dates")
              .add({
                name: this.importantDates[i].name,
                important_date: new Date(this.importantDates[i].deadline)
              })
              .then(response => {
                console.log(response);
              });
          }
          if (this.image) {
            const filename = this.image.name;
            const extention = filename.substring(
              filename.lastIndexOf("."),
              filename.length
            );

            firebase
              .storage()
              .ref("conferences/" + response.id + extention)
              .put(this.image)
              .then(response => {
                response.ref.getDownloadURL().then(downloadURL => {
                  db.collection("conferences")
                    .doc(key)
                    .update({ logo: downloadURL })
                    .then(response => {
                      console.log("pomyslnie dodano konferencje");
                      this.$router.push({ name: "moje_konferencje" });
                    });
                });
              });
          } else {
            db.collection("conferences")
              .doc(key)
              .set(
                {
                  logo:
                    "https://firebasestorage.googleapis.com/v0/b/konferencje-95600.appspot.com/o/conferences%2FdefaultLogo.png?alt=media&token=c034e5d6-e95d-4322-ae41-a8dc95cad9f9"
                },
                { merge: true }
              )
              .then(response => {
                console.log("pomyslnie dodano konferencje");
                this.$router.push({ name: "moje_konferencje" });
              });
          }
        })
        .catch(err => {
          console.log(err);
        });
        }
    },
    querySelections(v) {
      const service = new google.maps.places.PlacesService(
        document.createElement("div")
      );

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
    },
    getCategories() {
      db.collection("categories")
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            this.categories.push(doc.id);
          });
        });
    }
  }
};
</script>

<style>
.date_field {
  width: 140px;
}
.ck-editor__editable_inline {
  min-height: 100px;
  color: rgba(0, 0, 0, 0.87);
  font-size: 16px;
}
.ck.ck-editor__editable > .ck-placeholder::before {
  font-size: 18px;
  display: inline-block;
  margin-top: 10px;
}
.ck.ck-toolbar.ck-toolbar_grouping > .ck-toolbar__items {
  min-height: 62px;
}
</style>