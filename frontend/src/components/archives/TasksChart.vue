<template>
  <div>
    <div class="chart">
      <h2>毎日のタスク時間</h2>
      <Chart :chartData="chartData" :options="options" @set-canvas="setCanvas" />
      <div class="chart__links">
        <a @click="fromBase -= 1" href="javascript:">
          <i class="el-icon-caret-left"></i>
          前の3週間
        </a>
        <a @click="fromBase += 1" href="javascript:">
          次の3週間
          <i class="el-icon-caret-right"></i>
        </a>
      </div>
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
      fromBase: 0,
      canvas: null
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
    gradient1() {
      if (!this.canvas) return 'silver';

      const gradient = this.canvas.getContext('2d').createLinearGradient(0, 0, 0, 450)
      gradient.addColorStop(0, 'rgba(255, 0,0, 0.5)')
      gradient.addColorStop(0.5, 'rgba(255, 0, 0, 0.25)')
      gradient.addColorStop(1, 'rgba(255, 0, 0, 0)')
      return gradient
    },
    gradient2() {
      if (!this.canvas) return 'silver';

      const gradient = this.canvas.getContext('2d').createLinearGradient(0, 0, 0, 450)
      gradient.addColorStop(0, 'rgb(66, 185, 131, 0.9)')
      gradient.addColorStop(0.5, 'rgb(66, 185, 131, 0.25)')
      gradient.addColorStop(1, 'rgb(66, 185, 131, 0)')
      // gradient.addColorStop(0, 'rgba(0, 231, 255, 0.9)')
      // gradient.addColorStop(0.5, 'rgba(0, 231, 255, 0.25)')
      // gradient.addColorStop(1, 'rgba(0, 231, 255, 0)')
      return gradient
    },
    chartData() {
      return {
        labels: this.labelDates,
        datasets: [
          {
            label: '実測時間 (h)',
            data: this.elapsedSums,
            backgroundColor: this.gradient1,
            borderColor: '#ea4335',
            pointBackgroundColor: '#ea4335',
            // borderColor: '#FC2525',
            // pointBackgroundColor: '#FC2525',
            // pointBackgroundColor: '#2c3e50',
            borderWidth: 1,
            // pointBorderColor: 'white',
          },
          {
            label: '予定時間 (h)',
            data: this.expectedSums,
            backgroundColor: this.gradient2,
            borderColor: '#42b983',
            pointBackgroundColor: '#42b983',
            // borderColor: '#00e7ffe6',
            // pointBackgroundColor: '#00e7ffe6',
            borderWidth: 1,
            // pointBorderColor: 'white',
            // type: 'line',
            // lineTension: 0.3,
          }
        ]
      }
    },
    options() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: '時間'
            },
            ticks: {
              beginAtZero: true,
            }
          }]
        }
      }
    }
  },
  methods: {
    toHours(sum) {
      if (!sum) return 0;

      return Math.round(sum / (1000 * 60 * 60) * 10) / 10
    },
    fetchCalendar() {
      this.$store.dispatch(
        `http/${GET}`,
        { url: 'tasks/chart', params: { fromBase: this.fromBase } }
      ).then(res => {
        this.calendars = res.data.calendars
      })
    },
    setCanvas(e) {
      this.canvas = e
    }
  },
  watch: {
    fromBase: {
      immediate: true,
      handler() {
        this.fetchCalendar()
      }
    }
  }
}
</script>

<style scoped lang="scss">
.chart {
  width: 90%;
  margin: 0 auto;
  padding-top: 24px;
  padding-bottom: 16px;
  &__links {
    display: flex;
    justify-content: space-between;
    padding: 8px 0 16px;
    a {
      font-weight: bold;
      @include gray-link;
    }
  }
}
</style>
