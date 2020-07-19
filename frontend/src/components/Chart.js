import { Line } from 'vue-chartjs'

export default {
  props: ['chartData', 'options'],
  extends: Line,
  mounted() {
    this.$emit('set-canvas', this.$refs.canvas)
  },
  watch: {
    chartData() {
      this.renderChart(this.chartData, this.options)
    }
  }
}
