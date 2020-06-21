<template>
  <div>
    <MonthlyTasks @change-month="changeMonth"  :weekStartDate="weekStartDate" :isArchive="true" />
  </div>
</template>

<script>
import MonthlyTasks from '@/components/tasks/MonthlyTasks.vue'
import { SET_NEW_TASK_ID } from '@/store/mutation-types'

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
  mounted() {
    this.$store.dispatch('monthly/' + SET_NEW_TASK_ID)
  }
}
</script>
