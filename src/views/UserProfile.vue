<template>
  <div class="user-profile">
    <v-card v-if="profile" >
      {{ profile.username }}
    </v-card>
    
  </div>
</template>

<script>
import db from '@/firebase/init'

export default {
  data(){
    return {
      profile: null
    }
  },
  created(){
    let ref = db.collection('users')
    ref.doc(this.$route.params.username).get()
    .then(user => {
      this.profile = user.data()
    })
  }
}
</script>