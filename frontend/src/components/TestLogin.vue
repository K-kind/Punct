<template>
  <el-button
    @click.prevent="onClick"
    class="login-btn"
    size="small"
    native-type="submit"
  >
    テストユーザーで体験
  </el-button>
</template>

<script>
import { TEST_LOGIN } from '@/store/mutation-types'

export default {
  name: 'TestLogin',
  methods: {
    onClick() {
      this.$store.dispatch(`auth/${TEST_LOGIN}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.login-btn {
  color: $primary !important;
  border-color: $primary !important;
  font-weight: bold;
  &:hover, &:focus {
    background-color: $light-primary !important;
  }
}
</style>
