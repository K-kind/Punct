<template>
  <div>
    <MonthlyTasks @change-month="changeMonth"  :weekStartDate="weekStartDate"/>
  </div>
</template>

<script>
import MonthlyTasks from '@/components/tasks/MonthlyTasks.vue'

export default {
  name: 'MonthlyColumn',
  components: {
    MonthlyTasks
  },
  props: {
    weekStartDate: Date
  },
  methods: {
    changeMonth(startDate) {
      this.$emit('change-month', startDate)
    }
  },
}
</script>
