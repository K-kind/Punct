<template>
  <div class="container">
    <div>
      <section class="board">
        <h2 class="board__heading">パスワード再設定</h2>
        <UserForm
          @on-submit="onSubmit"
          :fields="fields"
          :buttonText="'変更する'"
        />
      </section>
    </div>
  </div>
</template>

<script>
import UserForm from '@/components/UserForm.vue'
import { UPDATE, CHECK_TOKEN } from '@/store/mutation-types'

export default {
  name: 'Reset',
  components: {
    UserForm
  },
  data() {
    return {
      email: '',
      token: '',
      fields: [
        {
          name: 'password',
          nameJa: 'パスワード',
          first: true,
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
      ],
    }
  },
  methods: {
    onSubmit(params) {
      let payload = {
        user: params,
        email: this.email,
        token: this.token,
      }
      this.$store.dispatch(`reset/${UPDATE}`, payload)
    },
  },
  created() {
    this.email = this.$route.query.email
    this.token = this.$route.query.token
    this.$store.dispatch(`reset/${CHECK_TOKEN}`, {
      email: this.email, token: this.token
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
.board {
  width: 340px;
  background-color: $light-gray;
  border-radius: 4px;
  padding: 20px;
  &__heading {
    padding-bottom: 4px;
  }
}
</style>
