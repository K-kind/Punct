<template>
  <div>
    <WeeklyTasks :isArchive="true" />
  </div>
</template>

<script>
import WeeklyTasks from '@/components/tasks/WeeklyTasks.vue'

export default {
  name: 'WeeklyColumn',
  components: {
    WeeklyTasks
  },
}
</script>
