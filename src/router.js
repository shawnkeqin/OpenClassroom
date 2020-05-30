import Vue from 'vue'
import Router from 'vue-router'
import Profile from './components/profile.vue'
import mycourses from './components/mycourses.vue'
import observelog from './components/observelog.vue'
import searchcourses from './components/searchcourses.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/profile',
      name: 'profile',
      component: Profile
    },
    {
      path: '/mycourses',
      name: 'mycourses',
      component: mycourses
    },
    {
      path: '/searchcourses',
      name: 'searchcourses',
      component: searchcourses
    },
    {
      path: '/observelog',
      name: 'observelog',
      component: observelog
    }
  ]
})