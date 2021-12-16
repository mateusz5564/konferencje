import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import Login from '@/components/auth/Login'
import Register from '@/components/auth/Register'
import NewConference from '@/views/NewConference'
import EditConference from '@/components/EditConference'
import UserConferences from '@/views/UserConferences'
import ObservedConferences from '@/views/ObservedConferences'
import Calendar from '@/views/Calendar'
import AdminPanel from '@/views/AdminPanel'
import ConferencePage from '@/views/ConferencePage'
import UserProfile from '@/views/UserProfile'
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
      path: '/edytuj_konferencje/:conference_id',
      name: 'edytuj_konferencje',
      component: EditConference,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/moje_konferencje',
      name: 'moje_konferencje',
      component: UserConferences,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/obserwowawne_konferencje',
      name: 'obserwowane_konferencje',
      component: ObservedConferences,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/konferencja/:conference_id',
      name: 'konferencja',
      component: ConferencePage
    },
    {
      path: '/kalendarz',
      name: 'kalendarz',
      component: Calendar
    },
    {
      path: '/profil/:username',
      name: 'profil',
      component: UserProfile,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/admin_panel',
      name: 'admin_panel',
      component: AdminPanel,
      beforeEnter: (to, form, next) => {
        let user = firebase.auth().currentUser
        user.getIdTokenResult().then((token) => {
          if(token.claims.admin){
            next()
          } else {
            next(false)
          }
        })
      }
    }
  ]
})

//lock is user is logged in
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

//require auth to visit
router.beforeEach((to, from, next) => {
  if(to.matched.some(rec => rec.meta.requireAuth)){
    let user = firebase.auth().currentUser
    if(user){
      next()
    } else {
      next(false)
    }
  } else {
    next()
  }
})

export default router
