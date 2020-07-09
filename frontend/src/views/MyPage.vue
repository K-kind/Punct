<template>
  <div class="container">
    <section class="board">
      <h2 class="board__heading">ユーザー情報</h2>
      <div v-if="!partialForm">
        <div>
          <span>ユーザー名</span>
          <span>{{ user.name }}</span>
        </div>
        <div>
          <span>メールアドレス</span>
          <span>{{ user.email }}</span>
        </div>
      </div>
      <UserForm
        v-else
        @on-submit="onSubmit"
        :fields="fields"
        :buttonText="'更新する'"
      />
      <div>
        <el-button
          v-if="!partialForm"
          @click.prevent="openForm"
          class=""
          size="small"
          native-type="submit"
        >
          編集する
        </el-button>
        <el-button
          v-else
          @click.prevent="closeForm"
          class=""
          size="small"
          native-type="submit"
        >
          キャンセル
        </el-button>
      </div>
    </section>
  </div>
</template>

<script>
import UserForm from '@/components/UserForm.vue'
import { GET, UPDATE } from '@/store/mutation-types'

export default {
  name: 'MyPage',
  components: {
    UserForm
  },
  data() {
    return {
      partialForm: false,
      fullForm: false,
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
  computed: {
    user() {
      return this.$store.state.user.user
    }
  },
  methods: {
    openForm() {
      this.partialForm = true
    },
    closeForm() {
      this.partialForm = false
    },
    onSubmit(params) {
      this.$store.dispatch(`user/${UPDATE}`, params)
    },
  },
  created() {
    this.$store.dispatch(`user/${GET}`)
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
