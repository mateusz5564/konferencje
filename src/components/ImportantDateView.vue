<template>
  <div class="idv">
      <div class="d-flex flex-column">
        <span
          class="sub-title1 font-weight-regular"
        > {{importantDate.name}} zgloszenie abstraktów</span>
        <div>
          <v-icon small>mdi-calendar</v-icon>
          <span class="ml-1 body-2">{{importantDate.important_date.toDate() | dateFilter}}</span>
        </div>
        <a @click.stop="dialog = true">dodaj do kalendarza</a>
      </div>
  </div>
</template>

<script>
export default {
  props: ["importantDate"]
}
</script>