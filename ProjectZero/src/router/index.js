import Vue from 'vue'
import { store } from '../store'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import ResetPassword from '../views/ResetPassword.vue'
import Clients from '../views/Clients.vue'
import Home from '../views/Home.vue'
import Setup from '../views/Setup.vue'
import Process from '../views/Process.vue'
import Flux from '../views/Flux.vue'
import Users from '../views/Users.vue'
import Groups from '../views/Groups.vue'
import Notifications from '../views/Notifications.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,

  },
  {
    path: '/resetpassword',
    name: 'ResetPassword',
    component: ResetPassword,

  },
  {
    path: '/home', //Home
    name: 'Home',
    component: Home,
    meta: {
      authRequired: true
    }
  },
  {
    path: '/setup', //Configurações
    name: 'Setup',
    component: Setup,
    meta: {
      authRequired: true
    }
  },
  {
    path: '/process', //Processos
    name: 'Process',
    component: Process,
    meta: {
      authRequired: true
    }
  },
  {
    path: '/clients', //Processos
    name: 'Clients',
    component: Clients,
    meta: {
      authRequired: true
    }
  },
  {
    path: '/flux', //Fluxos
    name: 'Flux',
    component: Flux,
    meta: {
      authRequired: true
    }
  },
  {
    path: '/users', //Usuários
    name: 'Users',
    component: Users,
    meta: {
      authRequired: true
    }
  },
  {
    path: '/groups', //Grupos
    name: 'Groups',
    component: Groups,
    meta: {
      authRequired: true
    }
  },
  {
    path: '/notifications', //Notificações
    name: 'Notifications',
    component: Notifications,
    meta: {
      authRequired: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes

})


router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.authRequired)) {
    if (!store.getters.isAuthenticated) {
      next({
        path: '/'
      });
    } else {
      next()
    }
  } else {
    next()
  }
});

export default router
