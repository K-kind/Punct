<template>
  <div class="nav-left">
    <span @click="logOut">ログアウト</span>
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
