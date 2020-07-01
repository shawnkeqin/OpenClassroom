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
    <a-alert
      v-if="!loggedInUser.has_consented"
      message="View and agree to the terms of the app in Profile to start making vists requests."
      type="info"
      show-icon
    />
    <ConsentForm :showButton="false" :showModal="!loggedInUser.has_consented" />
    <a-layout-content>
      <a-layout style="padding: 0; background: #f6f6f6">
        <a-layout-sider width="250px" style="background: #fff">
          <a-menu
            mode="inline"
            :default-selected-keys="['1']"
            :default-open-keys="['sub1']"
            style="height: 100%"
          >
            <a-menu-item :key="1" class="nav-item">
              <a-icon type="user" />
              <span class="nav-text">Profile</span>
              <router-link to="/profile" />
            </a-menu-item>
            <a-menu-item :ey="2" class="nav-item">
              <a-icon type="container" />
              <span class="nav-text">My Courses</span>
              <router-link to="/my-courses" />
            </a-menu-item>
            <a-menu-item key="3" class="nav-item">
              <a-icon type="file-search" />
              <span class="nav-text">Search Classes</span>
              <router-link to="/search-courses" />
            </a-menu-item>
            <a-menu-item key="4" class="nav-item">
              <a-icon type="file-search" />
              <span class="nav-text">My Calendar</span>
              <router-link to="/calendar-view" />
            </a-menu-item>
            <a-menu-item key="5" class="nav-item">
              <a-badge :count="pendingVisitsCount" :offset="[10, 5]">
                <a-icon type="download" />
                <span class="nav-text">My Visitors</span>
              </a-badge>
              <router-link to="/my-visitors" />
            </a-menu-item>
            <a-menu-item key="6" class="nav-item">
              <a-icon type="solution" />
              <span class="nav-text">My Visits</span>
              <router-link to="/my-visits" />
            </a-menu-item>
            <a-menu-item key="7" class="nav-item">
              <a-icon type="book" />
              <span class="nav-text">Feedback</span>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLScOfSV1ZIChd6IQJ9WLegujtfhlE-E5hG-tyDMBzEL-JUdEUQ/viewform?usp=sf_link"
              ></a>
            </a-menu-item>
          </a-menu>
        </a-layout-sider>
        <a-layout-content style="padding: 30px 50px 30px 50px; height: 100vh">
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
import ConsentForm from "./ConsentForm";
export default {
  components: { ConsentForm },
  data() {
    return {
      constants: constants,
      queries: queries,
      loggedInUser: {},
      consentModalVisible: false,
      consentChecked: false,
      seminarWithVisits: []
    };
  },
  apollo: {
    loggedInUser: {
      query: queries.getFacultyById,
      variables: {
        faculty_id: constants.TEST_FACULTY_ID
      },
      update: data => data.faculty_by_pk
    },
    seminarsWithVisits: {
      query: queries.get_seminars_with_visits_by_time_requested,
      variables: {
        faculty_id: constants.TEST_FACULTY_ID,
        semester_code: constants.SEMESTER_CODE_AY1819_1
      },
      update: data => data.seminar
    }
  },
  computed: {
    pendingVisitsCount() {
      const count =
        this.seminarsWithVisits &&
        this.seminarsWithVisits
          .map(seminar => seminar.visits)
          .flat()
          .filter(visit => visit.visit_status === "PENDING").length;
      return count;
    }
  },

  watch: {
    pendingVisitsCount() {
      const count = this.pendingVisitsCount;
      if (count) {
        this.$notification.warn({
          key: "PENDING_VISITS",
          message: `${count} pending visit request${count > 1 && "s"}`,
          description:
            "Head over to My Visitors page to review your incoming visit requests.",
          duration: 0
        });
      }
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
li.nav-item.ant-menu-item {
  display: flex;
  align-items: center;
  margin: 0;
}
.ant-menu-item-selected.nav-item {
  color: #004b8d;
}
.nav-text {
  font-family: "Open Sans", sans-serif;
  font-size: 20px;
}
.ant-scroll-number-only-unit {
  color: white;
}
.ant-scroll-number.ant-badge-count {
  background-color: #ffb74d;
}
.ant-badge-count {
  box-shadow: transparent;
}
</style>
