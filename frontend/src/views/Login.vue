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
        <a @click="dialogVisible = true" href="javascript:">
          <i class="el-icon-caret-right"></i>
          パスワードを忘れた方はこちら
        </a>
      </template>
    </AuthForm>
    <el-dialog
        :visible.sync="dialogVisible"
      >
        <span>メールアドレスを入力してください</span>
        <UserForm
          @on-submit="onResetSubmit"
          :fields="resetFields"
          :buttonText="'送信する'"
        />
      </el-dialog>
  </div>
</template>

<script>
import AuthForm from '@/components/AuthForm.vue'
import UserForm from '@/components/UserForm.vue'
import { CREATE, DESTROY } from '@/store/mutation-types'

export default {
  name: 'Login',
  components: {
    AuthForm,
    UserForm
  },
  data() {
    return {
      dialogVisible: false,
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
      ],
      resetFields: [
        {
          name: 'email',
          nameJa: 'メールアドレス',
          first: true,
          type: 'email',
          icon: 'el-icon-message',
          rules: 'required|email'
        }
      ]
    }
  },
  methods: {
    onSubmit(params) {
      this.$store.dispatch(`auth/${CREATE}`, params)
    },
    onResetSubmit(params) {
      this.$store.dispatch(`reset/${CREATE}`, params).then(() => {
        let flash = this.$store.state.message.flash
        if (flash) {
          this.dialogVisible = false
          this.$notify({ message: flash, duration: 3500, offset: 20 })
          this.$store.dispatch(`message/${DESTROY}`)
        }
      })
    }
  },
  created() {
    let flash = this.$store.state.message.flash
    if (flash) {
      this.$notify({ message: flash, duration: 2500, offset: 20 })
      // this.$store.dispatch(`message/${DESTROY}`) // 子コンポーネントで行われる
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
