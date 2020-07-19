<template>
  <div>
    <ul class="board__top-errors">
      <li
        v-for="error in errorMessages"
        :key="error"
      >
        <span class="board__error">{{ error }}</span>
      </li>
    </ul>
    <validation-observer v-slot="{ handleSubmit }" tag="div">
      <form @submit.prevent="handleSubmit(onSubmit)">
        <div v-for="f in fields" :key="f.name">
          <div>
            <validation-provider
              v-slot="{ errors }"
              :rules="f.rules"
              :mode="InteractionMode(f)"
              :name="f.nameJa"
            >
              <el-input
                v-model="params[f.name]"
                :prefix-icon="f.icon"
                :type="f.type"
                :placeholder="f.nameJa"
                :name="f.name"
                :ref="f.first ? 'first' : null"
                autocomplete="on"
                size="small"
                :maxlength="255"
              />
              <p class="board__form-error">
                <span class="board__error">{{ errors[0] }}</span>
              </p>
            </validation-provider>
          </div>
        </div>
        <div v-if="buttonText === 'ログイン'" class="board__check">
          <el-checkbox v-model="params.remember">
            ログインしたままにする
          </el-checkbox>
        </div>
        <div v-if="passwordOpen" class="board__check">
          <a @click="$emit('open-password')" href="javascript:">
            <i class="el-icon-caret-bottom"></i>
            パスワードを変更する
          </a>
        </div>
        <div class="board__btn-wrapper--top">
          <el-button
            @click.prevent="handleSubmit(onSubmit)"
            class="board__btn--submit"
            size="small"
            native-type="submit"
          >
            {{ buttonText }}
          </el-button>
        </div>
      </form>
    </validation-observer>
  </div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { DESTROY } from '@/store/mutation-types'

export default {
  name: 'UserForm',
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  props: {
    fields: Array,
    buttonText: String,
    passwordOpen: Boolean
  },
  data() {
    return {
      params: {
        name: '',
        email: '',
        email_confirmation: '',
        password: '',
        password_confirmation: '',
        remember: false
      },
    }
  },
  computed: {
    errorMessages() {
      return this.$store.state.message.errors
    },
  },
  methods: {
    InteractionMode(f) {
      if (f.first && !this.params[f.name]) {
        return 'passive'
      } else {
        return 'eager'
      }
    },
    onSubmit() {
      this.$emit('on-submit', this.params)
    }
  },
  created() {
    this.$store.dispatch(`message/${DESTROY}`)
    let user = this.$store.state.user.user
    if (user) {
      this.params.name = user.name
      this.params.email = user.email
    }
  },
  mounted() {
    this.$refs.first[0].focus()
  }
}
</script>

<style scoped lang="scss">
.board {
  &__error {
    color: $danger;
  }
  &__top-errors {
    padding: 8px 0;
    li {
      padding: 4px 0;
    }
  }
  &__form-error {
    line-height: 24px;
    padding: 4px 0;
  }
  &__check {
    line-height: 28px;
    a {
      @include green-link;
    }
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
    &--submit {
      @extend %__btn;
      color: $theme-green !important;
      border-color: $theme-green !important;
      &:hover, &:focus {
        background-color: $super-light-green !important;
      }
    }
  }
}
</style>
