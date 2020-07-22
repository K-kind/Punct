<template>
  <div class="home">
  </div>
</template>

<script>
const setTimer = (vm) => {
  setInterval(() => {
    console.log(vm.$dayjs().$s)
  }, 1000)
  // setInterval(() => {
  //   vm.$dayjs.isAfter
  // }, 1000 * 60)
  // this.timerId = setInterval(() => {
  //   self.computeElapsedTime()
  // }, 1000)
}

export default {
  name: 'ReloadNotify',
  data() {
    return {
      createdDate: (new Date).toLocaleDateString(),
      dateIsUpdated: false,
    }
  },
  // computed: {
  //   weekString() {
  //     let range = this.$store.state.weekly.weekString || '6日間'
  //     return `${range}のタスク`
  //   }
  // },
  created() {
    setTimer
    // setTimer(this)
  },
}
</script>

<style scoped lang="scss">

</style>
