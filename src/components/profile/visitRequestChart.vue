<script>
import { Line, mixins } from "vue-chartjs";
const { reactiveProp } = mixins;
//import moment from "moment";
//import queries from "@/graphql/queries.gql";
export default {
  name: "visitRequestChart",
  extends: Line,
  mixins: [reactiveProp],
  props: [
    "number_of_visit_requests_made_by_user",
    "number_of_completed_visit_requests_made_by_user",
    "number_of_hosted_visit_sessions_by_user",
    "number_of_hosted_visitors_by_user"
  ],
  /*data() {
    return {
      number_of_visit_requests_made_by_user: [],
      number_of_completed_visit_requests_made_by_user: [],
      number_of_hosted_visit_sessions_by_user: [],
      number_of_hosted_visitors_by_user: []
    };
  }, */
  /* apollo: {
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
      update: data => data.seminar_aggregate
    },
    number_of_completed_visit_requests_made_by_user: {
      query: queries.number_of_completed_visit_requests_made_by_user,
      variables() {
        return {
          visitor_id: "yncas",
          //  start_time: "2020-07-01T05:28:23.186523+00:00",
          // end_time: "2020-07-23T05:28:23.186523+00:00"
          start_time: moment()
            .subtract(30, "days")
            .format(),
          end_time: moment().format()
        };
      },
      update: data => data.seminar_aggregate
    },
    number_of_hosted_visit_sessions_by_user: {
      query: queries.number_of_hosted_visit_sessions_by_user,
      variables() {
        return {
          faculty_id: "yncas",
          //  start_time: "2020-07-01T05:28:23.186523+00:00",
          //  end_time: "2020-07-23T05:28:23.186523+00:00"
          start_time: moment()
            .subtract(30, "days")
            .format(),
          end_time: moment().format()
        };
      },
      update: data => data.seminar_aggregate
    },
    number_of_hosted_visitors_by_user: {
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
      update: data => data.seminar
    }
  }, */
  mounted() {
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
    /*  var number_of_hosted_visitors = 0;
    for (var i = 0; i < this.number_of_hosted_visitors_by_user.length; i++) {
      number_of_hosted_visitors += this.number_of_hosted_visitors_by_user
        .visits_aggregate[i].aggregate.count;
    } */
    this.renderChart({
      labels: months
        .slice(currentMonth - 3)
        .concat(months.slice(0, currentMonth)),
      datasets: [
        {
          label: "Visits Requested",
          backgroundColor: "#f87979",
          data: [0, 0, 0, this.number_of_visit_requests_made_by_user],
          lineTension: 0,
          fill: false,
          showLine: true,
          borderColor: "rgb(255, 0, 0)"
        },
        {
          label: "Completed Visits",
          backgroundColor: "#1E90FF",
          data: [0, 0, 0, this.number_of_completed_visit_requests_made_by_user],
          lineTension: 0,
          fill: false,
          showLine: true,
          borderColor: "rgb(0, 0, 255)"
        },
        {
          label: "Hosted Visit Sessions",
          backgroundColor: "#1E90FF",
          data: [0, 0, 0, this.number_of_hosted_visit_sessions_by_user],
          lineTension: 0,
          fill: false,
          showLine: true,
          borderColor: "rgb(0, 255, 0)"
        },
        {
          label: "Hosted Visitors",
          backgroundColor: "#1E90FF",
          data: [0, 0, 0, this.number_of_hosted_visitors_by_user],
          lineTension: 0,
          fill: false,
          showLine: true,
          borderColor: "rgba(255, 0, 0, 0.2)"
        }
      ]
    });
  }
};
</script>
