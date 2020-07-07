<template>
  <div class="task-board">
    <div class="task-board__header">
      <a v-if="monthsFromToday !== 0 || isArchive" href="Javascript:void(0)" @click="monthFoward(false)"><i class="el-icon-caret-left"></i></a>
      <span class="this-month"><h2 class="task-board__heading">{{ monthString }}</h2></span>
      <a v-if="monthsFromToday !== 0 || !isArchive" href="Javascript:void(0)" @click="monthFoward(true)"><i class="el-icon-caret-right"></i></a>
    </div>
    <div class="task-board__body">
      <draggable tag="ul" group="MONTH" @end="onDragEnd" draggable=".draggable">
        <li v-for="task of monthlyTasks(startDate)" :key="task.id" class="task-board__li" :class="{ draggable: !onUpdatedTaskId }" :data-task_id="task.id">
          <div v-if="onUpdatedTaskId !== task.id" class="task-board__task">
            <input type="checkbox" v-model="task.is_checked" @change="checkTask(task)"/>
            <p @click="openUpdateForm(task.id)" class="task-board__p">
              {{ task.content }}
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
      <a @click="openForm" v-show="!newFormIsOpen" href="Javascript:void(0)" class="task-board__add">+月間タスクを追加</a>
      <LongTermForm
        :formIsOpen="newFormIsOpen"
        taskContent=""
        :isNewTask="true"
        ref="newForm"
        @close-form="closeForm"
        @add-task="addTask"
      ></LongTermForm>
    </div>
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
  SET_TASKS
} from '@/store/mutation-types'

export default {
  name: 'MonthlyTask',
  components: {
    draggable,
    LongTermForm
  },
  data() {
    return {
      newFormIsOpen: false,
      onUpdatedTaskId: null,
      monthsFromToday: 0
    }
  },
  props: {
    // weekStartDate: Date,
    isArchive: Boolean
  },
  computed: {
    ...mapGetters('monthly', ['monthlyTasks']),
    startDate() {
      let today = new Date()
      let year = today.getFullYear()
      let month = today.getMonth() + this.monthsFromToday
      return new Date(year, month, 1)
    },
    monthString() {
      let year = this.startDate.getFullYear()
      let month = this.startDate.getMonth() + 1
      return `${year}年${month}月`
    }
  },
  methods: {
    ...mapActions('monthly', [ADD_NEW_TASK,
UPDATE_TASK_CONTENT, DELETE_TASK_BY_ID, UPDATE_TASK_ORDER, SET_TASKS]),
    monthFoward(toFoward) {
      if (toFoward) {
        this.monthsFromToday++
      } else {
        this.monthsFromToday--
      }
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
      let tasks = this.monthlyTasks(this.startDate)
      let newOrder = tasks.length
      let newTask = {
        content: e.content,
        start_date: this.startDate.toLocaleDateString(),
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
        startDate: this.startDate.toLocaleDateString(),
        taskId: Number.parseInt(e.clone.dataset.task_id)
      }
      this[UPDATE_TASK_ORDER](payload)
    }
  },
  watch: {
    monthsFromToday(fromToday) {
      this[SET_TASKS](fromToday)
    }
  }
}
</script>

<style scoped>
.task-board {
  /* background-color: rgb(242, 255, 240); */
}
.task-board__header {
  display: block;
  text-align: center;
}
.this-month {
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
