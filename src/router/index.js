import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Setup from '../views/Setup.vue'
import Process from '../views/Process.vue'
import Flux from '../views/Flux.vue'
import Team from '../views/Team.vue'
import Notifications from '../views/Notifications.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  { 
    path: '/setup', //Configuração
    name: 'Setup',
    component: Setup
  },
  {
    path: '/process', //Processos
    name: 'Process',
    component: Process
  },
  {
    path: '/flux', //Fluxos
    name: 'Flux',
    component: Flux
  },
  {
    path: '/team', //Usuários
    name: 'Team',
    component: Team
  },
  {
    path: '/notifications', //Notificações
    name: 'Notifications',
    component: Notifications
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
