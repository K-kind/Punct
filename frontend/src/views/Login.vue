<template>
  <div class="container">
    <section class="board">
      <h2 class="board__heading">ログイン</h2>
      <div class="board__top">
        <ul
          v-for="error in errorMessages"
          :key="error"
          class="board__top-errors"
        >
          <li><span class="board__error">{{ error }}</span></li>
        </ul>
        <validation-observer v-slot="{ handleSubmit }" tag="div">
          <form @submit.prevent="handleSubmit(onSubmit)">
            <div>
              <validation-provider
                rules="required|email"
                v-slot="{ errors }"
                mode="eager"
                name="メールアドレス"
              >
                <el-input
                  v-model="email"
                  prefix-icon="el-icon-message"
                  type="email"
                  placeholder="メールアドレス"
                  name="email"
                  autocomplete="on"
                  autofocus
                  size="small"
                  :maxlength="255"
                />
                <p class="board__form-error">
                  <span class="board__error">{{ errors[0] }}</span>
                </p>
              </validation-provider>
            </div>
            <div class="">
              <validation-provider
                rules="required|min:6|max:20"
                v-slot="{ errors }"
                mode="eager"
                name="パスワード"
              >
                <el-input
                  v-model="password"
                  prefix-icon="el-icon-unlock"
                  type="password"
                  placeholder="パスワード"
                  name="password"
                  autocomplete="on"
                  size="small"
                />
                <p class="board__form-error">
                  <span class="board__error">{{ errors[0] }}</span>
                </p>
              </validation-provider>
            </div>
            <div class="board__check">
              <!-- <el-checkbox
                v-model="task.is_checked"
                @change="checkTask(task)"
              > -->
              <el-checkbox>
                ログインしたままにする
              </el-checkbox>
            </div>
            <div class="board__btn-wrapper--top">
              <el-button
                @click.prevent="handleSubmit(onSubmit)"
                class="board__btn--submit"
                size="small"
                native-type="submit"
              >
                ログイン
              </el-button>
            </div>
          </form>
        </validation-observer>
      </div>
      <el-divider>または</el-divider>
      <div class="board__bottom">
        <div class="board__btn-wrapper">
          <el-button
            size="small"
            class="board__btn--google"
          >
            Googleでログイン
          </el-button>
        </div>
        <!-- <div class="board__check">
          <el-checkbox>
            ログインしたままにする
          </el-checkbox>
        </div> -->
      </div>
    </section>
    <ul class="">
      <li>
        <a href="..">パスワードを忘れた方はこちら</a>
      </li>
      <li>
        <router-link to="/signup">新規登録はこちら</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import {
  CREATE,
  DESTROY
} from '@/store/mutation-types'

export default {
  name: 'Login',
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    onSubmit() {
      this.$store.dispatch(
        `auth/${CREATE}`, {
          email: this.email,
          password: this.password
        }
      )
    }
  },
  computed: {
    errorMessages () {
      return this.$store.state.message.errors
    }
  },
  created() {
    let flash = this.$store.state.message.flash
    if (flash) {
      this.$notify({ message: flash, duration: 2500 })
    }
    this.$store.dispatch(`message/${DESTROY}`)
  },
}
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.board {
  width: 340px;
  background-color: $light-gray;
  border-radius: 4px;
  padding: 20px;
  &__heading {
    padding-bottom: 16px;
  }
  &__error {
    color: $danger;
  }
  &__top-errors {
    padding: 8px 0;
  }
  &__form-error {
    line-height: 24px;
    padding: 4px 0;
  }
  &__check {
    padding: 4px 0;
  }
  &__btn-wrapper {
    text-align: center;
    &--top {
      text-align: center;
      padding-top: 8px;
    }
  }
  %__btn {
    font-weight: bold;
  }
  &__btn {
    &--submit {
      @extend %__btn;
      color: $theme-green !important;
      border-color: $theme-green !important;
      &:hover, &:focus {
        background-color: $super-light-green !important;
      }
    }
    &--google {
      @extend %__btn;
      color: $google !important;
      border-color: $google !important;
      &:hover, &:focus {
        background-color: $light-google !important;
      }
    }
  }
}

</style>
