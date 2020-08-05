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
    <div>
      <a-button v-on:click="isShowRequestsMade = !isShowRequestsMade">
        Average Requests Made
      </a-button>
      &nbsp;
      <a-button v-on:click="isShowRequestsReceived = !isShowRequestsReceived">
        Average Requests Received
      </a-button>
      &nbsp;
      <a-button v-on:click="isShowHostedVisits = !isShowHostedVisits">
        Average Hosted Visits
      </a-button>
      &nbsp;
      <a-button v-on:click="isShowCompletedVisits = !isShowCompletedVisits">
        Average Completed Visits
      </a-button>
    </div>
    <div v-show="isShowRequestsMade">
      <LineExample
        v-if="isShowRequestsMade"
        :labels="labels"
        :datasets="number_of_visit_requests.datasets"
      />
    </div>
    <div v-show="isShowRequestsReceived">
      <LineExample
        v-if="isShowRequestsReceived"
        :labels="labels2"
        :datasets="number_of_visit_requests_received.datasets2"
      />
    </div>
    <div v-show="isShowHostedVisits">
      <LineExample
        v-if="isShowHostedVisits"
        :labels="labels3"
        :datasets="number_of_hosted_visits.datasets3"
      />
    </div>
    <div v-show="isShowCompletedVisits">
      <LineExample
        v-if="isShowCompletedVisits"
        :labels="labels4"
        :datasets="number_of_completed_visits.datasets4"
      />
    </div>
    <div>
      <a-spin v-if="$apollo.loading">
        <a-icon
          slot="indicator"
          type="loading"
          style="font-size: 26px; padding-left: 10px"
          spin
        />
      </a-spin>
      <div v-else id="components-table-demo-size">
        <h4>Average Statistics</h4>
        <a-table bordered :columns="columns" :data-source="data"> </a-table>
      </div>
      <br />

      <!-- <visitRequestChart
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
      /> -->
    </div>
  </div>
</template>

<script>
import queries from "@/graphql/queries.gql";
import queriesViz from "@/graphql/queriesViz.gql";
import store from "@/store";
//import visitRequestChart from "./visitRequestChart";
import moment from "moment";
import LineExample from "./LineChart";
var months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
var currentMonth = new Date().getMonth();
const columns = [
  {
    title: "Statistics",
    dataIndex: "date",
    width: 200
  },
  {
    title: "Requests Made",
    dataIndex: "requestsMade",
    width: 100
  },
  {
    title: "Requests Received",
    dataIndex: "requestsReceived",
    width: 100
  },
  {
    title: "Hosted Visits",
    dataIndex: "hostedVisits",
    width: 100
  },
  {
    title: "Completed Visits",
    dataIndex: "completedVisits",
    width: 100
  }
];
/*const data = [
  {
    key: 0,
    date: "My Statistics",
    requestsMade: 120,
    requestsReceived: 31,
    hostedVisits: 12,
    completedVisits: 15
  },
  {
    key: 1,
    date: "Average Stats Across Division",
    requestsMade: 123,
    requestsReceived: 35,
    hostedVisits: 11,
    completedVisits: 13
  },
  {
    key: 2,
    date: "Average Stats Across All Users",
    requestsMade: 11,
    requestsReceived: 312,
    hostedVisits: 4,
    completedVisits: 12
  }
]; */
export default {
  name: "Profile",
  components: {
    //visitRequestChart,
    LineExample
  },
  data() {
    console.log(moment().format());
    return {
      isShowRequestsMade: false,
      isShowRequestsReceived: false,
      isShowHostedVisits: false,
      isShowCompletedVisits: false,
      labels: months
        .slice(currentMonth - 2)
        .concat(months.slice(0, currentMonth)),
      labels2: months
        .slice(currentMonth - 2)
        .concat(months.slice(0, currentMonth)),
      labels3: months
        .slice(currentMonth - 2)
        .concat(months.slice(0, currentMonth)),
      labels4: months
        .slice(currentMonth - 2)
        .concat(months.slice(0, currentMonth)),
      faculty: {},
      isToggleNotifNewRequestLoading: false,
      isToggleNotifRequestUpdatetLoading: false,
      my_requests: [],
      //   data,
      columns
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
      query: queriesViz.get_total_requests_by_user,
      variables() {
        return {
          visitor_id: store.state.loggedInUser,
          //    start_time: "2020-07-01T05:28:23.186523+00:00",
          //    end_time: "2020-07-23T05:28:23.186523+00:00"
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
    },
    number_of_visit_requests_made_by_user_1_month_before: {
      query: queries.number_of_visit_requests_made_by_user,
      variables() {
        return {
          visitor_id: store.state.loggedInUser,
          //    start_time: "2020-07-01T05:28:23.186523+00:00",
          //    end_time: "2020-07-23T05:28:23.186523+00:00"
          start_time: moment()
            .subtract(60, "days")
            .format(),
          end_time: moment()
            .subtract(30, "days")
            .format()
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
    },
    number_of_visit_requests_made_by_user_2_month_before: {
      query: queries.number_of_visit_requests_made_by_user,
      variables() {
        return {
          visitor_id: store.state.loggedInUser,
          //    start_time: "2020-07-01T05:28:23.186523+00:00",
          //    end_time: "2020-07-23T05:28:23.186523+00:00"
          start_time: moment()
            .subtract(90, "days")
            .format(),
          end_time: moment()
            .subtract(60, "days")
            .format()
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
    },

    number_of_visit_requests_received_by_user: {
      query: queriesViz.get_total_requests_received_by_user,
      variables() {
        return {
          faculty_id: store.state.loggedInUser,
          //  start_time: "2020-07-01T05:28:23.186523+00:00",
          //  end_time: "2020-07-23T05:28:23.186523+00:00"
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
    },
    number_of_visit_requests_received_by_user_1_month_before: {
      query: queries.number_of_visit_requests_received_by_user,
      variables() {
        return {
          faculty_id: store.state.loggedInUser,
          //  start_time: "2020-07-01T05:28:23.186523+00:00",
          //  end_time: "2020-07-23T05:28:23.186523+00:00"
          start_time: moment()
            .subtract(60, "days")
            .format(),
          end_time: moment()
            .subtract(30, "days")
            .format()
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
    },
    number_of_visit_requests_received_by_user_2_month_before: {
      query: queries.number_of_visit_requests_received_by_user,
      variables() {
        return {
          faculty_id: store.state.loggedInUser,
          //  start_time: "2020-07-01T05:28:23.186523+00:00",
          //  end_time: "2020-07-23T05:28:23.186523+00:00"
          start_time: moment()
            .subtract(90, "days")
            .format(),
          end_time: moment()
            .subtract(60, "days")
            .format()
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
    },
    number_of_hosted_visitors_by_user: {
      query: queriesViz.get_total_hosted_visits_by_user,
      variables() {
        return {
          faculty_id: store.state.loggedInUser,
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
    },
    number_of_hosted_visitors_by_user_1_month_before: {
      query: queries.number_of_hosted_visitors_by_user,
      variables() {
        return {
          faculty_id: store.state.loggedInUser,
          // start_time: "2020-07-01T05:28:23.186523+00:00",
          // end_time: "2020-07-23T05:28:23.186523+00:00"
          start_time: moment()
            .subtract(60, "days")
            .format(),
          end_time: moment()
            .subtract(30, "days")
            .format()
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
    },
    number_of_hosted_visitors_by_user_2_month_before: {
      query: queries.number_of_hosted_visitors_by_user,
      variables() {
        return {
          faculty_id: store.state.loggedInUser,
          // start_time: "2020-07-01T05:28:23.186523+00:00",
          // end_time: "2020-07-23T05:28:23.186523+00:00"
          start_time: moment()
            .subtract(90, "days")
            .format(),
          end_time: moment()
            .subtract(60, "days")
            .format()
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
    },
    number_of_completed_visit_requests_made_by_user: {
      query: queriesViz.get_total_completed_visits_by_user,
      variables() {
        return {
          visitor_id: store.state.loggedInUser,
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
    },
    number_of_completed_visit_requests_made_by_user_1_month_before: {
      query: queries.number_of_completed_visit_requests_made_by_user,
      variables() {
        return {
          visitor_id: store.state.loggedInUser,
          // start_time: "2020-07-01T05:28:23.186523+00:00",
          // end_time: "2020-07-23T05:28:23.186523+00:00"
          start_time: moment()
            .subtract(60, "days")
            .format(),
          end_time: moment()
            .subtract(30, "days")
            .format()
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
    },
    number_of_completed_visit_requests_made_by_user_2_month_before: {
      query: queries.number_of_completed_visit_requests_made_by_user,
      variables() {
        return {
          visitor_id: store.state.loggedInUser,
          // start_time: "2020-07-01T05:28:23.186523+00:00",
          // end_time: "2020-07-23T05:28:23.186523+00:00"
          start_time: moment()
            .subtract(90, "days")
            .format(),
          end_time: moment()
            .subtract(60, "days")
            .format()
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
    },
    total_number_of_visit_requests_across_all_users: {
      query: queriesViz.get_avg_requests_by_division,
      variables() {
        return {
          division: "%",
          start_time: moment()
            .subtract(30, "days")
            .format(),
          end_time: moment().format()
        };
      },
      update: data => data,
      error(error, vm, key) {
        this.$notification.error({
          key,
          message: "Server error",
          description: "Please try again."
        });
      }
    },
    total_number_of_visit_requests_received_across_all_users: {
      query: queriesViz.get_avg_requests_received_by_division,
      variables() {
        return {
          division: "%",
          start_time: moment()
            .subtract(30, "days")
            .format(),
          end_time: moment().format()
        };
      },
      update: data => data,
      error(error, vm, key) {
        this.$notification.error({
          key,
          message: "Server error",
          description: "Please try again."
        });
      }
    },
    total_number_of_hosted_visits_across_all_users: {
      query: queriesViz.get_avg_hosted_visits_by_division,
      variables() {
        return {
          division: "%",
          start_time: moment()
            .subtract(30, "days")
            .format(),
          end_time: moment().format()
        };
      },
      update: data => data,
      error(error, vm, key) {
        this.$notification.error({
          key,
          message: "Server error",
          description: "Please try again."
        });
      }
    },
    total_number_of_completed_visit_requests_across_all_users: {
      query: queriesViz.get_avg_completed_visits_by_division,
      variables() {
        return {
          division: "%",
          start_time: moment()
            .subtract(30, "days")
            .format(),
          end_time: moment().format()
        };
      },
      update: data => data,
      error(error, vm, key) {
        this.$notification.error({
          key,
          message: "Server error",
          description: "Please try again."
        });
      }
    },
    visit_requests_made_across_division_science: {
      query: queriesViz.get_avg_requests_by_division,
      variables() {
        return {
          division: "Science",
          start_time: moment()
            .subtract(30, "days")
            .format(),
          end_time: moment().format()
        };
      },
      update: data => data,
      error(error, vm, key) {
        this.$notification.error({
          key,
          message: "Server error",
          description: "Please try again."
        });
      }
    },
    visit_requests_made_across_division_social_sciences: {
      query: queriesViz.get_avg_requests_by_division,
      variables() {
        return {
          division: "Social Sciences",
          start_time: moment()
            .subtract(30, "days")
            .format(),
          end_time: moment().format()
        };
      },
      update: data => data,
      error(error, vm, key) {
        this.$notification.error({
          key,
          message: "Server error",
          description: "Please try again."
        });
      }
    },
    visit_requests_made_across_division_humanities: {
      query: queriesViz.get_avg_requests_by_division,
      variables() {
        return {
          division: "Humanities",
          start_time: moment()
            .subtract(30, "days")
            .format(),
          end_time: moment().format()
        };
      },
      update: data => data,
      error(error, vm, key) {
        this.$notification.error({
          key,
          message: "Server error",
          description: "Please try again."
        });
      }
    },
    completed_visit_requests_made_across_division_science: {
      query: queriesViz.get_avg_completed_visits_by_division,
      variables() {
        return {
          division: "Science",
          start_time: moment()
            .subtract(30, "days")
            .format(),
          end_time: moment().format()
        };
      },
      update: data => data,
      error(error, vm, key) {
        this.$notification.error({
          key,
          message: "Server error",
          description: "Please try again."
        });
      }
    },
    completed_visit_requests_made_across_division_social_sciences: {
      query: queriesViz.get_avg_completed_visits_by_division,
      variables() {
        return {
          division: "Social Sciences",
          start_time: moment()
            .subtract(30, "days")
            .format(),
          end_time: moment().format()
        };
      },
      update: data => data,
      error(error, vm, key) {
        this.$notification.error({
          key,
          message: "Server error",
          description: "Please try again."
        });
      }
    },
    completed_visit_requests_made_across_division_humanities: {
      query: queriesViz.get_avg_completed_visits_by_division,
      variables() {
        return {
          division: "Humanities",
          start_time: moment()
            .subtract(30, "days")
            .format(),
          end_time: moment().format()
        };
      },
      update: data => data,
      error(error, vm, key) {
        this.$notification.error({
          key,
          message: "Server error",
          description: "Please try again."
        });
      }
    },
    visit_requests_received_across_division_science: {
      query: queriesViz.get_avg_requests_received_by_division,
      variables() {
        return {
          division: "Science",
          start_time: moment()
            .subtract(30, "days")
            .format(),
          end_time: moment().format()
        };
      },
      update: data => data,
      error(error, vm, key) {
        this.$notification.error({
          key,
          message: "Server error",
          description: "Please try again."
        });
      }
    },
    visit_requests_received_across_division_social_sciences: {
      query: queriesViz.get_avg_requests_received_by_division,
      variables() {
        return {
          division: "Social Sciences",
          start_time: moment()
            .subtract(30, "days")
            .format(),
          end_time: moment().format()
        };
      },
      update: data => data,
      error(error, vm, key) {
        this.$notification.error({
          key,
          message: "Server error",
          description: "Please try again."
        });
      }
    },
    visit_requests_received_across_division_humanities: {
      query: queriesViz.get_avg_requests_received_by_division,
      variables() {
        return {
          division: "Humanities",
          start_time: moment()
            .subtract(30, "days")
            .format(),
          end_time: moment().format()
        };
      },
      update: data => data,
      error(error, vm, key) {
        this.$notification.error({
          key,
          message: "Server error",
          description: "Please try again."
        });
      }
    },
    hosted_visits_across_division_science: {
      query: queriesViz.get_avg_hosted_visits_by_division,
      variables() {
        return {
          division: "Science",
          start_time: moment()
            .subtract(30, "days")
            .format(),
          end_time: moment().format()
        };
      },
      update: data => data,
      error(error, vm, key) {
        this.$notification.error({
          key,
          message: "Server error",
          description: "Please try again."
        });
      }
    },
    hosted_visits_across_division_social_sciences: {
      query: queriesViz.get_avg_hosted_visits_by_division,
      variables() {
        return {
          division: "Social Sciences",
          start_time: moment()
            .subtract(30, "days")
            .format(),
          end_time: moment().format()
        };
      },
      update: data => data,
      error(error, vm, key) {
        this.$notification.error({
          key,
          message: "Server error",
          description: "Please try again."
        });
      }
    },
    hosted_visits_across_division_humanities: {
      query: queriesViz.get_avg_hosted_visits_by_division,
      variables() {
        return {
          division: "Humanities",
          start_time: moment()
            .subtract(30, "days")
            .format(),
          end_time: moment().format()
        };
      },
      update: data => data,
      error(error, vm, key) {
        this.$notification.error({
          key,
          message: "Server error",
          description: "Please try again."
        });
      }
    }
  },
  computed: {
    number_of_visit_requests() {
      return {
        datasets: [
          {
            label: "Average Requests Made",
            backgroundColor: "#1E90FF",
            data: [
              this.number_of_visit_requests_made_by_user_2_month_before,
              this.number_of_visit_requests_made_by_user_1_month_before,
              this.number_of_visit_requests_made_by_user
            ],
            lineTension: 0,
            fill: false,
            showLine: true,
            borderColor: "rgb(0, 255, 0)"
          }
        ]
      };
    },
    number_of_visit_requests_received() {
      return {
        datasets2: [
          {
            label: "Average Requests Received",
            backgroundColor: "#f87979",
            data: [
              this.number_of_visit_requests_received_by_user_2_month_before,
              this.number_of_visit_requests_received_by_user_1_month_before,
              this.number_of_visit_requests_received_by_user
            ],
            lineTension: 0,
            fill: false,
            showLine: true,
            borderColor: "rgb(255, 0, 0)"
          }
        ]
      };
    },
    number_of_hosted_visits() {
      return {
        datasets3: [
          {
            label: "Average Hosted Visits",
            backgroundColor: "#f87979",
            data: [
              this.number_of_hosted_visitors_by_user_2_month_before,
              this.number_of_hosted_visitors_by_user_1_month_before,
              this.number_of_hosted_visitors_by_user
            ],
            lineTension: 0,
            fill: false,
            showLine: true,
            borderColor: "rgb(0, 0, 255)"
          }
        ]
      };
    },
    number_of_completed_visits() {
      return {
        datasets4: [
          {
            label: "Average Completed Visits",
            backgroundColor: "#f87979",
            data: [
              this
                .number_of_completed_visit_requests_made_by_user_2_month_before,
              this
                .number_of_completed_visit_requests_made_by_user_1_month_before,
              this.number_of_completed_visit_requests_made_by_user
            ],
            lineTension: 0,
            fill: false,
            showLine: true,
            borderColor: "rgba(255, 0, 0, 0.2)"
          }
        ]
      };
    },

    average_visit_requests_made_across_all_users: function() {
      var count =
        this.total_number_of_visit_requests_across_all_users != undefined
          ? this.total_number_of_visit_requests_across_all_users
              .faculty_aggregate.aggregate.count
          : 0;
      var sum =
        this.total_number_of_visit_requests_across_all_users != undefined
          ? this.total_number_of_visit_requests_across_all_users.visit_aggregate
              .aggregate.count
          : 0;

      var average = 0;

      average = sum / count;

      return average.toFixed(2);
    },
    average_completed_visit_requests_made_across_all_users: function() {
      var count =
        this.total_number_of_completed_visit_requests_across_all_users !=
        undefined
          ? this.total_number_of_completed_visit_requests_across_all_users
              .faculty_aggregate.aggregate.count
          : 0;
      var sum =
        this.total_number_of_completed_visit_requests_across_all_users !=
        undefined
          ? this.total_number_of_completed_visit_requests_across_all_users
              .visit_aggregate.aggregate.count
          : 0;
      var average = 0;

      average = sum / count;

      return average.toFixed(2);
    },
    average_visit_requests_received_across_all_users: function() {
      var count =
        this.total_number_of_visit_requests_received_across_all_users !=
        undefined
          ? this.total_number_of_visit_requests_received_across_all_users
              .faculty_aggregate.aggregate.count
          : 0;
      var sum =
        this.total_number_of_visit_requests_received_across_all_users !=
        undefined
          ? this.total_number_of_visit_requests_received_across_all_users
              .visit_aggregate.aggregate.count
          : 0;
      var average = 0;

      average = sum / count;

      return average.toFixed(2);
    },
    average_hosted_visits_across_all_users: function() {
      var count =
        this.total_number_of_hosted_visits_across_all_users != undefined
          ? this.total_number_of_hosted_visits_across_all_users
              .faculty_aggregate.aggregate.count
          : 0;
      var sum =
        this.total_number_of_hosted_visits_across_all_users != undefined
          ? this.total_number_of_hosted_visits_across_all_users.visit_aggregate
              .aggregate.count
          : 0;
      var average = 0;

      average = sum / count;
      return average.toFixed(2);
    },

    average_visit_requests_made_across_division_science: function() {
      var count =
        this.visit_requests_made_across_division_science != undefined
          ? this.visit_requests_made_across_division_science.faculty_aggregate
              .aggregate.count
          : 0;
      var sum =
        this.visit_requests_made_across_division_science != undefined
          ? this.visit_requests_made_across_division_science.visit_aggregate
              .aggregate.count
          : 0;

      var average = 0;

      average = sum / count;
      return average.toFixed(2);
    },
    average_visit_requests_made_across_division_social_sciences: function() {
      var count =
        this.visit_requests_made_across_division_social_sciences != undefined
          ? this.visit_requests_made_across_division_social_sciences
              .faculty_aggregate.aggregate.count
          : 0;
      var sum =
        this.visit_requests_made_across_division_social_sciences != undefined
          ? this.visit_requests_made_across_division_social_sciences
              .visit_aggregate.aggregate.count
          : 0;

      var average = 0;

      average = sum / count;
      return average.toFixed(2);
    },
    average_visit_requests_made_across_division_humanities: function() {
      var count =
        this.visit_requests_made_across_division_humanities != undefined
          ? this.visit_requests_made_across_division_humanities
              .faculty_aggregate.aggregate.count
          : 0;
      var sum =
        this.visit_requests_made_across_division_humanities != undefined
          ? this.visit_requests_made_across_division_humanities.visit_aggregate
              .aggregate.count
          : 0;

      var average = 0;

      average = sum / count;
      return average.toFixed(2);
    },
    average_completed_visit_requests_made_across_division_science: function() {
      var count =
        this.completed_visit_requests_made_across_division_science != undefined
          ? this.completed_visit_requests_made_across_division_science
              .faculty_aggregate.aggregate.count
          : 0;
      var sum =
        this.completed_visit_requests_made_across_division_science != undefined
          ? this.completed_visit_requests_made_across_division_science
              .visit_aggregate.aggregate.count
          : 0;
      var average = 0;
      average = sum / count;
      return average.toFixed(2);
    },
    average_completed_visit_requests_made_across_division_social_sciences: function() {
      var count =
        this.completed_visit_requests_made_across_division_social_sciences !=
        undefined
          ? this.completed_visit_requests_made_across_division_social_sciences
              .faculty_aggregate.aggregate.count
          : 0;
      var sum =
        this.completed_visit_requests_made_across_division_social_sciences !=
        undefined
          ? this.completed_visit_requests_made_across_division_social_sciences
              .visit_aggregate.aggregate.count
          : 0;
      var average = 0;
      average = sum / count;
      return average.toFixed(2);
    },
    average_completed_visit_requests_made_across_division_humanities: function() {
      var count =
        this.completed_visit_requests_made_across_division_humanities !=
        undefined
          ? this.completed_visit_requests_made_across_division_humanities
              .faculty_aggregate.aggregate.count
          : 0;
      var sum =
        this.completed_visit_requests_made_across_division_humanities !=
        undefined
          ? this.completed_visit_requests_made_across_division_humanities
              .visit_aggregate.aggregate.count
          : 0;
      var average = 0;
      average = sum / count;
      return average.toFixed(2);
    },
    average_visit_requests_received_across_division_science: function() {
      var count =
        this.visit_requests_received_across_division_science != undefined
          ? this.visit_requests_received_across_division_science
              .faculty_aggregate.aggregate.count
          : 0;
      var average = 0;
      var sum =
        this.visit_requests_received_across_division_science != undefined
          ? this.visit_requests_received_across_division_science.visit_aggregate
              .aggregate.count
          : 0;
      average = sum / count;
      return average.toFixed(2);
    },
    average_visit_requests_received_across_division_social_sciences: function() {
      var count =
        this.visit_requests_received_across_division_social_sciences !=
        undefined
          ? this.visit_requests_received_across_division_social_sciences
              .faculty_aggregate.aggregate.count
          : 0;
      var average = 0;
      var sum =
        this.visit_requests_received_across_division_social_sciences !=
        undefined
          ? this.visit_requests_received_across_division_social_sciences
              .visit_aggregate.aggregate.count
          : 0;
      average = sum / count;
      return average.toFixed(2);
    },
    average_visit_requests_received_across_division_humanities: function() {
      var count =
        this.visit_requests_received_across_division_humanities != undefined
          ? this.visit_requests_received_across_division_humanities
              .faculty_aggregate.aggregate.count
          : 0;
      var average = 0;
      var sum =
        this.visit_requests_received_across_division_humanities != undefined
          ? this.visit_requests_received_across_division_humanities
              .visit_aggregate.aggregate.count
          : 0;
      average = sum / count;
      return average.toFixed(2);
    },
    average_hosted_visits_across_divison_science: function() {
      var count =
        this.hosted_visits_across_division_science != undefined
          ? this.hosted_visits_across_division_science.faculty_aggregate
              .aggregate.count
          : 0;
      var average = 0;
      var sum =
        this.hosted_visits_across_division_science != undefined
          ? this.hosted_visits_across_division_science.visit_aggregate.aggregate
              .count
          : 0;
      average = sum / count;
      return average.toFixed(2);
    },
    average_hosted_visits_across_divison_social_sciences: function() {
      var count =
        this.hosted_visits_across_division_social_sciences != undefined
          ? this.hosted_visits_across_division_social_sciences.faculty_aggregate
              .aggregate.count
          : 0;
      var average = 0;
      var sum =
        this.hosted_visits_across_division_social_sciences != undefined
          ? this.hosted_visits_across_division_social_sciences.visit_aggregate
              .aggregate.count
          : 0;
      average = sum / count;
      return average.toFixed(2);
    },
    average_hosted_visits_across_divison_humanities: function() {
      var count =
        this.hosted_visits_across_division_humanities != undefined
          ? this.hosted_visits_across_division_humanities.faculty_aggregate
              .aggregate.count
          : 0;
      var average = 0;
      var sum =
        this.hosted_visits_across_division_humanities != undefined
          ? this.hosted_visits_across_division_humanities.visit_aggregate
              .aggregate.count
          : 0;
      average = sum / count;
      return average.toFixed(2);
    },
    data() {
      return [
        {
          key: 0,
          date: "My Statistics",
          requestsMade: this.number_of_visit_requests_made_by_user,
          requestsReceived: this.number_of_visit_requests_received_by_user,
          hostedVisits: this.number_of_hosted_visitors_by_user,
          completedVisits: this.number_of_completed_visit_requests_made_by_user
        },
        {
          key: 1,
          date: "Average Stats Across Division (Science)",
          requestsMade: this
            .average_visit_requests_made_across_division_science,
          requestsReceived: this
            .average_visit_requests_received_across_division_science,
          hostedVisits: this.average_hosted_visits_across_divison_science,
          completedVisits: this
            .average_completed_visit_requests_made_across_division_science
        },
        {
          key: 2,
          date: "Average Stats Across Division (Social Sciences)",
          requestsMade: this
            .average_visit_requests_made_across_division_social_sciences,
          requestsReceived: this
            .average_visit_requests_received_across_division_social_sciences,
          hostedVisits: this
            .average_hosted_visits_across_divison_social_sciences,
          completedVisits: this
            .average_completed_visit_requests_made_across_division_social_sciences
        },
        {
          key: 3,
          date: "Average Stats Across Division (Humanities)",
          requestsMade: this
            .average_visit_requests_made_across_division_humanities,
          requestsReceived: this
            .average_visit_requests_received_across_division_humanities,
          hostedVisits: this.average_hosted_visits_across_divison_humanities,
          completedVisits: this
            .average_completed_visit_requests_made_across_division_humanities
        },
        {
          key: 4,
          date: "Average Stats Across All Users",
          requestsMade: this.average_visit_requests_made_across_all_users,
          requestsReceived: this
            .average_visit_requests_received_across_all_users,
          hostedVisits: this.average_hosted_visits_across_all_users,
          completedVisits: this
            .average_completed_visit_requests_made_across_all_users
        }
      ];
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

#components-table-demo-size h4 {
  margin-bottom: 16px;
}
</style>
