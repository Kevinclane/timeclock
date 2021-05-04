import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'
import Dashboard from '../views/Dashboard.vue'
import ProjectDetails from '../views/ProjectDetails.vue'
import Subscriptions from "../views/Subscriptions.vue"
import AdminSubscriptions from "../views/Admin/AdminSubscriptions.vue"
import { authGuard } from "@bcwdev/auth0-vue"

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      beforeEnter: authGuard
    },
    {
      path: '/project/:projectId',
      name: 'projectDetails',
      component: ProjectDetails,
      beforeEnter: authGuard
    },
    {
      path: '/subscriptions',
      name: 'subscriptions',
      component: Subscriptions,
      beforeEnter: authGuard
    },
    {
      path: '/adminsubs',
      name: 'adminsubs',
      component: AdminSubscriptions,
      beforeEnter: authGuard
    },
    {
      path: "*",
      redirect: '/'
    }
  ]
})