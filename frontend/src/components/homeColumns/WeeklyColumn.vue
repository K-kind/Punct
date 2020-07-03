<template>
  <div>
    <WeeklyTasks @change-week="changeWeek" />
  </div>
</template>

<script>
import WeeklyTasks from '@/components/tasks/WeeklyTasks.vue'

export default {
  name: 'WeeklyColumn',
  components: {
    WeeklyTasks
  },
  methods: {
    changeWeek(startDate) {
      this.$emit('change-week', startDate)
    }
  },
}
</script>
