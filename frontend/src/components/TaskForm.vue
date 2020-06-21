<template>
  <form v-show="formIsOpen">
    <div>
      <el-input
        v-model="taskContentData"
        ref="contentForm"
        @blur="formBlur"
        type="text"
        placeholder="タスク内容"
        autocomplete="off"
        clearable
        size="small"
      />
    </div>
    <div class="time-inputs">
      <div v-if="isCompletedTask" class="time-form">
        <label class="time-label">
          経過(分)
          <input
            v-model="taskElapsedTimeData"
            ref="elapsedForm"
            @blur="formBlur"
            type="number"
            class="time-input"
            :min="0"
            :max="999"
            :step="10"
          />
        </label>
      </div>
      <div class="time-form">
        <label class="time-label">
          予定(分)
          <input
            v-model="taskExpectedTimeData"
            ref="expectedForm"
            @blur="formBlur"
            type="number"
            class="time-input"
            :min="0"
            :max="999"
            :step="10"
          />
        </label>
      </div>
    </div>
    <div>
      <input @click.prevent="changeTask" type="submit" :value="buttonText" ref="submitButton">
      <button v-if="!isNewTask" @click.prevent="deleteTask" ref="deleteButton">削除</button>
      <a @click="closeForm" href="Javascript:void(0)"><i class="el-icon-close"></i></a>
    </div>
  </form>
</template>

<script>
import { mapActions } from 'vuex'
import { DELETE_TASK_BY_ID } from '@/store/mutation-types'

export default {
  name: 'TaskForm',
  props: {
    formIsOpen: Boolean,
    taskId: Number,
    taskContent: String,
    taskExpectedTime: Number,
    taskElapsedTime: Number,
    isNewTask: Boolean,
    isCompletedTask: Boolean,
  },
  data() {
    return {
      taskContentData: this.taskContent,
      taskExpectedTimeData: this.taskExpectedTime,
      taskElapsedTimeData: this.taskElapsedTime
    }
  },
  computed: {
    buttonText() {
      return this.isNewTask ? '追加' : '変更'
    },
  },
  methods: {
    ...mapActions('daily', [DELETE_TASK_BY_ID]),
    formBlur() {
      let self = this
      setTimeout(() => {
        let activeElement = document.activeElement
        if (
          self.taskContentData === self.taskContent &&
          self.taskExpectedTimeData == self.taskExpectedTime &&
          self.taskElapsedTimeData == self.taskElapsedTime &&
          activeElement !== self.$refs.elapsedForm &&
          activeElement !== self.$refs.expectedForm &&
          activeElement.className !== 'el-input__inner' &&
          activeElement !== self.$refs.submitButton &&
          activeElement !== self.$refs.deleteButton
          ) {
          self.$emit('close-form')
        }
      }, 100)
    },
    closeForm() {
      this.taskContentData = ''
      this.taskExpectedTimeData = 0
      this.taskElapsedTimeData = 0
      this.$emit('close-form')
    },
    focusForm() {
      this.$refs.contentForm.focus()
    },
    changeTask() {
      if (!this.taskContentData) {
        this.focusForm()
        return false
      }

      this.taskExpectedTimeData *= (1000 * 60)
      this.taskElapsedTimeData *= (1000 * 60)

      if (this.isNewTask) {
        this.$emit('add-task',
          {
            content: this.taskContentData,
            expectedTime: this.taskExpectedTimeData,
            elapsedTime: this.taskElapsedTimeData
          }
        )
        this.taskContentData = ''
        this.taskExpectedTimeData = 0
        this.taskElapsedTimeData = 0
      } else {
        let taskData = {
          content: this.taskContentData,
          expectedTime: this.taskExpectedTimeData
        }
        if (this.isCompletedTask) {
          Object.assign(taskData, { elapsedTime: this.taskElapsedTimeData })
        }
        this.$emit('update-task', taskData)
      }
    },
    deleteTask() {
      this[DELETE_TASK_BY_ID](this.taskId)
      this.closeForm()
      this.$emit('delete-current-task')
    }
  }
}
</script>

<style scoped>
.time-input {
  width: 55px;
  padding: 3px 0 3px 6px;
}
.time-label {
  margin-right: 6px;
}
.time-inputs {
  margin: 5px 0;
  display: flex;
  justify-content: flex-end;
}
.time-form {
  margin-left: 10px;
}
form {
  padding: 6px 10px;
}
</style>
