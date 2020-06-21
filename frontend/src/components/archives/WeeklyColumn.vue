<template>
  <div>
    <WeeklyTasks @change-week="changeWeek" :monthStartDate="monthStartDate" :isArchive="true" />
  </div>
</template>

<script>
import WeeklyTasks from '@/components/tasks/WeeklyTasks.vue'
import { SET_NEW_TASK_ID } from '@/store/mutation-types'

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
  mounted() {
    this.$store.dispatch('weekly/' + SET_NEW_TASK_ID)
  }
}
</script>
