<template>
  <div class="today-column">
    <CompletedTasks :date="today">
      <template v-slot:taskDate1>本日の完了タスク</template>
    </CompletedTasks>
  </div>
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
