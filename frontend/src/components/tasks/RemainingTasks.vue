<template>
  <div class="task-board">
    <div class="task-board__header">
      <h2 class="task-board__heading">前日の未消化タスク</h2>
      <span v-if="totalTime">{{ totalTime }}</span>
    </div>
    <draggable tag="ul" :group="dragGroup" @end="onDragEnd" @clone="onClone" draggable=".draggable" data-remaining="true">
      <li v-for="task of remainingTasks" :key="task.id" class="task-board__li" :class="{ draggable: !onUpdatedTaskId }" :data-task_id="task.id">
        <div v-if="onUpdatedTaskId !== task.id" @click="openUpdateForm(task.id)" class="task-board__task">
          <p class="task-board__p">
            <!-- {{ task.content }} -->
            {{ task.order }}: ID.{{ task.id }}: {{ task.content }} ({{ task.date }}日)
            <span class="task-board__time">{{ toMinutes(task.expected_time) }}分</span>
          </p>
        </div>
        <TaskForm
          v-else
          :formIsOpen="true"
          :taskId="task.id"
          :taskContent="task.content"
          :taskExpectedTime="toMinutes(task.expected_time)"
          :taskElapsedTime="0"
          :isNewTask="false"
          ref="updateForm"
          @close-form="closeForm"
          @update-task="updateTask($event, task.id)"
        ></TaskForm>
      </li>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { mapActions } from 'vuex'
import TaskForm from '@/components/TaskForm.vue'
import {
  UPDATE_TASK_CONTENT,
  UPDATE_TASK_ORDER,
  SET_CURRENT_TASK,
} from '@/store/mutation-types'

export default {
  name: 'DailyTasks',
  props: {
    remainingTasks: Array
  },
  data() {
    return {
      onUpdatedTaskId: '',
      dragGroup: 'REMAINING'
    }
  },
  components: {
    draggable,
    TaskForm
  },
  computed: {
    totalTime() {
      let times = this.remainingTasks.map(task => task.expected_time)
      if (!times.length) return null;
      let total = times.reduce((prev, current) => prev + current)
      let m = this.toMinutes(total)
      let h = Math.floor(m / 60)
      m -= h * 60
      let hString = h ? `${h}時間` : ''
      return `${hString}${m}分`
    }
  },
  methods: {
    ...mapActions('daily', [UPDATE_TASK_CONTENT, UPDATE_TASK_ORDER, SET_CURRENT_TASK]),
    toMinutes(time) {
      return Math.ceil(time / (1000 * 60))
    },
    closeForm() {
      let self = this
      setTimeout(() => self.onUpdatedTaskId = '')
    },
    openUpdateForm(taskId) {
      this.onUpdatedTaskId = taskId
      let self = this
      setTimeout(() => self.$refs.updateForm[0].focusForm())
    },
    updateTask(e, task_id) {
      let payload = { id: task_id, task: e }
      this[UPDATE_TASK_CONTENT](payload)
      this.closeForm()
    },
    onDragEnd(e) {
      this.disableDrag(true)
      if (e.to.dataset.remaining) { return false }

      let toDate = e.to.dataset.date
      let toCompleted = (e.to.dataset.completed ? true : false)
      let taskId = Number.parseInt(e.clone.dataset.task_id)
      let payload = {
        toDate,
        newIndex: e.newIndex,
        fromCompleted: false,
        toCompleted,
        taskId
      }

      if (e.to.dataset.working) {
        this[SET_CURRENT_TASK](payload)
      } else {
        this[UPDATE_TASK_ORDER](payload)
      }
    },
    onClone() {
      this.disableDrag(false)
    },
    disableDrag(boolean) {
      this.dragGroup = (boolean ? 'REMAINING' : 'TASKS')
    }
  }
}
</script>

<style scoped>

</style>
