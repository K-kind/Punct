<template>
  <div class="today-column">
    <DailyTasks :date="today" :forToday="true">
      <template v-slot:taskDate1>本日 </template>
    </DailyTasks>
    <RemainingTasks v-if="remainings.length" :remainingTasks="remainings"/>
  </div>
</template>

<script>
import DailyTasks from '@/components/tasks/DailyTasks.vue'
import RemainingTasks from '@/components/tasks/RemainingTasks.vue'

export default {
  name: 'TodayColumn',
  components: {
    DailyTasks,
    RemainingTasks
  },
  computed: {
    today() { return new Date },
    remainings() {
      return this.$store.getters['daily/remainingTasks']
    }
  }
}
</script>
