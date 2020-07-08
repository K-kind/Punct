<template>
  <div>
    <section class="board">
      <h2 class="board__heading"><slot name="heading"></slot></h2>
      <div class="board__top">
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
                    v-model="models[f.name]"
                    :prefix-icon="f.icon"
                    :type="f.type"
                    :placeholder="f.nameJa"
                    :name="f.name"
                    :autofocus="f.first"
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
            <div class="board__check">
              <slot name="checkbox" />
            </div>
            <div class="board__btn-wrapper--top">
              <el-button
                @click.prevent="handleSubmit(onSubmit)"
                class="board__btn--submit"
                size="small"
                native-type="submit"
              >
                <slot name="heading"></slot>
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
            Googleで<slot name="heading"></slot>
          </el-button>
        </div>
      </div>
    </section>
    <slot name="links"></slot>
  </div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { DESTROY } from '@/store/mutation-types'

export default {
  name: 'AuthForm',
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  props: {
    fields: Array
  },
  data() {
    return {
      models: {
        name: '',
        email: '',
        email_confirmation: '',
        password: '',
        password_confirmation: '',
      },
    }
  },
  computed: {
    errorMessages () {
      return this.$store.state.message.errors
    },
  },
  methods: {
    InteractionMode(f) {
      if (f.first && !this.models[f.name]) {
        return 'passive'
      } else {
        return 'eager'
      }
    },
    onSubmit() {
      this.$emit('on-submit', this.models)
    }
  },
  created() {
    this.$store.dispatch(`message/${DESTROY}`)
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
.board {
  width: 340px;
  background-color: $light-gray;
  border-radius: 4px;
  padding: 20px;
  &__heading {
    padding-bottom: 4px;
  }
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
