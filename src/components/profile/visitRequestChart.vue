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
  /*computed: {
    chartData: function() {
      return (
        this.number_of_visit_requests_made_by_user,
        this.number_of_completed_visit_requests_made_by_user,
        this.number_of_hosted_visit_sessions_by_user,
        this.number_of_hosted_visitors_by_user
      );
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
    this.renderChart(
      {
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
            data: [
              0,
              0,
              0,
              this.number_of_completed_visit_requests_made_by_user
            ],
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
      },
      { responsive: true, maintainAspectRatio: false }
    );
  }
  /*watch: {
    data: function() {
      this._chart.destroy();
      //this.renderChart(this.data, this.options);
      this.renderChart();
    }
  } */
};
</script>
