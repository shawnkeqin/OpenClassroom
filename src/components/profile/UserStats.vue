<template>
  <div>
    <div class="content-block-wrapper">
      <h2>My Statistics</h2>
      <div style="display: flex; margin-bottom: 50px;">
        <a-checkbox v-model="isShowRequestsMade" class="graph-checkbox">
          Requests Made</a-checkbox
        >
        <a-checkbox v-model="isShowCompletedVisits" class="graph-checkbox"
          >Completed Visits</a-checkbox
        >
        <a-checkbox v-model="isShowRequestsReceived" class="graph-checkbox"
          >Requests Received</a-checkbox
        >
        <a-checkbox v-model="isShowHostedVisits" class="graph-checkbox"
          >Hosted Visits</a-checkbox
        >
      </div>
      <div
        v-show="
          isShowRequestsMade ||
            isShowCompletedVisits ||
            isShowRequestsReceived ||
            isShowHostedVisits
        "
        style="width: 100%;"
      >
        <a-spin v-if="$apollo.loading">
          <a-icon
            slot="indicator"
            type="loading"
            style="font-size: 26px; padding-left: 10px"
            spin
          />
        </a-spin>
        <div class="chart">
          <h3 v-if="isShowRequestsMade">
            My Requests Made
          </h3>
          <LineExample
            v-if="isShowRequestsMade"
            :labels="labels"
            :datasets="number_of_visit_requests.datasets"
          />
        </div>
        <div class="chart">
          <h3 v-if="isShowCompletedVisits">
            My Completed Visits
          </h3>
          <LineExample
            v-if="isShowCompletedVisits"
            :labels="labels4"
            :datasets="number_of_completed_visits.datasets4"
          />
        </div>
        <div class="chart">
          <h3 v-if="isShowRequestsReceived">
            My Requests Received
          </h3>
          <LineExample
            v-if="isShowRequestsReceived"
            :labels="labels2"
            :datasets="number_of_visit_requests_received.datasets2"
          />
        </div>
        <div class="chart">
          <h3 v-if="isShowHostedVisits">
            My Hosted Visits
          </h3>
          <LineExample
            v-if="isShowHostedVisits"
            :labels="labels3"
            :datasets="number_of_hosted_visits.datasets3"
          />
        </div>
      </div>
    </div>
    <div class="content-class-wrapper">
      <a-spin v-if="$apollo.loading">
        <a-icon
          slot="indicator"
          type="loading"
          style="font-size: 26px; padding-left: 10px"
          spin
        />
      </a-spin>
      <div v-else id="components-table-demo-size">
        <h4 style="text-align:center;">Average Statistics</h4>
        <a-table bordered :columns="columns" :data-source="data"></a-table>
      </div>
    </div>
  </div>
</template>

<script>
import queries from "@/graphql/queries.gql";
import queriesViz from "@/graphql/queriesViz.gql";
import store from "@/store";
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

const START_END_TIME_QUERY_VAR = {
  start_time: moment()
    .subtract(30, "days")
    .format(),
  end_time: moment().format(),
  start_time2: moment()
    .subtract(60, "days")
    .format(),
  end_time2: moment()
    .subtract(31, "days")
    .format(),
  start_time3: moment()
    .subtract(61, "days")
    .format(),
  end_time3: moment()
    .subtract(90, "days")
    .format()
};

// const VISIT_TYPES = ["visit3", "visit2", "visit1"];

export default {
  name: "userStats",
  components: {
    LineExample
  },
  data() {
    return {
      isShowRequestsMade: true,
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
      my_requests: [],
      columns
    };
  },

  apollo: {
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
      query: queriesViz.get_total_requests_by_user_history,
      variables() {
        return {
          ...START_END_TIME_QUERY_VAR,
          visitor_id: store.state.loggedInUser
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

    number_of_visit_requests_received_by_user: {
      query: queriesViz.get_total_requests_received_by_user_history,
      variables() {
        return {
          ...START_END_TIME_QUERY_VAR,
          faculty_id: store.state.loggedInUser
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

    number_of_hosted_visitors_by_user: {
      query: queriesViz.get_total_hosted_visits_by_user_history,
      variables() {
        return {
          ...START_END_TIME_QUERY_VAR,
          faculty_id: store.state.loggedInUser
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

    number_of_completed_visit_requests_made_by_user: {
      query: queriesViz.get_total_completed_visits_by_user_history,
      variables() {
        return {
          ...START_END_TIME_QUERY_VAR,
          visitor_id: store.state.loggedInUser
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

    total_number_of_visit_requests_across_all_users: {
      query: queriesViz.get_avg_requests_by_division_history,
      variables() {
        return {
          ...START_END_TIME_QUERY_VAR,
          division: "%"
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
      query: queriesViz.get_avg_requests_received_by_division_history,
      variables() {
        return {
          ...START_END_TIME_QUERY_VAR,
          division: "%"
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
      query: queriesViz.get_avg_hosted_visits_by_division_history,
      variables() {
        return {
          ...START_END_TIME_QUERY_VAR,
          division: "%"
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
      query: queriesViz.get_avg_completed_visits_by_division_history,
      variables() {
        return {
          ...START_END_TIME_QUERY_VAR,
          division: "%"
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
      query: queriesViz.get_avg_requests_by_division_history,
      variables() {
        return {
          ...START_END_TIME_QUERY_VAR,
          division: "Science"
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
      query: queriesViz.get_avg_requests_by_division_history,
      variables() {
        return {
          ...START_END_TIME_QUERY_VAR,
          division: "Social Sciences"
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
      query: queriesViz.get_avg_requests_by_division_history,
      variables() {
        return {
          ...START_END_TIME_QUERY_VAR,
          division: "Humanities"
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
      query: queriesViz.get_avg_completed_visits_by_division_history,
      variables() {
        return {
          ...START_END_TIME_QUERY_VAR,
          division: "Science"
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
      query: queriesViz.get_avg_completed_visits_by_division_history,
      variables() {
        return {
          ...START_END_TIME_QUERY_VAR,
          division: "Social Sciences"
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
      query: queriesViz.get_avg_completed_visits_by_division_history,
      variables() {
        return {
          ...START_END_TIME_QUERY_VAR,
          division: "Humanities"
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
      query: queriesViz.get_avg_requests_received_by_division_history,
      variables() {
        return {
          ...START_END_TIME_QUERY_VAR,
          division: "Science"
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
      query: queriesViz.get_avg_requests_received_by_division_history,
      variables() {
        return {
          ...START_END_TIME_QUERY_VAR,
          division: "Social Sciences"
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
      query: queriesViz.get_avg_requests_received_by_division_history,
      variables() {
        return {
          ...START_END_TIME_QUERY_VAR,
          division: "Humanities"
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
      query: queriesViz.get_avg_hosted_visits_by_division_history,
      variables() {
        return {
          ...START_END_TIME_QUERY_VAR,
          division: "Science"
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
      query: queriesViz.get_avg_hosted_visits_by_division_history,
      variables() {
        return {
          ...START_END_TIME_QUERY_VAR,
          division: "Social Sciences"
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
      query: queriesViz.get_avg_hosted_visits_by_division_history,
      variables() {
        return {
          ...START_END_TIME_QUERY_VAR,
          division: "Humanities"
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
            label: "My Requests Made",
            backgroundColor: "#1E90FF",
            data: [
              this.number_of_visit_requests_made_by_user.visit3.aggregate.count.toFixed(
                2
              ),
              this.number_of_visit_requests_made_by_user.visit2.aggregate.count.toFixed(
                2
              ),
              this.number_of_visit_requests_made_by_user.visit1.aggregate.count.toFixed(
                2
              )
            ],
            lineTension: 0,
            fill: false,
            showLine: true,
            borderColor: "rgb(0, 255, 0)"
          },
          {
            label: "Requests Made Across All Users",
            backgroundColor: "#f87979",
            data: this.average_visit_requests_made_across_all_users,

            lineTension: 0,
            fill: false,
            showLine: true,
            borderColor: "rgb(255, 0, 0)"
          },
          {
            label: "Requests Made Across Science Division",
            backgroundColor: "#05ffb0",
            data: this.average_visit_requests_made_across_division_science,
            lineTension: 0,
            fill: false,
            showLine: true,
            borderColor: "rgb(50, 115, 220)"
          },
          {
            label: "Requests Made Across Social Sciences Division",
            backgroundColor: "#05ffb0",
            data: this
              .average_visit_requests_made_across_division_social_sciences,
            lineTension: 0,
            fill: false,
            showLine: true,
            borderColor: "rgb(50, 115, 220, 0.3)"
          },
          {
            label: "Requests Made Across Humanities Division",
            backgroundColor: "#05ffb0",
            data: this.average_visit_requests_made_across_division_humanities,
            lineTension: 0,
            fill: false,
            showLine: true,
            borderColor: "rgb(255,99,71)"
          }
        ]
      };
    },
    number_of_visit_requests_received() {
      return {
        datasets2: [
          {
            label: "My Requests Received",
            backgroundColor: "#f87979",
            data: [
              this.number_of_visit_requests_received_by_user.visit3.aggregate.count.toFixed(
                2
              ),
              this.number_of_visit_requests_received_by_user.visit2.aggregate.count.toFixed(
                2
              ),
              this.number_of_visit_requests_received_by_user.visit1.aggregate.count.toFixed(
                2
              )
            ],
            lineTension: 0,
            fill: false,
            showLine: true,
            borderColor: "rgb(255, 0, 0)"
          },
          {
            label: "Requests Received Across All Users",
            backgroundColor: "#1E90FF",
            data: this.average_visit_requests_received_across_all_users,
            lineTension: 0,
            fill: false,
            showLine: true,
            borderColor: "rgb(0, 255, 0)"
          },
          {
            label: "Requests Received Across Science Divison",
            backgroundColor: "#1E90FF",
            data: this.average_visit_requests_received_across_division_science,
            lineTension: 0,
            fill: false,
            showLine: true,
            borderColor: "rgb(255,99,71)"
          },
          {
            label: "Requests Received Across Social Sciences Divison",
            backgroundColor: "#1E90FF",
            data: this
              .average_visit_requests_received_across_division_social_sciences,
            lineTension: 0,
            fill: false,
            showLine: true,
            borderColor: "rgb(238, 130, 238)"
          },
          {
            label: "Requests Received Across Humanities Divison",
            backgroundColor: "#1E90FF",
            data: this
              .average_visit_requests_received_across_division_humanities,
            lineTension: 0,
            fill: false,
            showLine: true,
            borderColor: "rgb(106, 90, 205)"
          }
        ]
      };
    },
    number_of_hosted_visits() {
      return {
        datasets3: [
          {
            label: "My Hosted Visits",
            backgroundColor: "#f87979",
            data: [
              this.number_of_hosted_visitors_by_user.visit3.aggregate.count.toFixed(
                2
              ),
              this.number_of_hosted_visitors_by_user.visit2.aggregate.count.toFixed(
                2
              ),
              this.number_of_hosted_visitors_by_user.visit1.aggregate.count.toFixed(
                2
              )
            ],
            lineTension: 0,
            fill: false,
            showLine: true,
            borderColor: "rgb(0, 0, 255)"
          },
          {
            label: "Hosted Visits Across All Users",
            backgroundColor: "#1E90FF",
            data: this.average_hosted_visits_across_all_users,
            lineTension: 0,
            fill: false,
            showLine: true,
            borderColor: "rgb(0, 255, 0)"
          },
          {
            label: "Hosted Visits Across Science Divison",
            backgroundColor: "#1E90FF",
            data: this.average_hosted_visits_across_divison_science,
            lineTension: 0,
            fill: false,
            showLine: true,
            borderColor: "rgb(106, 90, 205)"
          },
          {
            label: "Hosted Visits Across Social Sciences Divison",
            backgroundColor: "#1E90FF",
            data: this.average_hosted_visits_across_divison_social_sciences,
            lineTension: 0,
            fill: false,
            showLine: true,
            borderColor: "rgb(238, 130, 238)"
          },
          {
            label: "Hosted Visits Across Humanities Division",
            backgroundColor: "#1E90FF",
            data: this.average_hosted_visits_across_divison_humanities,
            lineTension: 0,
            fill: false,
            showLine: true,
            borderColor: "rgb(255,99,71)"
          }
        ]
      };
    },
    number_of_completed_visits() {
      return {
        datasets4: [
          {
            label: "My Completed Visits",
            backgroundColor: "#f87979",
            data: [
              this.number_of_completed_visit_requests_made_by_user.visit3.aggregate.count.toFixed(
                1
              ),
              this.number_of_completed_visit_requests_made_by_user.visit2.aggregate.count.toFixed(
                1
              ),
              this.number_of_completed_visit_requests_made_by_user.visit1.aggregate.count.toFixed(
                1
              )
            ],
            lineTension: 0,
            fill: false,
            showLine: true,
            borderColor: "rgba(255, 0, 0, 0.2)"
          },
          {
            label: "Completed Visits Across All Users",
            backgroundColor: "#1E90FF",
            data: this.average_completed_visit_requests_made_across_all_users,
            lineTension: 0,
            fill: false,
            showLine: true,
            borderColor: "rgb(0, 255, 0)"
          },
          {
            label: "Completed Visits Across Science Division",
            backgroundColor: "#1E90FF",
            data: this
              .average_completed_visit_requests_made_across_division_science,
            lineTension: 0,
            fill: false,
            showLine: true,
            borderColor: "rgb(255,99,71)"
          },
          {
            label: "Completed Visits Across Social Sciences Division",
            backgroundColor: "#1E90FF",
            data: this
              .average_completed_visit_requests_made_across_division_social_sciences,
            lineTension: 0,
            fill: false,
            showLine: true,
            borderColor: "rgb(238, 130, 238)"
          },
          {
            label: "Completed Visits Across Humanities Division",
            backgroundColor: "#1E90FF",
            data: this
              .average_completed_visit_requests_made_across_division_humanities,
            lineTension: 0,
            fill: false,
            showLine: true,
            borderColor: "rgb(106, 90, 205)"
          }
        ]
      };
    },

    average_visit_requests_made_across_all_users() {
      var data = [];

      data.push(
        this.getAverage(
          this.total_number_of_visit_requests_across_all_users.faculty_aggregate
            .aggregate.count,
          this.total_number_of_visit_requests_across_all_users.visit3.aggregate
            .count
        )
      );

      data.push(
        this.getAverage(
          this.total_number_of_visit_requests_across_all_users.faculty_aggregate
            .aggregate.count,
          this.total_number_of_visit_requests_across_all_users.visit2.aggregate
            .count
        )
      );

      data.push(
        this.getAverage(
          this.total_number_of_visit_requests_across_all_users.faculty_aggregate
            .aggregate.count,
          this.total_number_of_visit_requests_across_all_users.visit1.aggregate
            .count
        )
      );

      return data.length == 3 ? data : null;
    },

    average_completed_visit_requests_made_across_all_users() {
      var data = [];

      data.push(
        this.getAverage(
          this.total_number_of_completed_visit_requests_across_all_users
            .faculty_aggregate.aggregate.count,
          this.total_number_of_completed_visit_requests_across_all_users.visit3
            .aggregate.count
        )
      );

      data.push(
        this.getAverage(
          this.total_number_of_completed_visit_requests_across_all_users
            .faculty_aggregate.aggregate.count,
          this.total_number_of_completed_visit_requests_across_all_users.visit2
            .aggregate.count
        )
      );

      data.push(
        this.getAverage(
          this.total_number_of_completed_visit_requests_across_all_users
            .faculty_aggregate.aggregate.count,
          this.total_number_of_completed_visit_requests_across_all_users.visit1
            .aggregate.count
        )
      );

      return data.length == 3 ? data : null;
    },
    average_visit_requests_received_across_all_users() {
      var data = [];

      data.push(
        this.getAverage(
          this.total_number_of_visit_requests_received_across_all_users
            .faculty_aggregate.aggregate.count,
          this.total_number_of_visit_requests_received_across_all_users.visit3
            .aggregate.count
        )
      );

      data.push(
        this.getAverage(
          this.total_number_of_visit_requests_received_across_all_users
            .faculty_aggregate.aggregate.count,
          this.total_number_of_visit_requests_received_across_all_users.visit2
            .aggregate.count
        )
      );
      data.push(
        this.getAverage(
          this.total_number_of_visit_requests_received_across_all_users
            .faculty_aggregate.aggregate.count,
          this.total_number_of_visit_requests_received_across_all_users.visit1
            .aggregate.count
        )
      );

      return data.length == 3 ? data : null;
    },
    average_hosted_visits_across_all_users() {
      var data = [];

      data.push(
        this.getAverage(
          this.total_number_of_hosted_visits_across_all_users.faculty_aggregate
            .aggregate.count,
          this.total_number_of_hosted_visits_across_all_users.visit3.aggregate
            .count
        )
      );

      data.push(
        this.getAverage(
          this.total_number_of_hosted_visits_across_all_users.faculty_aggregate
            .aggregate.count,
          this.total_number_of_hosted_visits_across_all_users.visit2.aggregate
            .count
        )
      );
      data.push(
        this.getAverage(
          this.total_number_of_hosted_visits_across_all_users.faculty_aggregate
            .aggregate.count,
          this.total_number_of_hosted_visits_across_all_users.visit1.aggregate
            .count
        )
      );

      return data.length == 3 ? data : null;
    },

    average_visit_requests_made_across_division_science() {
      var data = [];

      data.push(
        this.getAverage(
          this.visit_requests_made_across_division_science.faculty_aggregate
            .aggregate.count,
          this.visit_requests_made_across_division_science.visit3.aggregate
            .count
        )
      );

      data.push(
        this.getAverage(
          this.visit_requests_made_across_division_science.faculty_aggregate
            .aggregate.count,
          this.visit_requests_made_across_division_science.visit2.aggregate
            .count
        )
      );
      data.push(
        this.getAverage(
          this.visit_requests_made_across_division_science.faculty_aggregate
            .aggregate.count,
          this.visit_requests_made_across_division_science.visit1.aggregate
            .count
        )
      );

      return data.length == 3 ? data : null;
    },
    average_visit_requests_made_across_division_social_sciences() {
      var data = [];

      data.push(
        this.getAverage(
          this.visit_requests_made_across_division_social_sciences
            .faculty_aggregate.aggregate.count,
          this.visit_requests_made_across_division_social_sciences.visit3
            .aggregate.count
        )
      );

      data.push(
        this.getAverage(
          this.visit_requests_made_across_division_social_sciences
            .faculty_aggregate.aggregate.count,
          this.visit_requests_made_across_division_social_sciences.visit2
            .aggregate.count
        )
      );
      data.push(
        this.getAverage(
          this.visit_requests_made_across_division_social_sciences
            .faculty_aggregate.aggregate.count,
          this.visit_requests_made_across_division_social_sciences.visit1
            .aggregate.count
        )
      );

      return data.length == 3 ? data : null;
    },
    average_visit_requests_made_across_division_humanities() {
      var data = [];

      data.push(
        this.getAverage(
          this.visit_requests_made_across_division_humanities.faculty_aggregate
            .aggregate.count,
          this.visit_requests_made_across_division_humanities.visit3.aggregate
            .count
        )
      );

      data.push(
        this.getAverage(
          this.visit_requests_made_across_division_humanities.faculty_aggregate
            .aggregate.count,
          this.visit_requests_made_across_division_humanities.visit2.aggregate
            .count
        )
      );
      data.push(
        this.getAverage(
          this.visit_requests_made_across_division_humanities.faculty_aggregate
            .aggregate.count,
          this.visit_requests_made_across_division_humanities.visit1.aggregate
            .count
        )
      );

      return data.length == 3 ? data : null;
    },
    average_completed_visit_requests_made_across_division_science: function() {
      var data = [];

      data.push(
        this.getAverage(
          this.completed_visit_requests_made_across_division_science
            .faculty_aggregate.aggregate.count,
          this.completed_visit_requests_made_across_division_science.visit3
            .aggregate.count
        )
      );

      data.push(
        this.getAverage(
          this.completed_visit_requests_made_across_division_science
            .faculty_aggregate.aggregate.count,
          this.completed_visit_requests_made_across_division_science.visit2
            .aggregate.count
        )
      );
      data.push(
        this.getAverage(
          this.completed_visit_requests_made_across_division_science
            .faculty_aggregate.aggregate.count,
          this.completed_visit_requests_made_across_division_science.visit1
            .aggregate.count
        )
      );

      return data.length == 3 ? data : null;
    },
    average_completed_visit_requests_made_across_division_social_sciences: function() {
      var data = [];

      data.push(
        this.getAverage(
          this.completed_visit_requests_made_across_division_social_sciences
            .faculty_aggregate.aggregate.count,
          this.completed_visit_requests_made_across_division_social_sciences
            .visit3.aggregate.count
        )
      );

      data.push(
        this.getAverage(
          this.completed_visit_requests_made_across_division_social_sciences
            .faculty_aggregate.aggregate.count,
          this.completed_visit_requests_made_across_division_social_sciences
            .visit2.aggregate.count
        )
      );
      data.push(
        this.getAverage(
          this.completed_visit_requests_made_across_division_social_sciences
            .faculty_aggregate.aggregate.count,
          this.completed_visit_requests_made_across_division_social_sciences
            .visit1.aggregate.count
        )
      );

      return data.length == 3 ? data : null;
    },
    average_completed_visit_requests_made_across_division_humanities() {
      var data = [];

      data.push(
        this.getAverage(
          this.completed_visit_requests_made_across_division_humanities
            .faculty_aggregate.aggregate.count,
          this.completed_visit_requests_made_across_division_humanities.visit3
            .aggregate.count
        )
      );

      data.push(
        this.getAverage(
          this.completed_visit_requests_made_across_division_humanities
            .faculty_aggregate.aggregate.count,
          this.completed_visit_requests_made_across_division_humanities.visit2
            .aggregate.count
        )
      );
      data.push(
        this.getAverage(
          this.completed_visit_requests_made_across_division_humanities
            .faculty_aggregate.aggregate.count,
          this.completed_visit_requests_made_across_division_humanities.visit1
            .aggregate.count
        )
      );

      return data.length == 3 ? data : null;
    },
    average_visit_requests_received_across_division_science() {
      var data = [];

      data.push(
        this.getAverage(
          this.visit_requests_received_across_division_science.faculty_aggregate
            .aggregate.count,
          this.visit_requests_received_across_division_science.visit3.aggregate
            .count
        )
      );

      data.push(
        this.getAverage(
          this.visit_requests_received_across_division_science.faculty_aggregate
            .aggregate.count,
          this.visit_requests_received_across_division_science.visit2.aggregate
            .count
        )
      );
      data.push(
        this.getAverage(
          this.visit_requests_received_across_division_science.faculty_aggregate
            .aggregate.count,
          this.visit_requests_received_across_division_science.visit1.aggregate
            .count
        )
      );

      return data.length == 3 ? data : null;
    },
    average_visit_requests_received_across_division_social_sciences() {
      var data = [];

      data.push(
        this.getAverage(
          this.visit_requests_received_across_division_social_sciences
            .faculty_aggregate.aggregate.count,
          this.visit_requests_received_across_division_social_sciences.visit3
            .aggregate.count
        )
      );

      data.push(
        this.getAverage(
          this.visit_requests_received_across_division_social_sciences
            .faculty_aggregate.aggregate.count,
          this.visit_requests_received_across_division_social_sciences.visit2
            .aggregate.count
        )
      );
      data.push(
        this.getAverage(
          this.visit_requests_received_across_division_social_sciences
            .faculty_aggregate.aggregate.count,
          this.visit_requests_received_across_division_social_sciences.visit1
            .aggregate.count
        )
      );

      return data.length == 3 ? data : null;
    },
    average_visit_requests_received_across_division_humanities: function() {
      var data = [];

      data.push(
        this.getAverage(
          this.visit_requests_received_across_division_humanities
            .faculty_aggregate.aggregate.count,
          this.visit_requests_received_across_division_humanities.visit3
            .aggregate.count
        )
      );

      data.push(
        this.getAverage(
          this.visit_requests_received_across_division_humanities
            .faculty_aggregate.aggregate.count,
          this.visit_requests_received_across_division_humanities.visit2
            .aggregate.count
        )
      );
      data.push(
        this.getAverage(
          this.visit_requests_received_across_division_humanities
            .faculty_aggregate.aggregate.count,
          this.visit_requests_received_across_division_humanities.visit1
            .aggregate.count
        )
      );

      return data.length == 3 ? data : null;
    },
    average_hosted_visits_across_divison_science: function() {
      var data = [];

      data.push(
        this.getAverage(
          this.hosted_visits_across_division_science.faculty_aggregate.aggregate
            .count,
          this.hosted_visits_across_division_science.visit3.aggregate.count
        )
      );

      data.push(
        this.getAverage(
          this.hosted_visits_across_division_science.faculty_aggregate.aggregate
            .count,
          this.hosted_visits_across_division_science.visit2.aggregate.count
        )
      );
      data.push(
        this.getAverage(
          this.hosted_visits_across_division_science.faculty_aggregate.aggregate
            .count,
          this.hosted_visits_across_division_science.visit1.aggregate.count
        )
      );

      return data.length == 3 ? data : null;
    },
    average_hosted_visits_across_divison_social_sciences: function() {
      var data = [];

      data.push(
        this.getAverage(
          this.hosted_visits_across_division_social_sciences.faculty_aggregate
            .aggregate.count,
          this.hosted_visits_across_division_social_sciences.visit3.aggregate
            .count
        )
      );

      data.push(
        this.getAverage(
          this.hosted_visits_across_division_social_sciences.faculty_aggregate
            .aggregate.count,
          this.hosted_visits_across_division_social_sciences.visit2.aggregate
            .count
        )
      );
      data.push(
        this.getAverage(
          this.hosted_visits_across_division_social_sciences.faculty_aggregate
            .aggregate.count,
          this.hosted_visits_across_division_social_sciences.visit1.aggregate
            .count
        )
      );

      return data.length == 3 ? data : null;
    },
    average_hosted_visits_across_divison_humanities: function() {
      var data = [];

      data.push(
        this.getAverage(
          this.hosted_visits_across_division_humanities.faculty_aggregate
            .aggregate.count,
          this.hosted_visits_across_division_humanities.visit3.aggregate.count
        )
      );

      data.push(
        this.getAverage(
          this.hosted_visits_across_division_humanities.faculty_aggregate
            .aggregate.count,
          this.hosted_visits_across_division_humanities.visit2.aggregate.count
        )
      );
      data.push(
        this.getAverage(
          this.hosted_visits_across_division_humanities.faculty_aggregate
            .aggregate.count,
          this.hosted_visits_across_division_humanities.visit1.aggregate.count
        )
      );

      return data.length == 3 ? data : null;
    },
    data() {
      return [
        {
          key: 0,
          date: "My Statistics",
          requestsMade: this.number_of_visit_requests_made_by_user.visit1
            .aggregate.count,
          requestsReceived: this.number_of_visit_requests_received_by_user
            .visit1.aggregate.count,
          hostedVisits: this.number_of_hosted_visitors_by_user.visit1.aggregate
            .count,
          completedVisits: this.number_of_completed_visit_requests_made_by_user
            .visit1.aggregate.count
        },
        {
          key: 1,
          date: "Average Stats Across Division (Science)",
          requestsMade: this
            .average_visit_requests_made_across_division_science[2],
          requestsReceived: this
            .average_visit_requests_received_across_division_science[2],
          hostedVisits: this.average_hosted_visits_across_divison_science[2],
          completedVisits: this
            .average_completed_visit_requests_made_across_division_science[2]
        },
        {
          key: 2,
          date: "Average Stats Across Division (Social Sciences)",
          requestsMade: this
            .average_visit_requests_made_across_division_social_sciences[2],
          requestsReceived: this
            .average_visit_requests_received_across_division_social_sciences[2],
          hostedVisits: this
            .average_hosted_visits_across_divison_social_sciences[2],
          completedVisits: this
            .average_completed_visit_requests_made_across_division_social_sciences[2]
        },
        {
          key: 3,
          date: "Average Stats Across Division (Humanities)",
          requestsMade: this
            .average_visit_requests_made_across_division_humanities[2],
          requestsReceived: this
            .average_visit_requests_received_across_division_humanities[2],
          hostedVisits: this.average_hosted_visits_across_divison_humanities[2],
          completedVisits: this
            .average_completed_visit_requests_made_across_division_humanities[2]
        },
        {
          key: 4,
          date: "Average Stats Across All Users",
          requestsMade: this.average_visit_requests_made_across_all_users[2],
          requestsReceived: this
            .average_visit_requests_received_across_all_users[2],
          hostedVisits: this.average_hosted_visits_across_all_users[2],
          completedVisits: this
            .average_completed_visit_requests_made_across_all_users[2]
        }
      ];
    }
  },
  methods: {
    getAverage(count, sum) {
      count != undefined ? count : 0;
      sum != undefined ? sum : 0;
      const average = sum / count;
      return average.toFixed(1);
    }
  }
};
</script>

<style scoped>
.chart {
  margin-bottom: 50px;
}
</style>
