<template>
  <a-layout id="components-layout-demo-top-side">
    <a-layout-header class="header" theme="light">
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
          Manage Courses
          <router-link to="/mycourses"></router-link>
        </a-menu-item>
        <a-menu-item key="3">
          Find Courses to observe
          <router-link to="/searchcourses"></router-link>
        </a-menu-item>
        <a-menu-item key="4">
          Manage Observation
          <router-link to="/observelog"></router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-header>
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
              <router-link to="/searchcourses">Search Courses</router-link>
            </a-menu-item>
            <a-menu-item key="4">
              <a-icon type="calendar" />
              <span class="nav-text">Observe Log</span>
              <router-link to="/observelog">Observe Log</router-link>
            </a-menu-item>

            <a-menu-item key="5">
              <a-icon type="solution" />
              <span class="nav-text">FAQ</span>
              <!-- <router-link to='/observelog'>Observe Log</router-link> -->
            </a-menu-item>
            <a-menu-item key="6">
              <a-icon type="message" />
              <span class="nav-text">Feedback</span>
              <!--  <router-link to='/observelog'>Observe Log</router-link> -->
            </a-menu-item>
          </a-menu>
        </a-layout-sider>
        <a-layout-content :style="{ padding: '0 24px', minHeight: '800px' }">
          <router-view />
        </a-layout-content>
      </a-layout>
    </a-layout-content>
    <a-layout-footer style="text-align: center"> </a-layout-footer>
  </a-layout>
</template>

<style>
#components-layout-demo-top-side .logo {
  width: 120px;
  height: 31px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px 28px 16px 0;
  float: left;
}
</style>
