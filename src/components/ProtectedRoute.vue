<template>
  <a-layout>
    <a-alert v-if="showConsent" type="info" show-icon>
      <template slot="message">
        <div>
          View and agree to the terms of the app to start making visits
          requests.
        </div>
        <div style="margin-bottom: 5px;">
          Once you agree, visitors will be able to submit visit requests for
          your classes: please CLOSE your classroom to visits under My Courses
          if you do not wish to receive these requests.
        </div>
        <ConsentForm />
      </template>
    </a-alert>
    <a-layout-content>
      <a-layout style="padding: 0; background: #f6f6f6">
        <a-layout-sider width="12rem" style="background: #fff;">
          <div id="mini-user-info">
            <template v-if="loggedInUserObj">
              <a-avatar
                :src="loggedInUserObj.profilePic || '/avatar_default.png'"
                size="large"
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
              <span class="nav-text">My Profile</span>
              <router-link to="/profile" />
            </a-menu-item>
            <a-menu-item :ey="2" class="nav-item">
              <a-icon type="unordered-list" />
              <span class="nav-text">My Courses</span>
              <router-link to="/my-courses" />
            </a-menu-item>
            <a-menu-item key="3" class="nav-item">
              <a-icon type="search" />
              <span class="nav-text">Search Classes</span>
              <router-link to="/search-courses" />
            </a-menu-item>
            <a-menu-item key="4" class="nav-item">
              <a-icon type="calendar" />
              <span class="nav-text">My Calendar</span>
              <router-link to="/calendar-view" />
            </a-menu-item>
            <a-menu-item key="5" class="nav-item">
              <a-icon type="import" />
              <a-badge
                :count="pendingVisitsCount"
                :offset="[10, 5]"
                :number-style="{
                  backgroundColor: '#ffb74d',
                  color: 'white',
                  boxShadow: 'transparent'
                }"
              >
                <span class="nav-text">My Visitors</span>
              </a-badge>
              <router-link to="/my-visitors" />
            </a-menu-item>
            <a-menu-item key="6" class="nav-item">
              <a-icon type="export" />
              <span class="nav-text">My Visits</span>
              <router-link to="/my-visits" />
            </a-menu-item>
            <a-menu-item key="7" class="nav-item">
              <a-icon type="form" />
              <span class="nav-text">Feedback</span>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLScOfSV1ZIChd6IQJ9WLegujtfhlE-E5hG-tyDMBzEL-JUdEUQ/viewform?usp=sf_link"
                target="_blank"
              ></a>
            </a-menu-item>
            <a-menu-item key="8" class="nav-item" @click="logout">
              <a-icon type="logout" class="icon" />
              <span class="nav-text">Log out</span>
            </a-menu-item>
          </a-menu>
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
      loggedInUser: store.state.loggedInUser,
      error: ""
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
    $skipAll() {
      return !this.loggedInUser;
    },
    loggedInUserObj: {
      query: queries.getFacultyById,
      variables() {
        return { faculty_id: this.loggedInUser };
      },
      update: data => data.faculty_by_pk,
      skip() {
        return this.loggedInUser === null;
      },
      error(err) {
        this.error = err;
      }
    },
    pendingVisitsCount: {
      query: queries.getPendingVisitsCount,
      variables() {
        return {
          faculty_id: this.loggedInUser,
          semester_code: process.env.VUE_APP_SEMESTER_CODE
        };
      },
      update: data => data.visit_aggregate.aggregate.count,
      fetchPolicy: "network-only",
      error(err) {
        this.error = err;
      }
    }
  },
  computed: {
    showConsent() {
      return (
        this.loggedInUserObj && this.loggedInUserObj.has_consented == false
      );
    }
  },
  watch: {
    pendingVisitsCount(count) {
      this.$notification.close("PENDING_VISITS");
      if (count) {
        this.$notification.warn({
          key: "PENDING_VISITS",
          message: `${count} pending visit request${count > 1 ? "s" : ""}`,
          description:
            "Head over to My Visitors page to review your incoming visit requests.",
          duration: 0
        });
      }
    },
    error(err) {
      if (err.gqlError.extensions.code !== "invalid-jwt")
        this.$notification.error({
          message: "Failed to obtain data from database",
          description: err.toString(),
          duration: 0
        });
    }
  }
};
</script>
<style scoped>
li.nav-item.ant-menu-item {
  display: flex;
  align-items: center;
  margin: 0;
  padding: 1rem;
}
.ant-menu-item-selected.nav-item {
  color: #004b8d;
}
.nav-text {
  font-family: "Open Sans", sans-serif;
  font-size: 1rem;
}
#mini-user-info {
  display: flex;
  align-items: center;
  padding: 20px;
  background-image: linear-gradient(315deg, #f3c9bc 0%, #f5e4b3 74%);
}
.anticon > svg {
  width: 1.2rem;
  height: 1.2rem;
}
</style>
