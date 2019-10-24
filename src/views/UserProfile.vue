<template>
  <div class="user-profile mx-auto">

    <v-card class="mb-5 pa-10" max-width="800px" v-if="profile" >
      <div class="d-flex flex-row">
        <div class="avatar">
          <v-avatar size="200">
           <img src="@/assets/testav.png" />
        </v-avatar>
        </div>
        <div class="user-info ml-10">
          <div class="d-flex flex-column">
            <h2>{{ profile.username }}</h2>
            <p>bio</p>
          </div>
        </div>
      </div>
      
    </v-card>
    
 <v-card max-width="800px">

    <v-tabs vertical>
      <v-tab class="tab">
        <v-icon left>mdi-account</v-icon>
        Edytuj profil
      </v-tab>
      <v-tab class="tab">
        <v-icon left>mdi-lock</v-icon>
        Zmień hasło
      </v-tab>
      <v-tab class="tab">
        <v-icon left>mdi-access-point</v-icon>
        Opcja 3333
      </v-tab>

      <v-tab-item>
        <v-card flat>
          <v-card-text>
            estestestes
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            etsetestes
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item class="raz">
        <v-card flat>
          <v-card-text>
            testestestes
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
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

<style>
.user-profile{
  max-width: 800px;
}
.tab{
  justify-content: flex-start !important;
}
</style>