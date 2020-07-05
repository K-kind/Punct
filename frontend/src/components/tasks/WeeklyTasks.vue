<template>
  <div class="task-board">
    <div class="task-board__header">
      <a v-if="daysFromToday !== 0 || isArchive" href="Javascript:void(0)" @click="weekFoward(false)"><i class="el-icon-caret-left"></i></a>
      <span class="this-week"><h2 class="task-board__heading">{{ weekString }}</h2></span>
      <a v-if="daysFromToday !== 0 || !isArchive" href="Javascript:void(0)" @click="weekFoward(true)"><i class="el-icon-caret-right"></i></a>
    </div>
    <draggable tag="ul" group="WEEK" @end="onDragEnd" draggable=".draggable">
      <li v-for="task of weeklyTasks(weekRange.monday)" :key="task.id"  class="task-board__li" :class="{ draggable: !onUpdatedTaskId }" :data-task_id="task.id">
        <div v-if="onUpdatedTaskId !== task.id" class="task-board__task">
          <input type="checkbox" v-model="task.is_checked" @change="checkTask(task)" />
          <p class="task-board__p" @click="openUpdateForm(task.id)">
            {{ task.order }}: ID.{{ task.id }}: {{ task.content }}
            <span >完了({{ task.is_checked }})</span>
          </p>
        </div>
        <LongTermForm
          v-else
          :formIsOpen="true"
          :taskId="task.id"
          :taskContent="task.content"
          :isNewTask="false"
          ref="updateForm"
          @close-form="closeForm"
          @update-task="updateTask($event, task.id)"
          @delete-task="deleteTask"
        ></LongTermForm>
      </li>
    </draggable>
    <a @click="openForm" v-show="!newFormIsOpen" href="Javascript:void(0)" class="task-board__add">+週間タスクを追加</a>
    <LongTermForm
      :formIsOpen="newFormIsOpen"
      taskContent=""
      :isNewTask="true"
      ref="newForm"
      @close-form="closeForm"
      @add-task="addTask"
    ></LongTermForm>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { mapGetters, mapActions } from 'vuex'
import LongTermForm from '@/components/LongTermForm.vue'
import {
  ADD_NEW_TASK,
  UPDATE_TASK_CONTENT,
  DELETE_TASK_BY_ID,
  UPDATE_TASK_ORDER,
  SET_TASKS,
} from '@/store/mutation-types'

export default {
  name: 'WeeklyTask',
  components: {
    draggable,
    LongTermForm
  },
  data() {
    return {
      newFormIsOpen: false,
      onUpdatedTaskId: null,
      daysFromToday: 0,
    }
  },
  props: {
    isArchive: Boolean
  },
  computed: {
    ...mapGetters('weekly', ['weeklyTasks']),
    weekRange() {
      let today = new Date()
      let year = today.getFullYear()
      let month = today.getMonth()
      let date = today.getDate() + this.daysFromToday
      let day_num = today.getDay()
      let mondayDate = date - day_num + 1
      let sundayDate = mondayDate + 6
      let monday = new Date(year, month, mondayDate)
      let sunday = new Date(year, month, sundayDate)
      return { monday, sunday }
    },
    weekString() {
      let monday = this.weekRange.monday
      let sunday = this.weekRange.sunday
      let mondayString = `${monday.getMonth() + 1}/${monday.getDate()}(月)`
      let sundayString = `${sunday.getMonth() + 1}/${sunday.getDate()}(日)`
      return `${mondayString} - ${sundayString}`
    }
  },
  methods: {
    ...mapActions('weekly', [ADD_NEW_TASK,
UPDATE_TASK_CONTENT, DELETE_TASK_BY_ID, UPDATE_TASK_ORDER, SET_TASKS]),
    weekFoward(toFoward) {
      if (toFoward) {
        this.daysFromToday += 7
      } else {
        this.daysFromToday -= 7
      }
      let startDate = (this.daysFromToday === 0 ? null : this.weekRange.monday)
      this.$emit('change-week', startDate)
    },
    closeForm() {
      this.newFormIsOpen = false
      let self = this
      setTimeout(() => self.onUpdatedTaskId = null)
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
    addTask(e) { // e: { content }
      let tasks = this.weeklyTasks(this.weekRange.monday)
      let newOrder = tasks.length
      let newTask = {
        content: e.content,
        start_date: this.weekRange.monday.toLocaleDateString(),
        order: newOrder
      }
      this[ADD_NEW_TASK](newTask).then(() => {
        this.$refs.newForm.focusForm()
      })
    },
    updateTask(e, task_id) {
      let payload = { id: task_id, task: e }
      this[UPDATE_TASK_CONTENT](payload).then(() => {
        this.closeForm()
      })
    },
    deleteTask(taskId) {
      this[DELETE_TASK_BY_ID](taskId)
    },
    checkTask(task) {
      let payload = { id: task.id, task: { is_checked: task.is_checked } }
      this[UPDATE_TASK_CONTENT](payload)
    },
    onDragEnd(e) {
      if (e.oldIndex === e.newIndex) { return false }

      let payload = {
        oldIndex: e.oldIndex,
        newIndex: e.newIndex,
        startDate: this.weekRange.monday.toLocaleDateString(),
        taskId: Number.parseInt(e.clone.dataset.task_id)
      }
      this[UPDATE_TASK_ORDER](payload)
    }
  },
  watch: {
    daysFromToday(fromToday) {
      this[SET_TASKS](fromToday)
    }
  }
}
</script>

<style scoped>
.task-board {
  background-color: rgb(242, 255, 240);
}
.task-board__header {
  display: block;
  text-align: center;
}
.this-week {
  padding: 0 10px;
}
h2 {
  display: inline-block;
}
.task-board__task {
  display: flex;
  align-items: center;
}
.task-board__p {
  margin-left: 10px;
  width: 100%;
}
</style>
