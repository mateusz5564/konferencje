import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import Login from '@/components/auth/Login'
import Register from '@/components/auth/Register'
import NewConference from '@/views/NewConference'
import EditConference from '@/components/EditConference'
import firebase from 'firebase'

Vue.use(Router)

const router = new Router({

  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/logowanie',
      name: 'logowanie',
      component: Login,
      meta: {
        lockIfUserLogedIn: true
      }
    },
    {
      path: '/rejestracja',
      name: 'rejestracja',
      component: Register,
      meta: {
        lockIfUserLogedIn: true
      }
    },
    {
      path: '/dodaj_konferencje',
      name: 'dodaj_konferencje',
      component: NewConference,
      meta: {
        requireAuth: true
      }
    },
    {
    path: '/edytuj_konferencje',
    name: 'edytuj_konferencje',
    component: EditConference
    }
  ]
})

router.beforeEach((to, from, next) => {
    if(to.matched.some(rec => rec.meta.lockIfUserLogedIn)){
      let user = firebase.auth().currentUser
      if(user){
        next(false)
      } else {
        next()
      }
    } else {
      next()
    }
})

export default router
