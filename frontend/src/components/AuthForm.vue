<template>
  <div>
    <section class="board">
      <h2 class="board__heading"><slot name="heading"></slot></h2>
      <UserForm
        @on-submit="$emit('on-submit', $event)"
        :fields="fields"
        :buttonText="buttonText"
      />
      <el-divider>または</el-divider>
      <div class="board__bottom">
        <div class="board__btn-wrapper">
          <a
            :href="apiUrl"
            class="board__btn--google"
          >
            Googleで{{ buttonText }}
          </a>
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
    </ul>
    <div class="board__test-link">
      <TestLogin />
    </div>
  </div>
</template>

<script>
import UserForm from '@/components/UserForm.vue'
import TestLogin from '@/components/TestLogin.vue'
import { CLEAR } from '@/store/mutation-types'

export default {
  name: 'AuthForm',
  components: {
    UserForm,
    TestLogin
  },
  props: {
    fields: Array,
    buttonText: String
  },
  computed: {
    apiUrl() {
      return process.env.VUE_APP_API_URL + 'auth/google_oauth2'
    }
  },
  created() {
    this.$store.dispatch(`user/${CLEAR}`)
  },
}
</script>

<style scoped lang="scss">
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
    font-size: 12px;
    min-width: 134px;
    text-decoration: none;
    border-radius: 3px;
    background-color: #fff;
    padding: 7px 15px;
  }
  &__btn {
    &--google {
      @extend %__btn;
      color: $google;
      border: 1px solid $google;
      &:hover, &:focus {
        background-color: $light-google;
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
  &__test-link {
    text-align: center;
  }
}
</style>
