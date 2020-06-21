<template>
  <div class="this-week-column">
    <CompletedTasks v-for="date in dates" :date="date" :key="date.toString()"></CompletedTasks>
  </div>
</template>

<script>
import CompletedTasks from '@/components/tasks/CompletedTasks.vue'

export default {
  name: 'ThisWeekColumn',
  components: {
    CompletedTasks
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
        let today = new Date
        let day = today.getDay()
        day = day || 7 // 月(1)〜日(7)
        for (let i = day - 1; i >= 0; i--) {
          let date = new Date
          date.setDate(date.getDate() - i)
          dates.push(date)
        }
      }
      return dates
    }
  },
}
</script>

<style scoped>

</style>
