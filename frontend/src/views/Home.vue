<template>
  <div class="home">
    <WorkingColumn />
    <TodayColumn />
    <DailyColumn :startDate="weekStartDate" />
    <WeeklyColumn @change-week="changeWeek" :monthStartDate="monthStartDate" />
    <MonthlyColumn @change-month="changeMonth" :weekStartDate="weekStartDate" />
  </div>
</template>

<script>
import WorkingColumn from '@/components/homeColumns/WorkingColumn.vue'
import TodayColumn from '@/components/homeColumns/TodayColumn.vue'
import DailyColumn from '@/components/homeColumns/DailyColumn.vue'
import WeeklyColumn from '@/components/homeColumns/WeeklyColumn.vue'
import MonthlyColumn from '@/components/homeColumns/MonthlyColumn.vue'
import { SET_TASKS, DESTROY } from '@/store/mutation-types'

export default {
  name: 'Home',
  components: {
    WorkingColumn,
    TodayColumn,
    DailyColumn,
    WeeklyColumn,
    MonthlyColumn,
  },
  data() {
    return {
      weekStartDate: null,
      monthStartDate: null
    }
  },
  methods: {
    changeWeek(startDate) {
      this.weekStartDate = startDate
    },
    changeMonth(startDate) {
      this.monthStartDate = startDate
    }
  },
  created() {
    this.$store.dispatch('daily/' + SET_TASKS)
    let flash = this.$store.state.message.flash
    if (flash) {
      this.$notify({ message: flash, duration: 2500 })
      this.$store.dispatch(`message/${DESTROY}`)
    }
  },
}
</script>

<style scoped>
.home {
  display: flex;
}
</style>
