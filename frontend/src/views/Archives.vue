<template>
  <div class="archives">
    <ReloadNotify />
    <div class="chart">
      <TasksChart />
    </div>
    <div class="columns">
      <Column>
        <template v-slot:head>{{ weekString }}</template>
        <template v-slot:body><ThisWeekColumn /></template>
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
import ReloadNotify from '@/components/ReloadNotify.vue'
import TasksChart from '@/components/archives/TasksChart.vue'
import ThisWeekColumn from '@/components/archives/ThisWeekColumn.vue'
import WeeklyColumn from '@/components/archives/WeeklyColumn.vue'
import MonthlyColumn from '@/components/archives/MonthlyColumn.vue'
import Column from '@/components/Column.vue'
import { SET_TASKS, SET_START_DATE } from '@/store/mutation-types'

export default {
  name: 'Archives',
  components: {
    ReloadNotify,
    TasksChart,
    ThisWeekColumn,
    WeeklyColumn,
    MonthlyColumn,
    Column
  },
  computed: {
    weekString() {
      let range = this.$store.state.weekly.weekString || '今週'
      return `${range}の完了タスク`
    }
  },
  created() {
    this.$store.dispatch(SET_TASKS)
    this.$store.dispatch(`weekly/${SET_START_DATE}`,{
      fromToday: 0, startDate: null, weekString: null
    })
  },
}
</script>

<style scoped>
.columns {
  display: flex;
  justify-content: center;
}
</style>
