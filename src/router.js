import Vue from "vue";
import Router from "vue-router";
import Profile from "./components/profile.vue";
import mycourses from "./components/mycourses.vue";
import observelog from "./components/observelog.vue";
//import searchcourses from './components/searchcourses.vue'
import viewSeminars from "./components/viewSeminars.vue";
import courseDetails from "./components/courseDetails.vue";
import auth from "./auth/authService";
import Login from "./components/login.vue"
import Callback from "./components/Callback.vue";


Vue.use(Router);

const router = new Router({
  mode: "history",
  // See https://router.vuejs.org/guide/essentials/history-mode.html#html5-history-mode. 
  routes: [
    {
      path: "/",
      name: "mycourses",
      component: mycourses
    },

    {
      path: "/profile",
      name: "profile",
      component: Profile
    },
    {
      path: "/mycourses",
      name: "mycourses",
      component: mycourses
    },
    {
      path: "/searchcourses",
      name: "viewSeminars",
      component: viewSeminars
    },
    {
      path: "/observelog",
      name: "observelog",
      component: observelog
    },
    {
      path: "/coursedetails",
      name: "coursedetails",
      component: courseDetails
    },
    {
      path: "/login",
      name: "Login",
      component: Login
    },
    {
      path: "/callback",
      name: "callback",
      component: Callback
    },
    // See https://router.vuejs.org/guide/essentials/history-mode.html#html5-history-mode. 
    // { path: '*', component: NotFound }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.path == "/callback" || auth.isAuthenticated()) {
    next();
  } else {
    auth.login({ target: to.path });
  }
});

export default router;