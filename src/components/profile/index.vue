<template>
  <div class="page-wrapper">
    <div class="content-block-wrapper">
      <h2>My Profile</h2>
      <ProfileCard />
    </div>
    <div class="content-block-wrapper">
      <h2>My Preferences</h2>
      <a-card :bodyStyle="{ padding: '0px' }">
        <a-list item-layout="horizontal" size="small">
          <a-list-item class="preference-item">
            <p>Email me when new requests for my seminars are created</p>
            <a-switch
              :checked="faculty.notif_new_request"
              :loading="isToggleNotifNewRequestLoading"
              @click="toggleNotifNewRequest"
              class="pref-toggle"
            />
          </a-list-item>
          <a-list-item
            class="preference-item"
            style="background-color: #F6F6F6"
          >
            <p>Email me when my pending requests are accepted/declined</p>
            <a-switch
              :checked="faculty.notif_request_update"
              :loading="isToggleNotifRequestUpdatetLoading"
              @click="toggleNotifRequestUpdate"
              class="pref-toggle"
            />
          </a-list-item>
          <!-- <a-list-item class="preference-item">
            <p>Email me 1 hour before the next visit</p>
            <a-switch default-checked />
          </a-list-item> -->
        </a-list>
      </a-card>
    </div>
    <UserStats />
  </div>
</template>

<script>
import queries from "@/graphql/queries.gql";
import store from "@/store";
import ProfileCard from "./ProfileCard";
import UserStats from "./UserStats";

export default {
  name: "Profile",
  components: {
    ProfileCard,
    UserStats
  },
  data() {
    return {
      faculty: {},
      isToggleNotifNewRequestLoading: false,
      isToggleNotifRequestUpdatetLoading: false,
      my_requests: []
    };
  },

  apollo: {
    faculty: {
      query: queries.getFacultyById,
      variables() {
        return {
          faculty_id: store.state.loggedInUser
        };
      },
      update: data => data.faculty_by_pk,
      error() {
        this.$notification.error({
          key: `fetch_faculty_data_failure`,
          message: "Failed to obtain data on your profile",
          description: "Please try again."
        });
      }
    }
  },
  methods: {
    async toggleNotifNewRequest() {
      this.isToggleNotifNewRequestLoading = true;
      const current_notif_new_request = this.faculty.notif_new_request;
      try {
        await this.$apollo.mutate({
          mutation: queries.update_faculty_notif_new_request,
          variables: {
            faculty_id: store.state.loggedInUser,
            notif_new_request: !current_notif_new_request
          },
          refetchQueries: ["getFacultyById"]
        });
        this.isToggleNotifNewRequestLoading = false;
      } catch (err) {
        this.isToggleNotifRequestUpdateLoading = false;
        this.$notification.error({
          key: `toggle_notif_new_request_error`,
          message: "The server could not update your user preference",
          description: "Please try again."
        });
      }
    },
    async toggleNotifRequestUpdate() {
      this.isToggleNotifRequestUpdateLoading = true;
      const faculty_id = this.faculty.id;
      const current_notif_request_update = this.faculty.notif_request_update;
      try {
        await this.$apollo.mutate({
          mutation: queries.update_faculty_notif_request_update,
          variables: {
            faculty_id,
            notif_request_update: !current_notif_request_update
          },
          refetchQueries: ["getFacultyById"]
        });
        this.isToggleNotifRequestUpdateLoading = false;
      } catch (err) {
        this.isToggleNotifRequestUpdateLoading = false;
        this.$notification.error({
          key: `toggle_notif_request_update_error`,
          message: "The server could not update your user preference",
          description: "Please try again."
        });
      }
    }
  }
};
</script>

<style scoped>
.preference-item {
  padding: 10px 20px 10px 20px;
}
.preference-item p {
  margin: 0;
}
</style>
