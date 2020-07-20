<template>
  <span>
    <el-button
      @click.prevent="onClick"
      class="login-btn"
      :class="{ disabled: nowLoading, big: bigButton }"
      size="small"
      native-type="submit"
    >
      <i v-if="nowLoading" class="el-icon-loading"></i>
      テストユーザーで体験
    </el-button>
  </span>
</template>

<script>
import { TEST_LOGIN } from '@/store/mutation-types'

export default {
  name: 'TestLogin',
  data() {
    return {
      nowLoading: false
    }
  },
  props: {
    bigButton: Boolean
  },
  methods: {
    onClick() {
      this.nowLoading = true
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
  & i {
    font-weight: bold;
  }
  &.disabled {
    pointer-events: none;
  }
  &.big {
    font-size: 1.6rem;
  }
}
</style>
