import { Line } from 'vue-chartjs'

export default {
  props: ['chartData', 'options'],
  extends: Line,
  mounted () {
    this.renderChart(this.chartData, this.options)
  }
}
