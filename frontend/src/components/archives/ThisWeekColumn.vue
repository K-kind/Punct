<template>
  <div class="this-week-column">
    <CompletedTasks v-for="(date, index) in dates" :date="date" :key="`completed_${index}`"></CompletedTasks>
  </div>
</template>

<script>
import CompletedTasks from '@/components/tasks/CompletedTasks.vue'

export default {
  name: 'ThisWeekColumn',
  components: {
    CompletedTasks
  },
  computed: {
    startDate() {
      return this.$store.state.weekly.startDate
    },
    dates() {
      const dates = []
      if (this.startDate) {
        for (let i = 0; i < 7; i++) {
          const date = this.$dayjs(this.startDate).add(i, 'day')
          dates.push(date)
        }
      } else {
        const weekday = this.$dayjs().weekday() // 月(0)〜日(6)
        for (let i = weekday; i >= 0; i--) {
          const date = this.$dayjs().subtract(i, 'day')
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
