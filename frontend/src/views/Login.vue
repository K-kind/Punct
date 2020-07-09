<template>
  <div class="container">
    <AuthForm
      @on-submit="onSubmit"
      :fields="fields"
      :buttonText="'ログイン'"
    >
      <template #heading>ログイン</template>
      <template #switch-link>
        <router-link to="/signup">
          <i class="el-icon-caret-right"></i>
          新規登録はこちら
        </router-link>
      </template>
      <template #reset-link>
        <a href="..">
          <i class="el-icon-caret-right"></i>
          パスワードを忘れた方はこちら
        </a>
      </template>
    </AuthForm>
  </div>
</template>

<script>
import AuthForm from '@/components/AuthForm.vue'
import { CREATE } from '@/store/mutation-types'

export default {
  name: 'Login',
  components: {
    AuthForm
  },
  data() {
    return {
      fields: [
        {
          name: 'email',
          nameJa: 'メールアドレス',
          first: true,
          type: 'email',
          icon: 'el-icon-message',
          rules: 'required|email'
        },
        {
          name: 'password',
          nameJa: 'パスワード',
          first: false,
          type: 'password',
          icon: 'el-icon-unlock',
          rules: 'required|min:6|max:20'
        }
      ]
    }
  },
  methods: {
    onSubmit(params) {
      this.$store.dispatch(`auth/${CREATE}`, params)
    }
  },
  created() {
    let flash = this.$store.state.message.flash
    if (flash) {
      this.$notify({ message: flash, duration: 2500 })
    }
  },
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
