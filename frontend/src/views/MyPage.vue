<template>
  <div>
    <section class="board">
      <h2 class="board__heading">ユーザー情報</h2>
      <UserForm
        @on-submit="onSubmit"
        :fields="fields"
        :buttonText="'更新する'"
      />
      <el-divider>または</el-divider>
      <div class="board__bottom">
        <div class="board__btn-wrapper">
          <el-button
            size="small"
            class="board__btn--google"
          >
            Googleで{{ buttonText }}
          </el-button>
        </div>
      </div>
    </section>
    <ul class="board__links">
      <li class="board__link">
        <slot name="switch-link"></slot>
      </li>
      <li class="board__link">
        <slot name="reset-link"></slot>
      </li>
      <slot name="links"></slot>
    </ul>
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
    // onSubmit(params) {
    //   this.$store.dispatch(`auth/${CREATE}`, params)
    // }
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
  &__btn-wrapper {
    text-align: center;
    padding: 4px 0 8px;
    &--top {
      text-align: center;
      padding: 16px 0 8px;
    }
  }
  %__btn {
    font-weight: bold;
    min-width: 134px;
  }
  &__btn {
    &--google {
      @extend %__btn;
      color: $google !important;
      border-color: $google !important;
      &:hover, &:focus {
        background-color: $light-google !important;
      }
    }
  }
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
