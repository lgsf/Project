import Vue from 'vue'
import { store } from '../store'
import VueRouter from 'vue-router'
import Login from '../views/Auth/Login.vue'
import ResetPassword from '../views/Auth/ResetPassword.vue'
import Clients from '../views/Clients/Clients.vue'
import Home from '../views/Home.vue'
import Setup from '../views/Setup.vue'
import Erp from '../views/ErpOrder/Erp.vue'
import ServiceOrder from '../views/ServiceOrder/ServiceOrder.vue'
import EditServiceOrder from '../views/ServiceOrder/EditServiceOrder.vue'
import Users from '../views/Users/Users.vue'
import Groups from '../views/Groups/Groups.vue'
import Notifications from '../views/Notifications/Notifications.vue'
import OverallProductivity from '../views/Reports/OverallProductivity.vue'
import ManagementTaskView from '../views/Management/ManagementTaskView.vue'
import hasPermissionsNeeded from '@/utilities/permissionRouterGuard.js'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    meta: {
      hideForAuth: true
    }
  },
  {
    path: '/resetpassword',
    name: 'ResetPassword',
    component: ResetPassword,
    meta: {
      hideForAuth: true
    }
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
    path: '/erp', //Tela gestão Erp
    name: 'Erp',
    component: Erp,
    meta: {
      authRequired: true
    }
  },
  {
    path: '/clients', //Clientes
    name: 'Clients',
    component: Clients,
    meta: {
      authRequired: true
    }
  },
  {
    path: '/serviceOrder', // Ordem de serviço
    name: 'ServiceOrder',
    component: ServiceOrder,
    meta: {
      authRequired: true
    }
  },
  {
    path: '/EditServiceOrder/:id', //Ordem de serviço
    name: 'EditServiceOrder',
    component: EditServiceOrder,
    props: true,
    meta: {
      authRequired: true
    }
  },
  {
    path: '/taskView', //Gerenciamento - visão de tasks
    name: 'ManagementTaskView',
    component: ManagementTaskView,
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
  },
  {
    path: '/overall-productivity', //Overall Productivity
    name: 'OverallProductivity',
    component: OverallProductivity,
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
    if (!store.state.auth.isAuthenticated) {
      next({
        path: '/'
      })
    } else {
          if (!hasPermissionsNeeded(to, store.state.general.links, from)){
            next({ 
              path: '/home' 
            })
          } else {
            next()
          }
    }
  } else {
    next()
  }

  if (to.matched.some(record => record.meta.hideForAuth)) {
    if (store.state.auth.isAuthenticated) {
      next({ path: '/home' })
    } else {
      next()
    }
  } else {
    next()
  }
});

export default router
