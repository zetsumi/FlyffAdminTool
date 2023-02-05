<script>
import { Line, mixins } from 'vue-chartjs';
const { reactiveProp } = mixins;

export default {
  extends: Line,
  mixins: [reactiveProp],
  data() {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              id: 'CPU',
              type: 'linear',
              position: 'left',
              ticks: {
                min: 0,
                callback: (value) => {
                  return this.$options.filters.percent(value, 2, 1);
                },
              },
              scaleLabel: {
                display: true,
                labelString: 'CPU',
                fontColor: '#3b4545',
              },
            },
            {
              id: 'RAM',
              type: 'linear',
              position: 'right',
              ticks: {
                callback: (value) => {
                  return this.$options.filters.bytes(value);
                },
              },
              scaleLabel: {
                display: true,
                labelString: 'RAM',
                fontColor: '#008080',
              },
            },
          ],
        },
      },
    };
  },
  mounted() {
    this.renderChart(this.chartData, this.options);
  },
};
</script>
