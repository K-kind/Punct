<template>
  <div>
    <div>
      <Chart :chartData="chartData" :options="options" />
    </div>
  </div>
</template>

<script>
import { GET } from '@/store/mutation-types'
import Chart from '@/components/Chart.js'
export default {
  name: 'TasksChart',
  components: {
    Chart
  },
  data () {
    return {
      calendars: [],
    }
  },
  computed: {
    labelDates() {
      return this.calendars.map(cal =>
        this.$dayjs(cal.date).format('M/Dddd')
      )
    },
    elapsedSums() {
      return this.calendars.map(cal =>
        this.toHours(cal.elapsed_sum)
      )
    },
    expectedSums() {
      return this.calendars.map(cal =>
        this.toHours(cal.expected_sum)
      )
    },
    chartData() {
      return {
        labels: this.labelDates,
        datasets: [
          {
            label: '実測時間 (h)',
            data: this.elapsedSums,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          },
          {
            label: '予定時間 (h)',
            data: this.expectedSums,
            borderColor: '#CFD8DC',
            fill: false,
            type: 'line',
            lineTension: 0.3,
          }
        ]
      }
    },
    options() {
      return {
        responsive: true,
        maintainAspectRatio: false,
      }
    }
  },
  methods: {
    toHours(sum) {
      if (!sum) return 0;

      // const m = Math.ceil(sum / (1000 * 60))
      // return Math.ceil(sum / (1000 * 60 * 60))
      return Math.round(sum / (1000 * 60 * 60) * 10) / 10
    }
  },
  created() {
    this.$store.dispatch(
      `http/${GET}`,
      { url: 'tasks/chart', params: { fromBase: this.fromBase } }
    ).then(res => {
      this.calendars = res.data.calendars
    })
  },
}
</script>

<style scoped>
</style>
