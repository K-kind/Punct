<template>
  <div class="archives">
    <ThisWeekColumn :startDate="weekStartDate" />
    <WeeklyColumn @change-week="changeWeek" />
    <MonthlyColumn />
  </div>
</template>

<script>
import ThisWeekColumn from '@/components/archives/ThisWeekColumn.vue'
import WeeklyColumn from '@/components/archives/WeeklyColumn.vue'
import MonthlyColumn from '@/components/archives/MonthlyColumn.vue'
import { SET_TASKS } from '@/store/mutation-types'

export default {
  name: 'Archives',
  components: {
    ThisWeekColumn,
    WeeklyColumn,
    MonthlyColumn,
  },
  data() {
    return {
      weekStartDate: null,
    }
  },
  methods: {
    changeWeek(startDate) {
      this.weekStartDate = startDate
    },
  },
  created() {
    this.$store.dispatch(SET_TASKS)
  },
}
</script>

<style scoped>
.archives {
  display: flex;
}
</style>
