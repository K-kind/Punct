<template>
  <form v-show="formIsOpen" ref="form">
    <div class="content-block">
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
export default {
  name: 'LongTermForm',
  props: {
    formIsOpen: Boolean,
    taskId: Number,
    taskContent: String,
    isNewTask: Boolean,
  },
  data() {
    return {
      taskContentData: this.taskContent
    }
  },
  computed: {
    buttonText() {
      return this.isNewTask ? '追加' : '変更'
    },
  },
  methods: {
    formBlur(e) {
      const form = this.$refs.form
      const target = e.relatedTarget
      const foxTarget = e.explicitOriginalTarget
      const foxTargetClass = foxTarget ? foxTarget.className : ''
      if (
        this.taskContentData === this.taskContent &&
        !form.contains(target) &&
        foxTargetClass !== 'el-button' &&
        foxTargetClass !== 'el-icon-delete'
      ) {
        this.$emit('close-form', this.isNewTask)
      }
    },
    closeForm() {
      this.taskContentData = ''
      this.$emit('close-form', this.isNewTask)
    },
    focusForm() {
      this.$refs.contentForm.focus()
    },
    changeTask() {
      if (!this.taskContentData) {
        this.focusForm()
        return false
      }

      if (this.isNewTask) {
        this.$emit('add-task', { content: this.taskContentData })
        this.taskContentData = ''
      } else {
        this.$emit('update-task', { content: this.taskContentData })
      }
    },
    deleteTask() {
      this.$emit('delete-task', this.taskId)
    }
  }
}
</script>

<style scoped lang="scss">
.content-block {
  margin-bottom: 8px;
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
    color: #6b778c;
    font-weight: bold;
    &:hover {
      color: #aaa;
    }
  }
}
</style>
