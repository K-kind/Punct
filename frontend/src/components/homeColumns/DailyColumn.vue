<template>
  <div class="daily-column">
    <DailyTasks v-for="date in dates" :date="date" :key="date.toString()"></DailyTasks>
  </div>
</template>

<script>
import DailyTasks from '@/components/tasks/DailyTasks.vue'

export default {
  name: 'DailyColumn',
  components: {
    DailyTasks
  },
  props: {
    startDate: Date
  },
  computed: {
    dates() {
      let dates = []
      if (this.startDate) {
        for (let i = 0; i < 7; i++) {
          let date = new Date(this.startDate.getTime())
          date.setDate(date.getDate() + i)
          dates.push(date)
        }
      } else {
        for (let i = 1; i < 7; i++) {
          let date = new Date
          date.setDate(date.getDate() + i)
          dates.push(date)
        }
      }
      return dates
    }
  },
}
</script>

<style scoped>
/* .daily-column {
  vertical-align: top;
} */
</style>
