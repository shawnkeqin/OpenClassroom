import Vue from "vue";
import Router from "vue-router";
import Profile from "@/components/profile";
import mycourses from "@/components/mycourses";
import MyVisitorsPage from "@/components/MyVisitorsPage";
import viewSeminars from "@/components/viewSeminars";
import OptOutPage from "@/components/OptOutPage";
import courseDetails from "@/components/mycourses/courseDetails";
// import auth from "@/auth";
import LoginPage from "@/components/LoginPage";
import Callback from "@/components/Callback.vue";
import MyVisitsPage from "@/components/MyVisitsPage";
import calendarView from "@/components/viewSeminars/calendarView";
import ProtectedRoute from "@/components/ProtectedRoute";

Vue.use(Router);

const router = new Router({
  mode: "history",
  // See https://router.vuejs.org/guide/essentials/history-mode.html#html5-history-mode.
  routes: [
    { path: "/", redirect: "/my-courses" },
    {
      path: "/profile",
      name: "profile",
      component: ProtectedRoute,
      props: { component: Profile }
    },
    {
      path: "/my-courses",
      name: "mycourses",
      component: ProtectedRoute,
      props: { component: mycourses }
    },
    {
      path: "/search-courses",
      name: "viewSeminars",
      component: ProtectedRoute,
      props: { component: viewSeminars }
    },
    {
      path: "/calendar-view",
      name: "calendarView",
      component: ProtectedRoute,
      props: { component: calendarView }
    },
    {
      path: "/my-visitors",
      name: "my-visitors",
      component: ProtectedRoute,
      props: { component: MyVisitorsPage }
    },
    {
      path: "/coursedetails/:id",
      name: "coursedetails",
      component: ProtectedRoute,
      props: { component: courseDetails }
    },
    {
      path: "/my-visits",
      name: "MyVisitsPage",
      component: ProtectedRoute,
      props: { component: MyVisitsPage }
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
    // See https://router.vuejs.org/guide/essentials/dynamic-matching.html#catch-all-404-not-found-route.
    { path: "*", redirect: "/my-courses" },
    {
      path: "/opt-out",
      name: "OptOutPage",
      component: OptOutPage
    }
  ]
});

// router.beforeEach((to, from, next) => {
//   if (to.path == "/login" || auth.isAuthenticated()) {
//     next();
//   } else {
//     next("/login");
//   }
// });

export default router;
