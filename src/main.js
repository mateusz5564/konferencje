import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import firebase from 'firebase'
import DateFilter from '@/filters/dateFilter.js'

Vue.config.productionTip = false
export const bus = new Vue();

//FILTERS
Vue.filter('dateFilter', DateFilter)

//init Vue instance only once
let app = null
// wait for firebae auth
firebase.auth().onAuthStateChanged(user => {
// reinitialize Vue instance only at the beggining or on refresh the app

if(user){
  user.getIdTokenResult().then((token) => {
    Vue.prototype.$admin = token.claims.admin
  })
} else {
    Vue.prototype.$admin = false
}


  if(!app){
    app = new Vue({
      router,
      store,
      vuetify,
      render: h => h(App)
    }).$mount('#app')
  }
})


