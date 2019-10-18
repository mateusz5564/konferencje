<template>
  <div class="admin_panel">
    <v-card class="login__card" max-width="400px">
      <v-card-text>
        <v-form @submit.prevent="makeAdmin">
          <v-text-field label="Email" type="email" v-model="email"></v-text-field>
          <!-- <p v-if="feedback" class="red--text">{{ feedback }}</p> -->
          <v-btn class="ma-3" color="blue" type="submit" large dark>Dodaj Administratora</v-btn>
        </v-form>
      </v-card-text>
    </v-card>

    <v-card class="mt-10">
      <!-- <v-card-title class="text-center justify-center py-6">
      <h1 class="font-weight-bold display-3 basil--text">BASiL</h1>
      </v-card-title>-->

      <v-tabs v-model="tab" background-color="transparent" grow>
        <v-tab>Uzytkownicy</v-tab>
        <v-tab>Konferencje</v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <!-- USERS TAB -->
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <v-data-table
                :headers="headersUsers"
                :items="users"
                sort-by="calories"
                class="elevation-1"
              >
                <template v-slot:top></template>
                <template v-slot:item.action="{ item }">
                  <v-icon small class="mr-2" @click="editConference(item)">mdi-pencil</v-icon>
                  <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-tab-item>

        <!-- CONFERENCES TAB -->
        <v-tab-item>
    
              <v-card flat>
                <v-card-text>
                  <v-data-table
                    :headers="headersConferences"
                    :items="conferences"
                    sort-by="calories"
                    class="elevation-1"
                  >
                    <template v-slot:top>
                      <v-dialog v-model="editConferenceDialog" max-width="1000px">
                        <!-- <template v-slot:activator="{ on }">
                        <v-btn color="primary" dark class="mb-2" v-on="on">Dodaj konferencje</v-btn>
                        </template>-->

                        <EditConference /> 
               
                      </v-dialog>
                    </template>
                    <template v-slot:item.action="{ item }">
                      <v-icon small class="mr-2" @click="editConference(item)">mdi-pencil</v-icon>
                      <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
                    </template>
                  </v-data-table>
                </v-card-text>
              </v-card>
  
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>

<script>
import firebase from "firebase";
import functions from "firebase/functions";
import db from "@/firebase/init";
import axios from "axios";
import EditConference from "@/components/EditConference";

export default {
  components: {
    EditConference
  },
  data() {
    return {
      email: null,
      tab: null,
      editConferenceDialog: false,
      users: [
        { username: "test1", email: "test1@interia.pl" },
        { username: "test2", email: "test2@interia.pl" },
        { username: "test3", email: "test3@interia.pl" }
      ],
      headersUsers: [
        {
          text: "Nazwa użytkownika",
          align: "left",
          value: "username"
        },
        { text: "Email", value: "email" },
        { text: "Logo", value: "logo" },
        { text: "Opis", value: "opis" },
        { text: "Actions", value: "action", sortable: false }
      ],
      conferences: [],
      headersConferences: [
        {
          text: "Tytuł",
          align: "left",
          sortable: false,
          value: "title"
        },
        { text: "Opis", value: "description" },
        { text: "Lokalizacja", value: "location" },
        { text: "Data rozpoczęcia", value: "start_date" },
        { text: "Data zakończenia", value: "end_date" },
        { text: "Logo", value: "link" },
        { text: "Akcje", value: "action", sortable: false }
      ],
      desserts: [],
      editedIndex: -1,
      editedItem: {
        name: "",
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0
      },
      defaultItem: {
        name: "",
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0
      }
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    }
  },

  watch: {
    editConferenceDialog(val) {
      val || this.close();
    }
  },

  created() {
    db.collection("conferences")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          axios
            .post(
              "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
                doc.data().location.latitude +
                "," +
                doc.data().location.longitude +
                "&key=AIzaSyDtYbZokAi1OVXplmLIpuxlJpppE0fijPA"
            )
            .then(response => {
              let address = response.data.results[0].formatted_address;
              let dataRef = doc.data();
              dataRef.location = address;
              const link = `https://maps.google.com/?q=${address}`;
              dataRef.link = link;
              dataRef.start_date = doc
                .data()
                .start_date.toDate()
                .toISOString();
              dataRef.end_date = doc
                .data()
                .end_date.toDate()
                .toISOString();
              this.conferences.push(dataRef);
              console.log(dataRef);
            })
            .catch(e => {
              console.log(e);
            });
        });
      });
  },

  methods: {
    makeAdmin() {
      let addAdmin = firebase.functions().httpsCallable("addAdminRole");
      addAdmin({ email: this.email }).then(result => {
        console.log(result);
      });
    },

    editConference(item) {
      // this.editedIndex = this.conference.indexOf(item);
      // this.editedItem = Object.assign({}, item);
      this.editConferenceDialog = true;
    },

    deleteItem(item) {
      const index = this.desserts.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.desserts.splice(index, 1);
    },

    close() {
      this.editConferenceDialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem);
      } else {
        this.desserts.push(this.editedItem);
      }
      this.close();
    }
  }
};
</script>

<style>
</style>