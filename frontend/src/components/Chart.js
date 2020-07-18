import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  props: ['options'],
  mixins: [reactiveProp],
  extends: Line,
  mounted () {
    this.renderChart(this.chartData, this.options)
  }
}
