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
      tasks: [],
      chartData: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
          {
            label: 'Bar Dataset',
            data: [10, 20, 30, 40, 50, 30],
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
            label: 'Line Dataset',
            data: [10, 50, 20, 30, 30, 40],
            borderColor: '#CFD8DC',
            fill: false,
            type: 'line',
            lineTension: 0.3,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
        // scales: {
        //   xAxes: [{
        //     scaleLabel: {
        //       display: true,
        //       labelString: 'Month'
        //     }
        //   }],
        //   yAxes: [{
        //     ticks: {
        //       beginAtZero: true,
        //       stepSize: 10,
        //     }
        //   }]
        // }
      }
    }
  },
  created () {
    this.$store.dispatch(
      `http/${GET}`,
      { url: 'tasks/chart', params: { fromBase: this.fromBase } }
    ).then(res => {
      this.tasks = res.data.tasks
    })
  }
}
</script>

<style scoped>
</style>
