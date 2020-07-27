<template>
  <div class="page-wrapper">
    <div class="content-block-wrapper">
      <h1>My profile</h1>
      <a-card style="width: 40rem">
        <a-row type="flex" align="middle" :gutter="20">
          <a-col :xs="24" :sm="8" align="middle" justify="center">
            <a-avatar
              :size="160"
              :src="
                faculty.profilePic ||
                  'https://toppng.com/uploads/preview/app-icon-set-login-icon-comments-avatar-icon-11553436380yill0nchdm.png'
              "
              style="color: #004b8d;"
            />
          </a-col>
          <a-col>
            <h5>Name</h5>
            <p>{{ faculty.name }}</p>
            <h5>Staff ID</h5>
            <p>{{ faculty.id }}</p>
            <h5>Email</h5>
            <p style="margin: 0">{{ faculty.email }}</p>
          </a-col>
        </a-row>
      </a-card>
    </div>
    <div>
      <a-descriptions
        title="Average Statistics"
        bordered
        :column="{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }"
      >
        <a-descriptions-item label="Average Visits Requested">
          0
        </a-descriptions-item>
        <a-descriptions-item label="Average Completed Visits">
          0
        </a-descriptions-item>
        <a-descriptions-item label="Average Hosted Visits Sessions">
          0
        </a-descriptions-item>
        <a-descriptions-item label="Average Hosted Visitors">
          0
        </a-descriptions-item>
      </a-descriptions>
      <br />

      <visitRequestChart
        :number_of_visit_requests_made_by_user="
          number_of_visit_requests_made_by_user
        "
        :number_of_completed_visit_requests_made_by_user="
          number_of_completed_visit_requests_made_by_user
        "
        :number_of_hosted_visit_sessions_by_user="
          number_of_hosted_visit_sessions_by_user
        "
        :number_of_hosted_visitors_by_user="number_of_hosted_visitors_by_user"
      />
    </div>
    <div class="content-block-wrapper">
      <h2>My Preferences</h2>
      <a-card style="width: 40rem" :bodyStyle="{ padding: '0px' }">
        <a-list item-layout="horizontal" size="small">
          <a-list-item class="preference-item">
            <p>Email me when new requests for my seminars are created</p>
            <a-switch
              :checked="faculty.notif_new_request"
              :loading="isToggleNotifNewRequestLoading"
              @click="toggleNotifNewRequest"
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
            />
          </a-list-item>
          <a-list-item class="preference-item">
            <p>Email me 1 hour before the next visit</p>
            <a-switch default-checked />
          </a-list-item>
        </a-list>
      </a-card>
    </div>
  </div>
</template>

<script>
import queries from "@/graphql/queries.gql";
import store from "@/store";
import visitRequestChart from "./visitRequestChart";
import moment from "moment";
export default {
  name: "Profile",
  components: { visitRequestChart },
  data() {
    console.log(moment().format());
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
    },
    my_requests: {
      query: queries.get_seminars_with_visits_by_time_requested,
      variables() {
        return {
          faculty_id: store.state.loggedInUser
        };
      },
      update: data => data.seminar,
      error(error, vm, key) {
        this.$notification.error({
          key,
          message: "Server error",
          description: "Please try again."
        });
      }
    },
    number_of_visit_requests_made_by_user: {
      query: queries.number_of_visit_requests_made_by_user,
      variables() {
        return {
          visitor_id: "yncas",
          //    start_time: "2020-07-01T05:28:23.186523+00:00",
          //    end_time: "2020-07-23T05:28:23.186523+00:00"
          start_time: moment()
            .subtract(30, "days")
            .format(),
          end_time: moment().format()
        };
      },
      update: data => data.seminar_aggregate.aggregate.count,
      error(error, vm, key) {
        this.$notification.error({
          key,
          message: "Server error",
          description: "Please try again."
        });
      }
    },
    number_of_completed_visit_requests_made_by_user: {
      query: queries.number_of_completed_visit_requests_made_by_user,
      variables() {
        return {
          visitor_id: "yncas",
          //  start_time: "2020-07-01T05:28:23.186523+00:00",
          //  end_time: "2020-07-23T05:28:23.186523+00:00"
          start_time: moment()
            .subtract(30, "days")
            .format(),
          end_time: moment().format()
        };
      },
      update: data => data.seminar_aggregate.aggregate.count,
      error(error, vm, key) {
        this.$notification.error({
          key,
          message: "Server error",
          description: "Please try again."
        });
      }
    },
    number_of_hosted_visit_sessions_by_user: {
      query: queries.number_of_hosted_visit_sessions_by_user,
      variables() {
        return {
          faculty_id: "yncas",
          // start_time: "2020-07-01T05:28:23.186523+00:00",
          // end_time: "2020-07-23T05:28:23.186523+00:00"
          start_time: moment()
            .subtract(30, "days")
            .format(),
          end_time: moment().format()
        };
      },
      update: data => data.seminar_aggregate.aggregate.count,
      error(error, vm, key) {
        this.$notification.error({
          key,
          message: "Server error",
          description: "Please try again."
        });
      }
    },
    number_of_hosted_visitors_by_user: {
      query: queries.number_of_hosted_visitors_by_user,
      variables() {
        return {
          faculty_id: "yncas",
          // start_time: "2020-07-01T05:28:23.186523+00:00",
          // end_time: "2020-07-23T05:28:23.186523+00:00"
          start_time: moment()
            .subtract(30, "days")
            .format(),
          end_time: moment().format()
        };
      },
      update: data => data.visit_aggregate.aggregate.count,
      error(error, vm, key) {
        this.$notification.error({
          key,
          message: "Server error",
          description: "Please try again."
        });
      }
    }
  },
  methods: {
    async toggleNotifNewRequest() {
      this.isToggleNotifNewRequestLoading = true;
      const faculty_id = this.faculty.id;
      const current_notif_new_request = this.faculty.notif_new_request;
      try {
        await this.$apollo.mutate({
          mutation: queries.update_faculty_notif_new_request,
          variables: {
            faculty_id,
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
#profile-card-container {
  display: flex;
  flex-direction: row;
}
#profile-details {
  margin-left: 30px;
}
.preference-item {
  padding: 10px 20px 10px 20px;
}
.preference-item p {
  margin: 0;
}
</style>
