<template>
  <div class="container">
    <AuthForm
      @on-submit="onSubmit"
      :fields="fields"
      :buttonText="'登録する'"
    >
      <template #heading>新規登録</template>
      <template #switch-link>
        <router-link to="/login">
          <i class="el-icon-caret-right"></i>
          ログインはこちら
        </router-link>
      </template>
    </AuthForm>
  </div>
</template>

<script>
import AuthForm from '@/components/AuthForm.vue'
import { CREATE } from '@/store/mutation-types'

export default {
  name: 'SignUp',
  components: {
    AuthForm
  },
  data() {
    return {
      fields: [
        {
          name: 'name',
          nameJa: 'ユーザー名',
          first: true,
          type: 'text',
          icon: 'el-icon-user',
          rules: 'required|max:8'
        },
        {
          name: 'email',
          nameJa: 'メールアドレス',
          first: false,
          type: 'email',
          icon: 'el-icon-message',
          rules: 'required|email'
        },
        {
          name: 'email_confirmation',
          nameJa: 'メールアドレス（確認）',
          first: false,
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
        },
        {
          name: 'password_confirmation',
          nameJa: 'パスワード（確認）',
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
      this.$store.dispatch(`user/${CREATE}`, params)
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
