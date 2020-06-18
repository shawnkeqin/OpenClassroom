import Vue from "vue";
import Router from "vue-router";
import Profile from "@/components/profile";
import mycourses from "@/components/mycourses";
import MyVisitorsPage from "@/components/MyVisitorsPage";
//import searchcourses from './components/searchcourses.vue'
import viewSeminars from "@/components/viewSeminars";
import courseDetails from "@/components/mycourses/courseDetails";
import auth from "@/auth/authService";
import LoginPage from "@/components/LoginPage";
import Callback from "@/components/Callback.vue";
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
      path: "/my-courses",
      name: "mycourses",
      component: mycourses
    },
    {
      path: "/search-courses",
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
