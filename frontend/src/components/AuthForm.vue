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
          <el-button
            :href="`${process.env.API_URL}auth/google_oauth2`"
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
import { CLEAR, OAUTH } from '@/store/mutation-types'

export default {
  name: 'AuthForm',
  components: {
    UserForm
  },
  props: {
    fields: Array,
    buttonText: String
  },
  methods: {
    googleOuth() {
      this.$store.dispatch(`auth/${OAUTH}`)
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
