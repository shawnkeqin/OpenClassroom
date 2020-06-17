import Vue from "vue";
import Router from "vue-router";
import Profile from "./components/profile.vue";
import mycourses from "./components/mycourses.vue";
import MyVisitorsPage from "./components/MyVisitorsPage";
//import searchcourses from './components/searchcourses.vue'
import viewSeminars from "./components/viewSeminars.vue";
import courseDetails from "./components/courseDetails.vue";
import auth from "./auth/authService";
import LoginPage from "@/components/LoginPage";
import Callback from "./components/Callback.vue";
import MyVisitsPage from "@/components/MyVisitsPage";

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
      path: "/my-visitors",
      name: "my-visitors",
      component: MyVisitorsPage
    },
    {
      path: "/coursedetails/:id",
      name: "coursedetails",
      component: courseDetails,
      props: true
    },
    {
      path: "/login",
      name: "LoginPage",
      component: LoginPage
    },
    {
      path: "/callback",
      name: "callback",
      component: Callback
    },
    // See https://router.vuejs.org/guide/essentials/history-mode.html#html5-history-mode.
    // { path: '*', component: NotFound }
    {
      path: "/my-visits",
      name: "MyVisitsPage",
      component: MyVisitsPage
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.path == "/callback" || auth.isAuthenticated()) {
    next();
  } else {
    next();
    // auth.login({ target: to.path });
  }
});

export default router;
