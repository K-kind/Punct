<template>
  <div class="today-column">
    <WorkingTask />
    <CompletedTasks :date="today">
      <template v-slot:taskDate1>本日の完了タスク</template>
    </CompletedTasks>
  </div>
</template>

<script>
import WorkingTask from '@/components/tasks/WorkingTask.vue'
import CompletedTasks from '@/components/tasks/CompletedTasks.vue'

export default {
  name: 'WorkingColumn',
  components: {
    WorkingTask,
    CompletedTasks
  },
  computed: {
    today() { return new Date },
  }
}
</script>
