<template>
  <div class="task-board">
    <div class="task-board__header">
      <h2 class="task-board__heading"><slot name="taskDate1">{{ dateString }}</slot></h2>
      <span v-if="totalTime">{{ totalTime }}</span>
    </div>
    <draggable tag="ul" group="TASKS" @end="onDragEnd" :data-completed="true" :data-date="separatedDate" draggable=".draggable">
      <li v-for="task of completedTasks(date)" :key="task.id" class="task-board__li" :class="{ draggable: !onUpdatedTaskId }" :data-task_id="task.id">
        <div v-if="onUpdatedTaskId !== task.id" @click="openUpdateForm(task.id)" class="task-board__task">
          <p class="task-board__p">
            {{ task.order }}: ID.{{ task.id }}: {{ task.content }} ({{ task.date }}日)
            <span class="task-board__time">{{ taskTimes(task) }}分</span>
          </p>
        </div>
        <TaskForm
          v-else
          :formIsOpen="true"
          :taskId="task.id"
          :taskContent="task.content"
          :taskExpectedTime="toMinutes(task.expected_time)"
          :taskElapsedTime="toMinutes(task.elapsed_time)"
          :isNewTask="false"
          :isCompletedTask="true"
          ref="updateForm"
          @close-form="closeForm"
          @update-task="updateTask($event, task.id)"
        ></TaskForm>
      </li>
    </draggable>
    <a @click="openForm" v-show="!newFormIsOpen" href="Javascript:void(0)" class="task-board__add">+完了済みを追加</a>
    <TaskForm
      :formIsOpen="newFormIsOpen"
      taskContent=""
      :taskExpectedTime="0"
      :taskElapsedTime="0"
      :isNewTask="true"
      :isCompletedTask="true"
      ref="newForm"
      @close-form="closeForm"
      @add-task="addTask"
    ></TaskForm>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { mapGetters, mapActions } from 'vuex'
import TaskForm from '@/components/TaskForm.vue'
import {
  ADD_NEW_TASK,
  UPDATE_TASK_CONTENT,
  UPDATE_TASK_ORDER,
  SET_CURRENT_TASK
} from '@/store/mutation-types'

export default {
  name: 'CompletedTasks',
  data() {
    return {
      newFormIsOpen: false,
      onUpdatedTaskId: '',
    }
  },
  props: {
    date: Date
  },
  components: {
    draggable,
    TaskForm
  },
  computed: {
    ...mapGetters('daily', ['completedTasks']),
    dateString() {
      let weekDay = ['日', '月', '火', '水', '木', '金', '土']
      let month =  this.date.getMonth() + 1
      let date =  this.date.getDate()
      let day = weekDay[this.date.getDay()]
      return `${month}/${date}(${day})`
    },
    separatedDate() {
      return this.date.toLocaleDateString()
    },
    totalTime() {
      let times = this.completedTasks(this.date).map(task => task.elapsed_time)
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
    ...mapActions('daily', [ADD_NEW_TASK, UPDATE_TASK_CONTENT, UPDATE_TASK_ORDER, SET_CURRENT_TASK]),
    toMinutes(time) {
      return Math.ceil(time / (1000 * 60))
    },
    taskTimes(task) {
      let elapsed = task.elapsed_time
      let elapsedString = (elapsed ? `${this.toMinutes(elapsed)}/` : '')
      return `${elapsedString}${this.toMinutes(task.expected_time)}`
    },
    closeForm() {
      this.newFormIsOpen = false
      let self = this
      setTimeout(() => self.onUpdatedTaskId = '')
    },
    openForm() {
      this.newFormIsOpen = true
      let self = this
      setTimeout(() => self.$refs.newForm.focusForm())
    },
    openUpdateForm(taskId) {
      this.onUpdatedTaskId = taskId
      let self = this
      setTimeout(() => self.$refs.updateForm[0].focusForm())
    },
    addTask(e) {
      let tasks = this.completedTasks(this.date)
      let newOrder = tasks.length
      let newTask = {
        content: e.content,
        expected_time: e.expected_time,
        elapsed_time: e.elapsed_time,
        is_completed: true,
        year: this.date.getFullYear(),
        month: this.date.getMonth(),
        date: this.date.getDate(),
        order: newOrder
      }
      this[ADD_NEW_TASK](newTask)
      this.$refs.newForm.focusForm()
    },
    updateTask(e, task_id) {
      let payload = { id: task_id, task: e }
      this[UPDATE_TASK_CONTENT](payload)
      this.closeForm()
    },
    onDragEnd(e) {
      let fromDate = e.from.dataset.date
      let toDate = e.to.dataset.date
      let toCompleted = (e.to.dataset.completed ? true : false)
      let taskId = Number.parseInt(e.clone.dataset.task_id)
      let payload = {
        fromDate,
        toDate,
        oldIndex: e.oldIndex,
        newIndex: e.newIndex,
        fromCompleted: true,
        toCompleted,
        taskId
      }
      if (e.to.dataset.working) {
        this[SET_CURRENT_TASK](payload)
      } else {
        this[UPDATE_TASK_ORDER](payload)
      }
    },
  },
}
</script>

<style scoped>
.task-board {
  background-color: rgb(253, 242, 219);
}
</style>
