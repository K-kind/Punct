<template>
  <div class="task-board">
    <div class="task-board__header--top">
      <div class="task-board__header-left">
        <h2 class="task-board__heading">{{ headerText }}</h2>
        <div v-if="currentTask">
          <span>
            経過
            <span class="elapsed-time">{{ elapsedTime }}</span>
          </span>
        </div>
      </div>
      <div v-if="currentTask" class="task-board__header-right">
        <a href="Javascript:void(0)" @click="start" v-if="!timerId">
          <i class="el-icon-video-play"></i>
        </a>
        <a href="Javascript:void(0)" @click="stop" v-else>
          <i class="el-icon-video-pause"></i>
        </a>
      </div>
    </div>
    <div class="current-task">
      <draggable
        tag="ul"
        class="task-board__ul"
        :group="dragGroup"
        :list="taskList"
        :data-working="true"
        :animation="200"
        @add="onAdd"
        @clone="onClone"
        @end="onDragEnd"
        draggable=".draggable"
      >
        <li v-show="!currentTask" class="drop-guide">
          ここにドロップまたは
          <i class="el-icon-upload2"></i>
        </li>
        <li
          v-for="task of taskList"
          class="task-board__li"
          :class="{ draggable: !formIsOpen }"
          :key="task.id"
        >
          <div v-if="!formIsOpen" @click="openForm()" class="task-board__task">
            <p class="task-board__p">
              {{ task.content }}
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
            @delete-current-task="deleteCurrentTask"
          ></TaskForm>
        </li>
      </draggable>
      <div class="current-task__right">
        <el-button
        v-show="currentTask"
        @click.prevent="complete(null)"
        size="mini"
      >完了</el-button>
      </div>
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
  STOP_TASK,
} from '@/store/mutation-types'

export default {
  name: 'WorkingTask',
  data() {
    return {
      formIsOpen: false,
      timerId: null,
      elapsedTime: null,
      dragGroup: 'TASKS',
      taskList: []
    }
  },
  components: {
    draggable,
    TaskForm
  },
  computed: {
    ...mapGetters('daily', ['currentTask', 'completedTasks']),
    headerText() {
      let text = '進行中のタスク'
      let task = this.currentTask
      if (task && task.on_progress) {
        text = '進行中'
      } else if (task) {
        text = '停止中'
      }
      return text
    }
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
      this.formIsOpen = true
      let self = this
      setTimeout(() => self.$refs.updateForm[0].focusForm())
    },
    updateTask(e, task_id) {
      let payload = { id: task_id, task: e }
      this[UPDATE_TASK_CONTENT](payload)
      this.closeForm()
    },
    deleteCurrentTask() {
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
      if (!this.currentTask.on_progress || this.timerId) {
        return false
      }

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

      this.taskList = []
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
      let fromCompleted = (e.from.dataset.completed ? true : false)
      let taskId = Number.parseInt(e.clone.dataset.task_id)
      let payload = {
        fromDate: e.from.dataset.date,
        oldIndex: e.oldIndex,
        newIndex: 0,
        fromCompleted,
        toCompleted: false,
        taskId,
        isCurrent: true
      }
      this[UPDATE_TASK_ORDER](payload)
        .then(() => {
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
  watch: {
    currentTask: {
      immediate: true,
      handler(task) {
        if (task) {
        this.taskList = [task]
        this.disableDrag(true)
        this.computeElapsedTime()
        this.setTimer()
        } else {
          this.taskList = []
          this.disableDrag(false)
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.task-board {
  min-height: 82px;
  min-width: 372px;
  padding: 10px 11px 4px;
  background-color: $theme-green;
  box-shadow: 0 0 3px 1px rgba(9, 30, 66, .25);
  &__heading {
    font-size: 1.6rem;
  }
  &__header--top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 2px;
    height: 21px;
    margin-bottom: 2px;
  }
  &__header-left {
    color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    font-weight: bold;
  }
  &__header-right {
    padding-right: 10px;
    padding-left: 14px;
    padding-top: 1px;
    a {
      @include green-btn;
      display: inline-block;
      font-size: 1.8rem;
      padding-top: 2px;
    }
    i {
      font-weight: bold;
    }
  }
  &__ul {
    min-width: 280px;
    min-height: 49px;
    position: relative;
  }
  &__task {
    width: 100%;
    min-width: 300px;
  }
}
.drop-guide {
  position: absolute;
  background-color: #fff;
  color: #aaa;
  min-width: 300px;
  margin: 4px 0;
  padding: 5px 10px;
  line-height: 1.8;
  border-radius: 3px;
  box-shadow: 0 1px 0 rgba(9,30,66,.25);
}
.current-task {
  display: flex;
  align-items: center;
  &__right {
    min-width: 40px;
    text-align: right;
    margin-left: 8px;
  }
}
.elapsed-time {
  font-size: 1.6rem;
  background-color: #fff;
  border-radius: 3px;
  color: $theme-gray;
  padding: 1px 6px;
  margin-left: 4px;
}
.el-icon-upload2 {
  font-weight: bold;
}
</style>
