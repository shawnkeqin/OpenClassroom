<script>
import { Line, mixins } from "vue-chartjs";
const { reactiveProp } = mixins;

const options = {
  responsive: true,
  maintainAspectRatio: false
}

export default {
  extends: Line,
  mixins: [reactiveProp],
  mounted() {
    this.renderLineChart();
  },
  computed: {
    chartDatasets() {
      return this.datasets;
    }
  },
  methods: {
    renderLineChart() {
      this.renderChart(this.chartData, options);
    }
  },
  watch: {
    datasets() {
      this.$data._chart.destroy();
      this.renderLineChart();
    }
  }
};
</script>
