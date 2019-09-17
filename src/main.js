import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import firebase from 'firebase'

Vue.config.productionTip = false

let app = null

// wait for firebae auth
firebase.auth().onAuthStateChanged(() => {
console.log(firebase.auth().currentUser)
// reinitialize Vue instance only at the beggining or on refresh the app
  if(!app){
    app = new Vue({
      router,
      store,
      vuetify,
      render: h => h(App)
    }).$mount('#app')
  }
})


