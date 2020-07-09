<template>
  <div class="container">
    <section class="board">
      <h2 class="board__heading">ユーザー情報</h2>
      <div v-if="!partialForm" class="board__info">
        <div class="board__each-info">
          <div>
            <strong>ユーザー名</strong>
          </div>
          <div class="board__info-text">
            <span>{{ user.name }}</span>
          </div>
        </div>
        <div class="board__each-info">
          <div>
            <strong v-if="user.email">メールアドレス</strong>
            <strong v-else>ログイン方法</strong>
          </div>
          <div class="board__info-text">
            <span v-if="user.email">{{ user.email }}</span>
            <span v-else>Googleアカウント</span>
          </div>
        </div>
      </div>
      <UserForm
        v-else
        @on-submit="onSubmit"
        @open-password="openPassword"
        :fields="fields"
        :buttonText="'更新する'"
        :passwordOpen="!fullForm"
      />
      <div class="board__btn-wrapper">
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
import { GET, UPDATE, DESTROY } from '@/store/mutation-types'

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
      ],
      passwordFields:[
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
      this.closePassword()
    },
    openPassword() {
      this.fields.push(...this.passwordFields)
      this.fullForm = true
    },
    closePassword() {
      this.fields.splice(2, 2)
      this.fullForm = false
    },
    onSubmit(params) {
      this.$store.dispatch(`user/${UPDATE}`, params).then(() => {
        let flash = this.$store.state.message.flash
        if (flash) {
          this.closeForm()
          this.$notify({ message: flash, duration: 2500 })
          this.$store.dispatch(`message/${DESTROY}`)
        }
      })
    },
  },
  created() {
    this.$store.dispatch(`user/${GET}`).then(() => {
      if (!this.user.email) {
        this.fields.pop()
        this.fullForm = true
      }
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
  &__info {
    padding: 12px 0 8px;
  }
  &__each-info {
    padding: 8px 0;
  }
  &__info-text {
    padding-top: 8px;
  }
  &__btn-wrapper {
    padding-top: 4px;
    text-align: center;
  }
}
</style>
