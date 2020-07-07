<template>
  <CompletedTasks :date="today" />
</template>

<script>
import CompletedTasks from '@/components/tasks/CompletedTasks.vue'

export default {
  name: 'CompletedColumn',
  components: {
    CompletedTasks
  },
  computed: {
    today() { return new Date },
  }
}
</script>
