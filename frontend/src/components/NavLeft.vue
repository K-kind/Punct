<template>
  <div class="nav-left">
    <a @click="logOut" href="Javascript:void(0)">ログアウト</a>
  </div>
</template>

<script>
import { DESTROY } from '@/store/mutation-types'

export default {
  name: 'NavLeft',
  methods: {
    logOut() {
      this.$store.dispatch(`auth/${DESTROY}`)
    }
  }
}
</script>
