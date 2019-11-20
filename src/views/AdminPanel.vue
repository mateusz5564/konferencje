<template>
  <div class="admin_panel">

    <!-- dodawanie admina
    <v-card class="login__card" max-width="400px">
      <v-card-text>
        <v-form @submit.prevent="makeAdmin">
          <v-text-field label="Email" type="email" v-model="email"></v-text-field>
          <p v-if="feedback" class="red--text">{{ feedback }}</p>
          <v-btn class="ma-3" color="blue" type="submit" large dark>Dodaj Administratora</v-btn>
        </v-form>
      </v-card-text>
    </v-card> -->

    <v-card class="">

      <v-tabs v-model="tab" background-color="transparent" grow>
        <v-tab>Konferencje</v-tab>
        <v-tab>Uzytkownicy</v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <!-- CONFERENCES TAB -->
        <v-tab-item>
              <div class="mt-5">
              <v-data-table
              :loading="loading"
              loading-text="trwa ładowanie"
                :headers="headersConferences"
                :items="conferences"
                sort-by="isAccepted"
                class="elevation-1"
              >
                <template v-slot:top>
                  <v-dialog v-model="editConferenceDialog" max-width="1000px">
                    <EditConference />
                  </v-dialog>
                </template>
                <template v-slot:item.preview="{ item }">
                  <v-btn text :to="{name: 'konferencja', params: { conference_id: item.id}}" color="blue accent-4"><v-icon small>mdi-eye-outline</v-icon></v-btn>
                </template>
                <template v-slot:item.action="{ item }">
                  <v-icon small class="mr-2" @click="editConference(item)">mdi-pencil</v-icon>
                  <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
                </template>
                <template v-slot:item.isAccepted="{ item }">
                  <v-chip :color="getColor(item.isAccepted)" dark>{{ item.isAccepted }}</v-chip>
                </template>
              </v-data-table>
            </div>
        </v-tab-item>

        <!-- USERS TAB -->
        <v-tab-item>
          <div class="mt-5">
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
          </div>
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
      loading: true,
      users: [
        { username: "test1", email: "test1@interia.pl", status: "aktywny" },
        { username: "test2", email: "test2@interia.pl", status: "wyłączony" },
        { username: "test3", email: "test3@interia.pl", status: "aktywny" }
      ],
      headersUsers: [
        {
          text: "Nazwa użytkownika",
          align: "left",
          value: "username"
        },
        { text: "Email", value: "email" },
        { text: "Status", value: "status" },
        { text: "Actions", value: "action", align: "right", sortable: false }
      ],
      conferences: [],
      headersConferences: [
        {
          text: "Podgląd",
          align: "center",
          sortable: false,
          value: "preview"
        },
        {
          text: "Tytuł",
          align: "left",
          sortable: false,
          value: "title"
        },
        { text: "Akceptacja", value: "isAccepted" },
        { text: "Data rozpoczęcia", value: "start_date" },
        { text: "Data zakończenia", value: "end_date" },
        { text: "Lokalizacja", value: "location" },
        { text: "Akcje", value: "action", sortable: false }
      ],
      desserts: [],
      editedIndex: -1
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
              dataRef.id = doc.id;
              dataRef.start_date = doc.data().start_date.toDate().toLocaleString()
              dataRef.end_date = doc
                .data()
                .end_date.toDate()
                .toLocaleString()
              dataRef.isAccepted = String(doc.data().isAccepted) === "true" ? "zaakceptowano" : "oczekuje"
              this.conferences.push(dataRef)
              this.loading = false
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

    getColor(flag) {
      if (flag === "zaakceptowano") return "green";
      else return "red";
    },

    editConference(item) {
      this.$router.push({
        name: "edytuj_konferencje",
        params: { conference_id: item.id }
      });
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