<template>
  <el-collapse-transition>
    <div v-if="dateIsUpdated" class="container">
      <div @click="reload" class="notify">
        日付が変わりました。こちらをクリックしてページをリロードしてください。
      </div>
    </div>
  </el-collapse-transition>
</template>

<script>
const setTimer = (vm) => {
  vm.timerId = setInterval(() => {
    const today = (new Date).toLocaleDateString()
    if (today !== vm.createdDate) {
      vm.dateIsUpdated = true
    }
  }, 1000 * 60)
}

export default {
  name: 'ReloadNotify',
  data() {
    return {
      dateIsUpdated: false,
      timerId: null
    }
  },
  computed: {
    createdDate() {
      return (new Date).toLocaleDateString()
    }
  },
  methods: {
    reload() {
      this.$router.go({ path: this.$router.currentRoute.path, force: true })
    }
  },
  created() {
    setTimer(this)
  },
  destroyed() {
    clearInterval(this.timerId)
  }
}
</script>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: center;
  padding: 2px 0 16px;
}
.notify {
  background-color: $light-primary;
  border-radius: 4px;
  border: 1px solid $primary;
  cursor: pointer;
  color: $primary;
  padding: 16px 16px;
  &:hover {
    opacity: 0.9;
  }
}
</style>
