<template>
  <div class="task-board">
    <div class="task-board__header">
      <h2 class="task-board__heading">前日の未消化タスク</h2>
      <span v-if="totalTime">{{ totalTime }}</span>
    </div>
    <div class="task-board__body">
      <draggable
        tag="ul"
        :group="dragGroup"
        :list="taskList"
        :animation="200"
        @end="onDragEnd"
        @clone="onClone"
        data-remaining="true"
        handle=".handle"
      >
        <li
          v-for="task of taskList"
          :key="task.id"
          :data-task_id="task.id"
          class="task-board__li"
        >
          <div v-if="onUpdatedTaskId !== task.id" class="task-board__with-icon">
            <div @click="openUpdateForm(task.id)" class="task-board__task handle">
              <p class="task-board__p">
                {{ task.content }}
                <span class="task-board__time">{{ taskTimes(task) }}分</span>
              </p>
            </div>
            <div v-show="draggingId !== task.id" class="task-board__with-icon--left">
              <a :class="{ disabled: !!currentTask }" href="Javascript:void(0)" @click="upload(task)">
                <i class="el-icon-upload2"></i>
              </a>
            </div>
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
      <a @click="clearTasks" href="javascript:" class="task-board__add">
        <i class="el-icon-delete"></i>
        全タスクを削除
      </a>
    </div>
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
  CLEAR
} from '@/store/mutation-types'

export default {
  name: 'RemainingTasks',
  props: {
    remainingTasks: Array
  },
  data() {
    return {
      onUpdatedTaskId: null,
      dragGroup: 'REMAINING',
      draggingId: null,
      taskList: []
    }
  },
  components: {
    draggable,
    TaskForm
  },
  computed: {
    ...mapGetters('daily', ['currentTask']),
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
    ...mapActions('daily', [UPDATE_TASK_CONTENT, UPDATE_TASK_ORDER, START_TASK, CLEAR]),
    toMinutes(time) {
      return Math.ceil(time / (1000 * 60))
    },
    taskTimes(task) {
      let elapsed = task.elapsed_time
      let elapsedString = (elapsed ? `${this.toMinutes(elapsed)}/` : '')
      return `${elapsedString}${this.toMinutes(task.expected_time)}`
    },
    closeForm() {
      this.onUpdatedTaskId = null
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
    clearTasks() {
      const taskIds = this.remainingTasks.map(task => task.id)
      this[CLEAR]({ taskIds })
    },
    onDragEnd(e) {
      this.disableDrag(true)
      if (e.to.dataset.remaining) { return false }

      let taskId = Number.parseInt(e.clone.dataset.task_id)
      this.draggingId = taskId // ドラッグ後に一瞬現れるアイコン対策

      let toCompleted = (e.to.dataset.completed ? true : false)
      let payload = {
        toDate: e.to.dataset.date,
        newIndex: e.newIndex,
        fromCompleted: false,
        toCompleted,
        taskId
      }

      if (e.to.dataset.working) {
        let self = this
        setTimeout(() => {
          self.draggingId = null
        }, 1000)
      } else {
        this[UPDATE_TASK_ORDER](payload).then(() => {
          this.draggingId = null
        })
      }
    },
    async upload(task) {
      if (this.currentTask) return false;

      let taskId = task.id
      let payload = {
        newIndex: 0,
        fromCompleted: false,
        toCompleted: false,
        taskId,
        isCurrent: true
      }
      await this[START_TASK]({ taskId })
      this[UPDATE_TASK_ORDER](payload)
    },
    onClone() {
      this.disableDrag(false)
    },
    disableDrag(boolean) {
      this.dragGroup = (boolean ? 'REMAINING' : 'TASKS')
    }
  },
  watch: {
    remainingTasks: {
      immediate: true,
      handler(tasks) {
        this.taskList = tasks
      }
    }
  }
}
</script>

<style scoped lang="scss">
.task-board__add {
  &:hover {
    color: #fff;
    font-weight: bold;
    background-color: $danger;
  }
}
</style>
