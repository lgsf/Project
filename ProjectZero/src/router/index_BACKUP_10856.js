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
import { store } from '../store'

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
    component: Home,
    meta: {
      requiresAuth: true,
    }
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
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/groups', //Grupos
    name: 'Groups',
    component: Groups,
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/notifications', //Notificações
    name: 'Notifications',
    component: Notifications,
    meta: {
      requiresAuth: true,
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
    if (!store.state.isAuthenticated) {
      next({
        path: '/'
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router
