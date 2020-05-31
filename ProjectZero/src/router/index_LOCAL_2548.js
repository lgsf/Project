import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
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
    path: '/home', //Home
    name: 'Home',
    component: Home
  },
  {
    path: '/setup', //Configuração
    name: 'Setup',
    component: Setup,
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/process', //Processos
    name: 'Process',
    component: Process,
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/clients', //Processos
    name: 'Clients',
    component: Clients,
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/flux', //Fluxos
    name: 'Flux',
    component: Flux,
  },
  {
    path: '/users', //Usuários
    name: 'Users',
    component: Users,
  },
  {
    path: '/groups', //Grupos
    name: 'Groups',
    component: Groups,
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

export default router
