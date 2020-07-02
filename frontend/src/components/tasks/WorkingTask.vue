<template>
  <div class="task-board">
    <div class="task-board__header">
      <h2 class="task-board__heading">現在のタスク</h2>
    </div>
    <div v-if="currentTask">
      <a href="Javascript:void(0)" @click="start" v-if="!timerId"><i class="el-icon-video-play"></i></a>
      <a href="Javascript:void(0)" @click="stop" v-else><i class="el-icon-video-pause"></i></a>
      <span>経過時間: {{ elapsedTime }}</span>
      <button @click.prevent="complete(null)">完了</button>
    </div>
    <draggable tag="ul" :group="dragGroup" @end="onDragEnd" :data-working="true" @add="onAdd" @clone="onClone" draggable=".draggable">
      <li v-if="currentTask" class="task-board__li" :class="{ draggable: !formIsOpen }">
        <div v-if="!formIsOpen" @click="openForm()" class="task-board__task">
          <p class="task-board__p">
            {{ currentTask.order }}: ID.{{ currentTask.id }}: {{ currentTask.content }} ({{ currentTask.date }}日)
            <span class="task-board__time">{{ toMinutes(currentTask.expected_time) }}分</span>
          </p>
        </div>
        <TaskForm
          v-else
          :formIsOpen="true"
          :taskId="currentTask.id"
          :taskContent="currentTask.content"
          :taskExpectedTime="toMinutes(currentTask.expected_time)"
          :taskElapsedTime="0"
          :isNewTask="false"
          ref="updateForm"
          @close-form="closeForm"
          @update-task="updateTask($event, currentTask.id)"
          @delete-current-task="deleteCurrentTask"
        ></TaskForm>
      </li>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { mapGetters, mapActions } from 'vuex'
import TaskForm from '@/components/TaskForm.vue'
import {
  UPDATE_TASK_CONTENT,
  UPDATE_TASK_ORDER,
  START_TASK,
  STOP_TASK,
} from '@/store/mutation-types'

export default {
  name: 'WorkingTask',
  data() {
    return {
      formIsOpen: false,
      timerId: null,
      elapsedTime: null,
      dragGroup: 'TASKS'
    }
  },
  components: {
    draggable,
    TaskForm
  },
  computed: {
    ...mapGetters('daily', ['currentTask', 'completedTasks']),
  },
  methods: {
    ...mapActions('daily', [UPDATE_TASK_CONTENT, UPDATE_TASK_ORDER, START_TASK, STOP_TASK]),
    toMinutes(time) {
      return Math.ceil(time / (1000 * 60))
    },
    closeForm() {
      this.formIsOpen = false
    },
    openForm() {
      let self = this
      this.formIsOpen = true
      setTimeout(() => self.$refs.updateForm.focusForm())
    },
    updateTask(e, task_id) {
      let payload = { id: task_id, task: e }
      this[UPDATE_TASK_CONTENT](payload)
      this.closeForm()
    },
    deleteCurrentTask() {
      this.disableDrag(false)
      clearInterval(this.timerId)
      this.timerId = null
    },
    computeElapsedTime() {
      let elapsed = this.currentTask.elapsed_time
      if (this.currentTask.on_progress) {
        let started = this.currentTask.stopped_time || this.currentTask.started_time
        elapsed += (Date.now() - started)
      }
      let h = Math.floor(elapsed / (1000 * 60 * 60))
      h = (h > 0) ? `${h}:` : ''
      let m = Math.floor(elapsed / (1000 * 60)) % 60
      m = (m < 10) ? `0${m}` : m
      let s = Math.floor(elapsed / 1000) % 60
      s = (s < 10) ? `0${s}` : s
      this.elapsedTime = `${h}${m}:${s}`
    },
    setTimer() {
      if (!this.currentTask.on_progress) return false;

      let self = this
      this.timerId = setInterval(() => {
        self.computeElapsedTime()
      }, 1000)
    },
    start() {
      this[START_TASK]({ taskId: this.currentTask.id })
        .then(() => {
          this.setTimer()
        })
    },
    stop() {
      this[STOP_TASK]({ taskId: this.currentTask.id })
        .then(() => {
          clearInterval(this.timerId)
          this.timerId = null
        })
    },
    complete(payload) {
      if (this.currentTask.on_progress) {
        this.stop()
      }

      if (!payload) {
        let toDate = (new Date).toLocaleDateString()
        let newIndex = this.completedTasks(new Date).length
        payload = {
          toDate,
          newIndex,
          fromCompleted: false,
          toCompleted: true,
          taskId: this.currentTask.id
        }
      }

      this[UPDATE_TASK_ORDER](payload)
        .then(() => {
          this.disableDrag(false)
        })
    },
    onDragEnd(e) {
      if (e.to.dataset.working) {
        this.disableDrag(true)
        return false
      }

      let toCompleted = (e.to.dataset.completed ? true : false)
      let payload = {
        toDate: e.to.dataset.date,
        newIndex: e.newIndex,
        fromCompleted: false,
        toCompleted,
        taskId: this.currentTask.id
      }
      this.complete(payload)
    },
    onAdd(e) {
      this.disableDrag(true)

      let fromCompleted = (e.from.dataset.completed ? true : false)
      let taskId = Number.parseInt(e.clone.dataset.task_id)
      let payload = {
        fromDate: e.from.dataset.date,
        oldIndex: e.oldIndex,
        fromCompleted,
        toCompleted: false,
        taskId,
        isCurrent: true
      }
      this[UPDATE_TASK_ORDER](payload)
        .then(() => {
          this.computeElapsedTime()
          this.start()
        })
    },
    onClone() {
      this.disableDrag(false)
    },
    disableDrag(boolean) {
      this.dragGroup = (boolean ? '' : 'TASKS')
    }
  },
  mounted() {
    let self = this
    setTimeout(() => {
      if (!self.currentTask) return false;

      self.disableDrag(true)
      self.computeElapsedTime()
      if (self.currentTask.started_time) {
        self.setTimer()
      }
    }, 500)
  }
}
</script>

<style scoped>
.task-board {
  min-height: 140px;
  background-color: bisque;
}
/* .task-board__header {
  display: block;
  text-align: center;
} */
</style>
