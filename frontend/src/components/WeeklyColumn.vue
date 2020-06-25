<template>
  <div>
    <WeeklyTasks @change-week="changeWeek" :monthStartDate="monthStartDate" />
  </div>
</template>

<script>
import WeeklyTasks from '@/components/tasks/WeeklyTasks.vue'

export default {
  name: 'WeeklyColumn',
  components: {
    WeeklyTasks
  },
  props: {
    monthStartDate: Date
  },
  methods: {
    changeWeek(startDate) {
      this.$emit('change-week', startDate)
    }
  },
}
</script>
