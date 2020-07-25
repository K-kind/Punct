<template>
  <div>
    <div class="container">
      <div>
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
                <strong>メールアドレス</strong>
              </div>
              <div class="board__info-text">
                <span>{{ user.email }}</span>
              </div>
            </div>
            <div v-if="user.provider" class="board__each-info">
              <div>
                <strong>ログイン方法</strong>
              </div>
              <div class="board__info-text">
                <span>Googleアカウント</span>
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
        <ul class="board__links">
          <li class="board__link">
            <a @click="dialogVisible = true" href="javascript:">
              退会する
            </a>
          </li>
        </ul>
        <el-dialog
          title="確認"
          :visible.sync="dialogVisible"
        >
          <span>退会すると全てのデータが削除されます。よろしいですか？</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">キャンセル</el-button>
            <el-button type="primary" @click="withdraw">退会</el-button>
          </span>
        </el-dialog>
      </div>
      <div v-if="user.is_test" class="for-test-user">
        <p>
          ※ 体験用ユーザーは、初回ログインから7日後に全データが削除されます。<br>
          正規ユーザーを作成される場合は、ログアウト後、新規登録にお進みください。
        </p>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import UserForm from '@/components/UserForm.vue'
import Footer from '@/components/Footer.vue'
import { GET, UPDATE, DESTROY } from '@/store/mutation-types'

export default {
  name: 'MyPage',
  components: {
    UserForm,
    Footer
  },
  data() {
    return {
      partialForm: false,
      fullForm: false,
      dialogVisible: false,
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
      if (!this.user.provider) {
        this.fullForm = false
      }
    },
    onSubmit(params) {
      this.$store.dispatch(`user/${UPDATE}`, params).then(() => {
        const flash = this.$store.state.message.flash
        const duration = this.$store.state.message.duration
        if (flash) {
          this.closeForm()
          this.$notify({ message: flash, duration, offset: 20 })
          this.$store.dispatch(`message/${DESTROY}`)
        }
      })
    },
    withdraw() {
      this.$store.dispatch(`user/${DESTROY}`)
    }
  },
  created() {
    this.$store.dispatch(`user/${GET}`).then(() => {
      if (this.user.provider) {
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
  padding-top: 40px;
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
  &__links {
    padding: 24px 0;
    text-align: right;
  }
  &__link {
    line-height: 32px;
    a {
      @include gray-link;
      text-decoration: underline;
    }
  }
}
.for-test-user {
  padding-bottom: 24px;
  p {
    line-height: 1.8;
  }
}
</style>
