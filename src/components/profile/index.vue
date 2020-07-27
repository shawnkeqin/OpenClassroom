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
      <div id="components-table-demo-size">
        <h4>Average Statistics</h4>
        <a-table :columns="columns" :data-source="data" size="middle" />
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
      <div v-show="isShowRequestsMade">
        <LineExample
          v-if="isShowRequestsMade"
          :labels="labels"
          :datasets="datasets"
        />
      </div>
      <div v-show="isShowRequestsReceived">
        <LineExample
          v-if="isShowRequestsReceived"
          :labels="labels2"
          :datasets="datasets2"
        />
      </div>
      <div v-show="isShowHostedVisits">
        <LineExample
          v-if="isShowHostedVisits"
          :labels="labels3"
          :datasets="datasets3"
        />
      </div>
      <div v-show="isShowCompletedVisits">
        <LineExample
          v-if="isShowCompletedVisits"
          :labels="labels4"
          :datasets="datasets4"
        />
      </div>
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
    title: "Stats",
    dataIndex: "name"
  },
  {
    title: "Average Requests Made",
    dataIndex: "age"
  },
  {
    title: "Average Requests Received",
    dataIndex: "age"
  },
  {
    title: "Average Hosted Visits",
    dataIndex: "age"
  },
  {
    title: "Average Completed Visits",
    dataIndex: "age"
  }
];
const data = [
  {
    key: "1",
    name: "Data for User",
    age: 32,
    address: "New York No. 1 Lake Park"
  },
  {
    key: "2",
    name: "Data across Divisions",
    age: 42,
    address: "London No. 1 Lake Park"
  },
  {
    key: "3",
    name: "Data Across All Users",
    age: 32,
    address: "Sidney No. 1 Lake Park"
  }
];
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
        .slice(currentMonth - 3)
        .concat(months.slice(0, currentMonth)),
      labels2: months
        .slice(currentMonth - 3)
        .concat(months.slice(0, currentMonth)),
      labels3: months
        .slice(currentMonth - 3)
        .concat(months.slice(0, currentMonth)),
      labels4: months
        .slice(currentMonth - 3)
        .concat(months.slice(0, currentMonth)),
      faculty: {},
      isToggleNotifNewRequestLoading: false,
      isToggleNotifRequestUpdatetLoading: false,
      my_requests: [],
      number_of_visit_requests_made_by_user: null,
      data,
      columns,
      datasets: [
        {
          label: "Average Requests Made",
          backgroundColor: "#1E90FF",
          data: [0, 0, 0, 4],
          lineTension: 0,
          fill: false,
          showLine: true,
          borderColor: "rgb(0, 255, 0)"
        }
      ],
      datasets2: [
        {
          label: "Average Requests Received",
          backgroundColor: "#f87979",
          data: [0, 0, 0, 3],
          lineTension: 0,
          fill: false,
          showLine: true,
          borderColor: "rgb(255, 0, 0)"
        }
      ],
      datasets3: [
        {
          label: "Average Hosted Visits",
          backgroundColor: "#f87979",
          data: [0, 0, 2, 1],
          lineTension: 0,
          fill: false,
          showLine: true,
          borderColor: "rgb(0, 0, 255)"
        }
      ],
      datasets4: [
        {
          label: "Average Completed Visits",
          backgroundColor: "#f87979",
          data: [0, 0, 5, 2],
          lineTension: 0,
          fill: false,
          showLine: true,
          borderColor: "rgba(255, 0, 0, 0.2)"
        }
      ]
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
      update: data => data.faculty_by_pk
    },
    my_requests: {
      query: queries.get_seminars_with_visits_by_time_requested,
      variables() {
        return {
          faculty_id: store.state.loggedInUser
        };
      },
      update: data => data.seminar
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
      update: data => data.seminar_aggregate.aggregate.count
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
      update: data => data.seminar_aggregate.aggregate.count
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
      update: data => data.seminar_aggregate.aggregate.count
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
      update: data => data.visit_aggregate.aggregate.count
    }
  },
  methods: {
    async toggleNotifNewRequest() {
      this.isToggleNotifNewRequestLoading = true;
      const faculty_id = this.faculty.id;
      const current_notif_new_request = this.faculty.notif_new_request;
      await this.$apollo.mutate({
        mutation: queries.update_faculty_notif_new_request,
        variables: {
          faculty_id,
          notif_new_request: !current_notif_new_request
        },
        refetchQueries: ["getFacultyById"]
      });
      this.isToggleNotifNewRequestLoading = false;
    },
    async toggleNotifRequestUpdate() {
      this.isToggleNotifRequestUpdateLoading = true;
      const faculty_id = this.faculty.id;
      const current_notif_request_update = this.faculty.notif_request_update;
      await this.$apollo.mutate({
        mutation: queries.update_faculty_notif_request_update,
        variables: {
          faculty_id,
          notif_request_update: !current_notif_request_update
        },
        refetchQueries: ["getFacultyById"]
      });
      this.isToggleNotifRequestUpdateLoading = false;
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
