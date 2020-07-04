<template>
  <div class="login">
    <section class="">
      <div class="">
        <div v-show="errorMessage" class="">
          <div class="">
            {{ errorMessage }}
          </div>
        </div>
        <div class="">
          <validation-observer v-slot="{ handleSubmit }" tag="div">
            <form @submit.prevent="handleSubmit(onSubmit)">
              <div class="">
                <validation-provider rules="required|email" v-slot="{ errors }" mode="eager" name="メールアドレス">
                  <input class="" type="email" placeholder="Eメール" v-model="email" autofocus="" name="email">
                  <span>{{ errors[0] }}</span>
                </validation-provider>
              </div>
              <div class="">
                <validation-provider rules="required|min:6|max:20" v-slot="{ errors }" mode="eager" name="パスワード">
                  <input class="" type="password" placeholder="パスワード" v-model="password" maxlength="20" name="password" autocomplete="on">
                  <span>{{ errors[0] }}</span>
                </validation-provider>
              </div>
              <div class="">
                <label class="">
                  <input type="checkbox">
                  ログインしたままにする
                </label>
              </div>
              <button type="submit">ログイン</button>
            </form>
          </validation-observer>
          <p class="">
            <a href="..">パスワードを忘れた方はこちら</a>
          </p>
        </div>
      </div>
    </section>
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
    errorMessage () {
      return this.$store.state.message.error
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

<style scoped>
</style>
