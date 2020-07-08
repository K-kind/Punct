<template>
  <div class="container">
    <AuthForm
      @on-submit="onSubmit"
      :fields="fields"
    >
      <template #heading>ログイン</template>
      <template #checkbox>
        <el-checkbox>
          ログインしたままにする
        </el-checkbox>
      </template>
      <template #links>
        <ul class="board__links">
          <li class="board__link">
            <router-link to="/signup">新規登録はこちら</router-link>
          </li>
          <li class="board__link">
            <a href="..">パスワードを忘れた方はこちら</a>
          </li>
        </ul>
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
.board {
  &__links {
    padding: 24px 0;
  }
  &__link {
    line-height: 32px;
    a {
      @include green-link;
      font-weight: bold;
    }
  }
}
</style>
