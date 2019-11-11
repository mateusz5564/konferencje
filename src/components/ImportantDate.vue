<template>
  <v-card max-width="840" class="mx-auto elevation-3">
            <div class="d-flex justify-space-between pl-5 pr-4 pt-4 pb-1 mb-2">
              <div>
                <slot name="number"></slot>
              </div>
              <div>
                <slot name="delete-btn"></slot>
              </div>
            </div>
            <hr>
            <div class="ma-4">
              <v-text-field
              v-model="importantDate.name"
              label="Nazwa"
              outlined
              ></v-text-field>

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
                    class="test2"
                    v-model="importantDate.deadline"
                    label="Data"
                    prepend-inner-icon="mdi-calendar"
                    readonly
                    outlined
                    v-on="on"
                    :rules="[rules.required]"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="importantDate.deadline" no-title scrollable>
                  <div class="flex-grow-1"></div>
                  <v-btn text color="primary" @click="$refs.start_date_menu.save(importantDate.deadline)">OK</v-btn>
                </v-date-picker>
              </v-menu>

            </div>
          </v-card>
</template>

<script>
export default {
  props: ["importantDate"],
  data(){
    return{
      start_time_menu: false,
      start_date_menu: false,
      rules: {
        required: value => !!value || "pole wymagane"
      }
    }
  }
}
</script>

<style>
.test2{
  width: 140px;
}
</style>