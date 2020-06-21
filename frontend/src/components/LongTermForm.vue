<template>
  <form v-show="formIsOpen">
    <div class="content-block">
      <el-input
        v-model="taskContentData"
        ref="contentForm"
        @blur="formBlur"
        type="text"
        autocomplete="off"
        clearable
        size="small"
      />
    </div>
    <div>
      <input @click.prevent="changeTask" type="submit" :value="buttonText" ref="submitButton">
      <button v-if="!isNewTask" @click.prevent="deleteTask" ref="deleteButton">削除</button>
      <a @click="closeForm" href="Javascript:void(0)"><i class="el-icon-close"></i></a>
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
    formBlur() {
      let self = this
      setTimeout(() => {
        let activeElement = document.activeElement
        if (
          self.taskContentData === self.taskContent &&
          activeElement !== self.$refs.submitButton &&
          activeElement !== self.$refs.deleteButton
          ) {
          self.$emit('close-form')
        }
      })
    },
    closeForm() {
      this.taskContentData = ''
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

<style  scoped>
form {
  padding: 6px 10px;
}
.content-block {
  margin-bottom: 8px;
}
</style>