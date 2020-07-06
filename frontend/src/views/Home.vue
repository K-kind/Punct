<template>
  <div class="home">
    <div class="working">
      <WorkingTask />
    </div>
    <div class="columns">
      <CompletedColumn />
      <TodayColumn />
      <DailyColumn />
      <WeeklyColumn />
      <MonthlyColumn />
    </div>
  </div>
</template>

<script>
import WorkingTask from '@/components/tasks/WorkingTask.vue'
import CompletedColumn from '@/components/homeColumns/CompletedColumn.vue'
import TodayColumn from '@/components/homeColumns/TodayColumn.vue'
import DailyColumn from '@/components/homeColumns/DailyColumn.vue'
import WeeklyColumn from '@/components/homeColumns/WeeklyColumn.vue'
import MonthlyColumn from '@/components/homeColumns/MonthlyColumn.vue'
import { SET_TASKS, SET_START_DATE, DESTROY } from '@/store/mutation-types'

export default {
  name: 'Home',
  components: {
    WorkingTask,
    CompletedColumn,
    TodayColumn,
    DailyColumn,
    WeeklyColumn,
    MonthlyColumn,
  },
  created() {
    this.$store.dispatch(SET_TASKS)
    this.$store.dispatch(`weekly/${SET_START_DATE}`,{
      fromToday: 0, startDate: null
    })
    let flash = this.$store.state.message.flash
    if (flash) {
      this.$notify({ message: flash, duration: 2500 })
      this.$store.dispatch(`message/${DESTROY}`)
    }
  },
}
</script>

<style scoped>
.working {
  display: flex;
  justify-content: center;
}
.columns {
  display: flex;
}
</style>
