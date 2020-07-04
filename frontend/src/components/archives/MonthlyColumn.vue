<template>
  <div>
    <MonthlyTasks :isArchive="true" />
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
