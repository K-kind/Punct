<template>
  <div>
    <MonthlyTasks />
  </div>
</template>

<script>
import MonthlyTasks from '@/components/tasks/MonthlyTasks.vue'

export default {
  name: 'MonthlyColumn',
  components: {
    MonthlyTasks
  },
}
</script>
