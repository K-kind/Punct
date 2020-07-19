<template>
  <div class="container">
    <h1>リダイレクトします</h1>
  </div>
</template>

<script>
import { CREATE } from '@/store/mutation-types'

export default {
  name: 'Oauth',
  created() {
    let message = 'ログインしました。'
    let duration = 2500
    let path = '/'
    if (!this.$store.state.auth.userName) {
      message = '認証に失敗しました。'
      duration = 4000
      path = '/login'
    }
    this.$store.dispatch(
      `message/${CREATE}`,
      { flash: message, duration }
    ).then(() => {
      this.$router.push(path)
    })
  }
}
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 32px;
}
</style>
