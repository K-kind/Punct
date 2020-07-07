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
      <div v-if="isCompletedTask" class="time-form__elapsed">
        <label class="time-label">
          経過(分)
          <el-input-number
            v-model="taskElapsedTimeData"
            @blur="formBlur"
            controls-position="right"
            size="small"
            :min="0"
            :max="999"
            :step="10"
          />
        </label>
      </div>
      <div class="time-form__expected">
        <label class="time-label">
          予定(分)
          <el-input-number
            v-model="taskExpectedTimeData"
            ref="expectedForm"
            @blur="formBlur"
            controls-position="right"
            size="small"
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
            expected_time: this.taskExpectedTimeData,
            elapsed_time: this.taskElapsedTimeData
          }
        )
        this.taskContentData = ''
        this.taskExpectedTimeData = 0
        this.taskElapsedTimeData = 0
      } else {
        let taskData = {
          content: this.taskContentData,
          expected_time: this.taskExpectedTimeData
        }
        if (this.isCompletedTask) {
          Object.assign(taskData, { elapsed_time: this.taskElapsedTimeData })
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
.time-inputs {
  margin: 5px 0;
  display: flex;
  justify-content: space-between;
}
.time-form__expected {
  margin-left: auto;
}
</style>
