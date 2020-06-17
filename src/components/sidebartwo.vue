<template>
  <a-layout id="components-layout-demo-top-side">
    <!-- <a-layout-header class="header" theme="light">
      <div class="logo" />

      <a-menu
        theme="dark"
        mode="horizontal"
        :default-selected-keys="['2']"
        :style="{ lineHeight: '64px' }"
      >
        <a-menu-item key="1">
          Profile
          <router-link to="/profile"></router-link>
        </a-menu-item>
        <a-menu-item key="2">
          My Courses
          <router-link to="/mycourses"></router-link>
        </a-menu-item>
        <a-menu-item key="3">
         Search Courses
          <router-link to="/searchcourses"></router-link>
        </a-menu-item>
        <a-menu-item key="4">
         My Visitors
          <router-link to="/observelog"></router-link>
        </a-menu-item>
           <a-menu-item key="5">
         My Visits
          <router-link to="/observelog"></router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-header> -->
    <a-layout-content style="padding: 0 50px">
      <a-layout style="padding: 24px 0; background: #fff">
        <a-layout-sider width="200" style="background: #fff">
          <a-menu
            mode="inline"
            :default-selected-keys="['1']"
            :default-open-keys="['sub1']"
            style="height: 100%"
          >
            <a-menu-item key="1">
              <a-icon type="user" />
              <span class="nav-text">Profile</span>
              <router-link to="/profile">Profile</router-link>
            </a-menu-item>
            <a-menu-item key="2">
              <a-icon type="container" />
              <span class="nav-text">My Courses</span>
              <router-link to="/mycourses">My Courses</router-link>
            </a-menu-item>
            <a-menu-item key="3">
              <a-icon type="file-search" />
              <span class="nav-text">Search Courses</span>
              <router-link to="/search-courses">Search Courses</router-link>
            </a-menu-item>
            <a-menu-item key="4">
              <a-icon type="download" />
              <span class="nav-text">My Visitors</span>
              <router-link to="/my-visitors"></router-link>
            </a-menu-item>
            <a-menu-item key="5">
              <a-icon type="solution" />
              <span class="nav-text">My Visits</span>
              <router-link to="/my-visits"></router-link>
            </a-menu-item>
          </a-menu>
        </a-layout-sider>
        <a-layout-content :style="{ padding: '0 24px', minHeight: '800px' }">
          <router-view />
        </a-layout-content>
      </a-layout>
    </a-layout-content>
    <a-layout-footer style="text-align: left">
      Logged in as: {{ loggedInUser.name }}, ID: {{ loggedInUser.id }}
    </a-layout-footer>
  </a-layout>
</template>
<script>
import constants from "../utils/constants";
import queries from "../graphql/queries.gql";
export default {
  data() {
    return {
      constants: constants,
      queries: queries
    };
  },
  apollo: {
    loggedInUser: {
      query: queries.getFacultyById,
      variables: {
        faculty_id: constants.TEST_FACULTY_ID
      },
      update: data => data.faculty_by_pk
    }
  }
};
</script>
<style>
#components-layout-demo-top-side .logo {
  width: 120px;
  height: 31px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px 28px 16px 0;
  float: left;
}
</style>
