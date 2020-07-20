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
        :maxlength="255"
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
    <div class="buttons">
      <el-button
        @click.prevent="changeTask"
        size="mini"
        type="primary"
        native-type="submit"
      >
        {{ buttonText }}
      </el-button>
      <a @click="closeForm" class="close-btn" href="Javascript:void(0)"><i class="el-icon-close"></i></a>
      <el-button
        v-if="!isNewTask"
        class="delete-btn"
        @click.prevent="deleteTask"
        type="danger"
        icon="el-icon-delete"
        size="mini"
      ></el-button>
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
      return this.isNewTask ? '追加' : '更新'
    },
  },
  methods: {
    ...mapActions('daily', [DELETE_TASK_BY_ID]),
    formBlur(e) {
      if (
        this.taskContentData === this.taskContent &&
        this.taskExpectedTimeData == this.taskExpectedTime &&
        this.taskElapsedTimeData == this.taskElapsedTime &&
        !e.relatedTarget
      ) {
        this.$emit('close-form')
      }
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

<style scoped lang="scss">
.time-inputs {
  margin: 5px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.time-form__expected {
  margin-left: auto;
}
.buttons {
  padding-top: 4px;
  display: flex;
}
.delete-btn {
  margin-left: auto;
  padding: 4px 10px;
}
.close-btn {
  margin-left: 6px;
  font-size: 20px;
  padding-top: 1px;
  i {
    font-weight: bold;
    color: #999;
    &:hover {
      color: #6b778c;
    }
  }
}
</style>
