import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Clients from '../views/Clients.vue'
import Home from '../views/Home.vue'
import Setup from '../views/Setup.vue'
import Process from '../views/Process.vue'
import Flux from '../views/Flux.vue'
import Team from '../views/Team.vue'
import Notifications from '../views/Notifications.vue'
import firebase from 'firebase'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    
  },
  { 
    path: '/home', //Home
    name: 'Home',
    component: Home
  
   },
  { 
    path: '/setup', //Configuração
    name: 'Setup',
    component: Setup,
    },
  {
    path: '/process', //Processos
    name: 'Process',
    component: Process,
    },
  {
  path: '/clients', //Processos
  name: 'Clients',
  component: Clients,
  },
  {
    path: '/flux', //Fluxos
    name: 'Flux',
    component: Flux,
    },
  {
    path: '/team', //Usuários
    name: 'Team',
    component: Team,
    },
  {
    path: '/notifications', //Notificações
    name: 'Notifications',
    component: Notifications,
    }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
  
})

// router guards
router.beforeEach((to, from, next) => {
  // check to see if route has auth guard
  if(to.matched.some(rec => rec.meta.requiresAuth)){
    // check auth state of user
    let user = firebase.auth().currentUser;
    if (user) {
      // User is signed in. Proceed to route
      next('/home')
      console.log("oi", user)
    } else {
      // No user is signed in. Redirect to login
      next({
        name: 'Login'
      })
    }
  } else {
    // if route is not guarded by auth, proceed
    next()
  }
})
export default router
