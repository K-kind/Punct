<template>
  <div class="home">
    <div class="working">
      <WorkingTask />
    </div>
    <div class="columns">
      <Column>
        <template v-slot:head>本日の完了タスク</template>
        <template v-slot:body><CompletedColumn /></template>
      </Column>
      <Column>
        <template v-slot:head>本日のタスク</template>
        <template v-slot:body><TodayColumn /></template>
      </Column>
      <Column>
        <template v-slot:head>{{ weekString }}</template>
        <template v-slot:body><DailyColumn /></template>
      </Column>
      <Column>
        <template v-slot:head>週間タスク</template>
        <template v-slot:body><WeeklyColumn /></template>
      </Column>
      <Column>
        <template v-slot:head>月間タスク</template>
        <template v-slot:body><MonthlyColumn /></template>
      </Column>
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
import Column from '@/components/Column.vue'
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
    Column
  },
  computed: {
    weekString() {
      let range = this.$store.state.weekly.weekString || '6日間'
      return `${range}のタスク`
    }
  },
  created() {
    this.$store.dispatch(SET_TASKS)
    this.$store.dispatch(`weekly/${SET_START_DATE}`,{
      fromToday: 0, startDate: null, weekString: null
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
  margin-top: 16px;
}
</style>
