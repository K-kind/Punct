<template>
  <div class="daily-column">
    <DailyTasks v-for="(date, index) in dates" :date="date" :key="`daily_${index}`"></DailyTasks>
  </div>
</template>

<script>
import DailyTasks from '@/components/tasks/DailyTasks.vue'

export default {
  name: 'DailyColumn',
  components: {
    DailyTasks
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
        for (let i = 1; i < 7; i++) {
          const date = this.$dayjs().add(i, 'day')
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
