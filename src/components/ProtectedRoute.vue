<template>
  <a-layout id="components-layout-demo-top-side">
    <a-alert v-if="showConsent" type="info" show-icon>
      <template slot="message">
        <p style="margin-bottom: 5px;">
          View and agree to the terms of the app to start making vists requests.
        </p>
        <ConsentForm />
      </template>
    </a-alert>
    <a-layout-content>
      <a-layout style="padding: 0; background: #f6f6f6">
        <a-layout-sider width="250px" style="background: #fff">
          <div id="mini-user-info">
            <template v-if="loggedInUserObj">
              <img
                class="avatar-medium"
                :src="
                  loggedInUserObj.profilePic ||
                    'https://toppng.com/uploads/preview/app-icon-set-login-icon-comments-avatar-icon-11553436380yill0nchdm.png'
                "
                style="margin-right: 15px;"
              />
              <div style="font-weight: bold; color: #004b8d;">
                {{ loggedInUserObj.name }}
              </div>
            </template>
            <template v-else>
              <a-icon type="loading" />
            </template>
          </div>
          <a-menu
            mode="inline"
            :default-selected-keys="['1']"
            :default-open-keys="['sub1']"
            style="padding-top: 10px;"
          >
            <a-menu-item :key="1" class="nav-item">
              <a-icon type="user" />
              <span class="nav-text">My profile</span>
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
            <a-menu-item key="8" class="nav-item" @click="logout">
              <a-icon type="logout" />
              <span class="nav-text">Log out</span>
            </a-menu-item>
          </a-menu>
          <div style="position: absolute; bottom: 0; padding: 15px;">
            <!-- <template v-if="loggedInUserObj">
              <a-button
                @click="logout"
                style="display: flex; justify-content: center; align-items: center; padding: 20px;"
              >
                <a-icon type="logout" style="margin-right: 10px;"/>
                <h3 style="margin: 0;">Log out</h3>
              </a-button>
              <a-button icon="logout" @click="logout" style="margin: 0;">Log Out</a-button>
            </template>
            <template v-else>
              <a-icon type="loading" />
            </template> -->
          </div>
        </a-layout-sider>
        <a-layout-content
          style="display: flex; justify-content: center; padding: 30px 50px 30px 50px; height: 100vh;"
        >
          <component :is="component" />
        </a-layout-content>
      </a-layout>
    </a-layout-content>
  </a-layout>
</template>
<script>
import constants from "../utils/constants";
import queries from "../graphql/queries.gql";
import ConsentForm from "./ConsentForm";
import auth from "@/auth";
import store from "@/store";
export default {
  components: { ConsentForm },
  props: ["component"],
  data() {
    return {
      constants: constants,
      queries: queries,
      loggedInUserObj: null,
      loggedInUser: store.state.loggedInUser
    };
  },
  beforeCreate() {
    if (!auth.isAuthenticated()) {
      this.$router.push({ path: "/login" });
    }
  },
  created() {
    auth.addListener("session-expired-event", this.onSessionExpiredEvent);
  },
  destroyed() {
    auth.removeListener("session-expired-event", this.onSessionExpiredEvent);
  },
  methods: {
    onSessionExpiredEvent() {
      this.$message.info("User session has expired, please log in again");
    },
    logout() {
      auth.logout();
    }
  },
  apollo: {
    loggedInUserObj: {
      query: queries.getFacultyById,
      variables() {
        return { faculty_id: this.loggedInUser };
      },
      update: data => data.faculty_by_pk,
      skip() {
        return this.loggedInUser === null;
      }
    },
    pendingVisitsCount: {
      query: queries.getPendingVisitsCount,
      variables() {
        return {
          visitor_id: this.loggedInUser,
          semester_code: process.env.VUE_APP_SEMESTER_CODE
        };
      },
      update: data => data.visit_aggregate.aggregate.count
    }
  },
  computed: {
    showConsent() {
      return (
        this.loggedInUserObj && this.loggedInUserObj.has_consented == false
      );
    }
    // pendingVisitsCount() {
    //   const count =
    //     this.pendingVisitsCount &&
    //     this.pendingVisitsCount
    //       .map(seminar => seminar.visits)
    //       .flat()
    //       .filter(visit => visit.visit_status === "PENDING").length;
    //   return count;
    // }
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

/* .logged-in-status-box {
  position: fixed;
  padding-left: 25px;
  bottom: 15px;
  width: 250px;
  height: 80px;
  color: #004b8d;
  background-color: white;
}
.logout-button {
  margin-top: 10px;
} */
#mini-user-info {
  display: flex;
  /* justify-content: center; */
  align-items: center;
  padding: 20px;
  background-image: linear-gradient(315deg, #f3c9bc 0%, #f5e4b3 74%);
}
</style>
